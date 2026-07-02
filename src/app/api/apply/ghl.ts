/**
 * GHL v2 sync for application submissions. Contact + intake note +
 * opportunity in the Application Funnel's New Application stage.
 *
 * Field mapping note: the GHL custom-field group was scaffolded for the
 * earlier 12-question diagnostic, so its SINGLE_OPTIONS bands don't match
 * the locked v0.5 six-question set. The fields that map cleanly (URL,
 * schema score, readiness score/band) are written as custom fields; the
 * full answer set lands as a contact note so nothing is lost. Reconciling
 * the field group is a NEXT-STEPS item.
 */

const GHL_BASE = "https://services.leadconnectorhq.com";
const LOCATION_ID = process.env.GHL_LOCATION_ID ?? "GTfkjwM6RwadEVlbppbd";

const FIELD_IDS = {
  linkedinOrSiteUrl: "7RBkYgGV5hIrCaksPnQu",
  schemaScore: "2rrCd1YOxFbUCKAVmTu5",
  readinessScore: "y98VeuyCDyZ2FskelyX6",
  readinessBand: "KVMIzYHJm3A3LGXhvxt2",
};

const BAND_LABELS: Record<string, string> = {
  low: "Low (0-40)",
  mid: "Mid (41-70)",
  high: "High (71-100)",
};

function headers(apiKey: string) {
  return {
    Authorization: `Bearer ${apiKey}`,
    Version: "2021-07-28",
    "Content-Type": "application/json",
    Accept: "application/json",
  };
}

async function ghlFetch(
  apiKey: string,
  path: string,
  body: Record<string, unknown>,
): Promise<Record<string, unknown> | null> {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const res = await fetch(`${GHL_BASE}${path}`, {
        method: "POST",
        headers: headers(apiKey),
        body: JSON.stringify(body),
        signal: AbortSignal.timeout(10_000),
      });
      if (res.ok) return (await res.json()) as Record<string, unknown>;
      if (res.status < 500) {
        console.error(`[ghl] ${path} ${res.status}: ${await res.text()}`);
        return null;
      }
    } catch (err) {
      console.error(`[ghl] ${path} attempt ${attempt + 1} failed`, err);
    }
    await new Promise((r) => setTimeout(r, 500));
  }
  return null;
}

export async function syncApplicationToGhl(input: {
  name: string;
  email: string;
  scannedUrl: string;
  schemaScore: number | null;
  readinessScore: number;
  band: "low" | "mid" | "high";
  noteBody: string;
}): Promise<{ status: "synced" | "skipped" | "failed"; contactId?: string }> {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) return { status: "skipped" };

  const nameParts = input.name.trim().split(/\s+/);
  const firstName = nameParts[0] ?? input.name;
  const lastName = nameParts.slice(1).join(" ") || "-";

  const customFields: { id: string; value: string | number }[] = [
    { id: FIELD_IDS.readinessScore, value: input.readinessScore },
    { id: FIELD_IDS.readinessBand, value: BAND_LABELS[input.band] },
  ];
  if (input.scannedUrl) {
    customFields.push({
      id: FIELD_IDS.linkedinOrSiteUrl,
      value: input.scannedUrl,
    });
  }
  if (input.schemaScore !== null) {
    customFields.push({ id: FIELD_IDS.schemaScore, value: input.schemaScore });
  }

  // Upsert avoids duplicate-contact failures on repeat submissions.
  const contactRes = await ghlFetch(apiKey, "/contacts/upsert", {
    locationId: LOCATION_ID,
    firstName,
    lastName,
    email: input.email,
    source: "dream-site-application",
    tags: ["dream-site-application", `readiness-band-${input.band}`],
    customFields,
  });

  const contact = contactRes?.contact as { id?: string } | undefined;
  const contactId = contact?.id;
  if (!contactId) return { status: "failed" };

  await ghlFetch(apiKey, `/contacts/${contactId}/notes`, {
    body: input.noteBody,
    userId: undefined,
  });

  const pipelineId = process.env.GHL_PIPELINE_ID ?? "fTGbqmb1APZ7IRrQpzvP";
  const stageId =
    process.env.GHL_STAGE_ID_NEW_APPLICATION ??
    "34fb25b2-e527-4320-88e3-8b4805c44a24";

  const opp = await ghlFetch(apiKey, "/opportunities/", {
    locationId: LOCATION_ID,
    pipelineId,
    pipelineStageId: stageId,
    contactId,
    name: `${input.name} - Pre-Sold Author Package application`,
    monetaryValue: 30000,
    status: "open",
  });

  return { status: opp ? "synced" : "failed", contactId };
}
