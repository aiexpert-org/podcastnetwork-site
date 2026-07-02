import { NextResponse } from "next/server";
import { appendFile, mkdir } from "node:fs/promises";
import { Resend } from "resend";
import {
  ApplicationSchema,
  AUDIENCE_BANDS,
  BUDGET_ANSWERS,
  computeReadinessScore,
  KP_STATUS,
  readinessBand,
  readinessInterpretation,
  SITUATIONS,
  TIMELINES,
} from "@/lib/application-schema";
import { rateLimit } from "@/lib/server-cache";
import { syncApplicationToGhl } from "./ghl";

export const runtime = "nodejs";

/**
 * Application intake. v0.5 pipeline:
 *   1. Validate with zod.
 *   2. Append to a JSON log (survives in Vercel function logs via console
 *      output; local file is best-effort).
 *   3. Email the full submission to brett@brettkmoore.com via Resend, plus a
 *      confirmation email to the applicant.
 *
 * GHL contact/opportunity creation is deferred (no PAT staged). See
 * NEXT-STEPS.md. The applicant NEVER sees an error after a valid submit;
 * downstream failures degrade to warnings.
 */

const NOTIFY_TO = "brett@brettkmoore.com";
const FROM_ADDRESS =
  process.env.RESEND_FROM ?? "PodcastNetwork.org <onboarding@resend.dev>";

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

  // 2. GHL: contact + intake note + opportunity in New Application. Never
  // fails the applicant; degrades to a warning for the ops log.
  const noteBody = [
    `Pre-Sold Author Package application (${submittedAt})`,
    ``,
    `Situation: ${labelFor(SITUATIONS, app.situation)}`,
    `Knowledge Panel today: ${labelFor(KP_STATUS, app.kpStatus)}`,
    `Audience size: ${labelFor(AUDIENCE_BANDS, app.audience)}`,
    `Timeline: ${labelFor(TIMELINES, app.timeline)}`,
    `Budget ($30,000): ${labelFor(BUDGET_ANSWERS, app.budget)}`,
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

  const resendKey = process.env.RESEND_API_KEY;

  if (resendKey) {
    const resend = new Resend(resendKey);
    const summaryHtml = `
      <h2>New Pre-Sold Author Package application</h2>
      <table cellpadding="6" style="border-collapse: collapse; font-family: sans-serif;">
        <tr><td><strong>Name</strong></td><td>${app.name}</td></tr>
        <tr><td><strong>Email</strong></td><td>${app.email}</td></tr>
        <tr><td><strong>Situation</strong></td><td>${labelFor(SITUATIONS, app.situation)}</td></tr>
        <tr><td><strong>Knowledge Panel today</strong></td><td>${labelFor(KP_STATUS, app.kpStatus)}</td></tr>
        <tr><td><strong>Audience size</strong></td><td>${labelFor(AUDIENCE_BANDS, app.audience)}</td></tr>
        <tr><td><strong>Timeline</strong></td><td>${labelFor(TIMELINES, app.timeline)}</td></tr>
        <tr><td><strong>Budget ($30,000)</strong></td><td>${labelFor(BUDGET_ANSWERS, app.budget)}</td></tr>
        <tr><td><strong>Scanned URL</strong></td><td>${app.scannedUrl || "(not scanned)"}</td></tr>
        <tr><td><strong>Schema score</strong></td><td>${app.schemaScore ?? "n/a"}/100</td></tr>
        <tr><td><strong>Readiness score</strong></td><td>${readinessScore}/100 (${band})</td></tr>
        <tr><td><strong>What would it change</strong></td><td>${app.openText || "(blank)"}</td></tr>
        <tr><td><strong>Submitted</strong></td><td>${submittedAt}</td></tr>
      </table>`;

    try {
      const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: NOTIFY_TO,
        replyTo: app.email,
        subject: `Application: ${app.name} (readiness ${readinessScore}/100)`,
        html: summaryHtml,
      });
      if (error) warnings.push("notify_email_failed");
    } catch {
      warnings.push("notify_email_failed");
    }

    try {
      const firstName = app.name.split(" ")[0];
      const { error } = await resend.emails.send({
        from: FROM_ADDRESS,
        to: app.email,
        replyTo: "brett@podcastnetwork.org",
        subject: `Application received: ${app.name}`,
        html: `
          <p>Hi ${firstName},</p>
          <p>We received your Pre-Sold Author Package application. Here's what happens next:</p>
          <ol>
            <li>Our team reviews within 3 business days</li>
            <li>If we're a fit, Brett or Mike will email to schedule a 20-minute discovery call</li>
            <li>The discovery call happens within a week of that email</li>
          </ol>
          <p>Your readiness score came in at ${readinessScore}/100. ${readinessInterpretation(readinessScore)}</p>
          <p>Questions in the meantime: reply to this email.</p>
          <p>Brett + Mike<br/>PodcastNetwork.org</p>`,
      });
      if (error) warnings.push("confirmation_email_failed");
    } catch {
      warnings.push("confirmation_email_failed");
    }
  } else {
    warnings.push("email_pending_resend_key");
  }

  return NextResponse.json({
    status: "submitted",
    readinessScore,
    band,
    ...(warnings.length > 0 ? { warnings } : {}),
  });
}
