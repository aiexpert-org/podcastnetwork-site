/*
 * Retained for backward compatibility with any v0.1 import path. The real
 * runner now lives at src/app/portal/[authorSlug]/quiz/QuizRunner.tsx and
 * mounts directly from the /quiz route.
 */
export function QuizPlaceholder() {
  return (
    <div className="rounded-2xl border border-portal-line bg-portal-surface p-8 text-center">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-muted">
        Quiz
      </p>
      <h3 className="mt-3 font-portal-serif text-xl font-semibold text-portal-ink">
        Communication DNA Quiz
      </h3>
      <p className="mx-auto mt-3 max-w-md text-sm text-portal-muted">
        Take the assessment inside your portal. Your result anchors every
        piece of copy PodcastNetwork.org writes on your behalf.
      </p>
    </div>
  )
}
