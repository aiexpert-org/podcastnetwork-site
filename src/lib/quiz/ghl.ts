import type { QuizResults } from '@/components/quiz/types';
import { generateGhlTags } from '@/components/quiz/scoring';

interface GhlContactPayload {
  email: string;
  firstName?: string;
  tags?: string[];
  customFields?: { key: string; field_value: string }[];
}

async function upsertContact(
  locationId: string,
  apiKey: string,
  payload: GhlContactPayload
): Promise<void> {
  const res = await fetch(
    `https://services.leadconnectorhq.com/contacts/upsert`,
    {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        Version: '2021-07-28',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        locationId,
        email: payload.email,
        firstName: payload.firstName,
        tags: payload.tags,
        customFields: payload.customFields,
      }),
    }
  );

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`GHL upsert failed: ${res.status} ${body}`);
  }
}

export async function submitQuizToGhl(
  email: string,
  firstName: string | undefined,
  results: QuizResults,
  variant: 'long' | 'short',
  site: 'brettkmoore' | 'podcastnetwork'
): Promise<void> {
  const apiKey = process.env.GHL_API_KEY;
  if (!apiKey) throw new Error('GHL_API_KEY not set');

  const locationId =
    site === 'brettkmoore'
      ? process.env.GHL_LOCATION_ID_BKM
      : process.env.GHL_LOCATION_ID_PN;

  if (!locationId) {
    throw new Error(`GHL_LOCATION_ID_${site === 'brettkmoore' ? 'BKM' : 'PN'} not set`);
  }

  const tags = generateGhlTags(results, variant);

  const customFields = [
    {
      key: 'quiz_overall_score',
      field_value: String(results.overallScore),
    },
    {
      key: 'quiz_score_tier',
      field_value: results.tierLabel,
    },
    {
      key: 'quiz_archetype',
      field_value: results.archetype.name,
    },
    {
      key: 'quiz_variant',
      field_value: variant,
    },
  ];

  await upsertContact(locationId, apiKey, {
    email,
    firstName: firstName || undefined,
    tags,
    customFields,
  });
}
