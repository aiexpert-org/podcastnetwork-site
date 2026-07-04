import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import {
  ApplicationSchema,
  AUDIENCE_BANDS,
  BUDGET_ANSWERS,
  computeReadinessScore,
  KP_STATUS,
  readinessBand,
  SITUATIONS,
  TIMELINES,
} from "@/lib/application-schema";
import { rateLimit } from "@/lib/server-cache";
import { syncApplicationToGhl } from "./ghl";

export const runtime = "nodejs";

/**
 * Application intake. v0.6 pipeline:
 *   1. Validate with zod.
 *   2. Append to a JSON log (survives in Vercel function logs via console
 *      output; local file is best-effort).
 *   3. Sync directly to GHL: contact upsert + intake note + opportunity in the
 *      Application Funnel pipeline (fTGbqmb1APZ7IRrQpzvP). GHL owns the
 *      applicant confirmation and follow-up via its own workflow automations.
 *
 * Resend was retired 2026-07-03; GHL is the single downstream. The applicant
 * NEVER sees an error after a valid submit; downstream failures degrade to
 * warnings for the ops log.
 */

function labelFor(map: Record<string, string>, key: string): string {
  return map[key] ?? key;
}

export async function POST(req: Request) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!rateLimit(`apply:${ip}`, 10, 3600)) {
    return NextResponse.json({ error: "rate limited" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "invalid payload" }, { status: 400 });
  }

  const parsed = ApplicationSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "validation failed", issues: parsed.error.issues },
      { status: 400 },
    );
  }

  const app = parsed.data;
  const readinessScore = computeReadinessScore({
    schemaScore: app.schemaScore ?? null,
    audience: app.audience,
    situation: app.situation,
    timeline: app.timeline,
  });
  const band = readinessBand(readinessScore);
  const submittedAt = new Date().toISOString();
  const record = { ...app, readinessScore, band, submittedAt, ip: undefined };

  // 1. Durable-enough log: console (captured by Vercel) + best-effort file.
  console.log("[application-submit]", JSON.stringify(record));
  try {
    await mkdir("/tmp/pn-applications", { recursive: true });
    await appendFile(
      "/tmp/pn-applications/log.jsonl",
      JSON.stringify(record) + "\n",
    );
  } catch {
    // /tmp write failure is non-fatal; console log is the safety net.
  }

  const warnings: string[] = [];

  // 2. GHL: contact + intake note + opportunity in the Application Funnel.
  // Never fails the applicant; degrades to a warning for the ops log.
  const noteBody = [
    `PodcastNetwork.org application (${submittedAt})`,
    ``,
    `Situation: ${labelFor(SITUATIONS, app.situation)}`,
    `Knowledge Panel today: ${labelFor(KP_STATUS, app.kpStatus)}`,
    `Audience size: ${labelFor(AUDIENCE_BANDS, app.audience)}`,
    `Timeline: ${labelFor(TIMELINES, app.timeline)}`,
    `Budget fit: ${labelFor(BUDGET_ANSWERS, app.budget)}`,
    `Scanned URL: ${app.scannedUrl || "(not scanned)"}`,
    `Schema score: ${app.schemaScore ?? "n/a"}/100`,
    `Readiness score: ${readinessScore}/100 (${band})`,
    `What would it change: ${app.openText || "(blank)"}`,
  ].join("\n");

  const ghl = await syncApplicationToGhl({
    name: app.name,
    email: app.email,
    scannedUrl: app.scannedUrl ?? "",
    schemaScore: app.schemaScore ?? null,
    readinessScore,
    band,
    noteBody,
  });
  if (ghl.status === "failed") warnings.push("crm_sync_pending");
  if (ghl.status === "skipped") warnings.push("crm_pending_ghl_key");

  return NextResponse.json({
    status: "submitted",
    readinessScore,
    band,
    ...(warnings.length > 0 ? { warnings } : {}),
  });
}
