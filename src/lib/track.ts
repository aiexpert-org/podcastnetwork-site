/**
 * Analytics event helper. Name-only tracking, no PII in payloads. Safe to
 * call anywhere: no-ops when PostHog isn't configured or hasn't loaded.
 */
export function track(
  event:
    | "you_search_submit"
    | "playhead_drag"
    | "schema_validator_run"
    | "case_study_open"
    | "application_start"
    | "application_step_complete"
    | "application_submit",
  properties?: Record<string, string | number | boolean>,
) {
  if (typeof window === "undefined") return;
  const ph = (
    window as unknown as {
      posthog?: { capture: (e: string, p?: object) => void };
    }
  ).posthog;
  ph?.capture(event, properties);
}
