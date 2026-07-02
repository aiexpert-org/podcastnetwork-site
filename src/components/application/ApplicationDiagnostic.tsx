"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/Button";
import { track } from "@/lib/track";
import {
  ApplicationSchema,
  AUDIENCE_BANDS,
  BUDGET_ANSWERS,
  computeReadinessScore,
  KP_STATUS,
  readinessInterpretation,
  SITUATIONS,
  TIMELINES,
  type ApplicationPayload,
} from "@/lib/application-schema";

type StepField = {
  kind: "identity" | "radio" | "final";
  key?: keyof ApplicationPayload;
  question: string;
  options?: Record<string, string>;
};

const STEPS: StepField[] = [
  {
    kind: "identity",
    question: "What's your name, and where can we reach you?",
  },
  {
    kind: "radio",
    key: "situation",
    question: "What's your current professional situation?",
    options: SITUATIONS,
  },
  {
    kind: "radio",
    key: "kpStatus",
    question: "Do you already have a Google Knowledge Panel?",
    options: KP_STATUS,
  },
  {
    kind: "radio",
    key: "audience",
    question:
      "What size audience do you have today across email, social, and podcast subscribers?",
    options: AUDIENCE_BANDS,
  },
  {
    kind: "radio",
    key: "timeline",
    question: "What's your timeline for the launch you're planning?",
    options: TIMELINES,
  },
  {
    kind: "final",
    key: "budget",
    question:
      "The Pre-Sold Author Package is $30,000, delivered over six months. Are you ready to invest at that level?",
    options: BUDGET_ANSWERS,
  },
];

export function ApplicationDiagnostic({
  schemaScore,
  scannedUrl,
}: {
  schemaScore: number | null;
  scannedUrl: string;
}) {
  const [step, setStep] = useState(0);
  const [submitState, setSubmitState] = useState<
    "idle" | "submitting" | "done" | "error"
  >("idle");
  const [result, setResult] = useState<{ readinessScore: number } | null>(null);

  const {
    register,
    handleSubmit,
    trigger,
    watch,
    formState: { errors },
  } = useForm<ApplicationPayload>({
    resolver: zodResolver(ApplicationSchema),
    mode: "onTouched",
    defaultValues: {
      openText: "",
      scannedUrl,
      schemaScore,
    },
  });

  const values = watch();
  const current = STEPS[step];

  const advance = async () => {
    let valid = false;
    if (current.kind === "identity") {
      valid = await trigger(["name", "email"]);
    } else if (current.key) {
      valid = await trigger(current.key as "situation");
    }
    if (valid) {
      if (step === 0) track("application_start");
      track("application_step_complete", { step: step + 1 });
      setStep((s) => Math.min(s + 1, STEPS.length - 1));
    }
  };

  const onSubmit = handleSubmit(async (data) => {
    setSubmitState("submitting");
    try {
      const res = await fetch("/api/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, schemaScore, scannedUrl }),
      });
      if (!res.ok) throw new Error("submit failed");
      const json = await res.json();
      track("application_submit");
      setResult({ readinessScore: json.readinessScore });
      setSubmitState("done");
    } catch {
      setSubmitState("error");
    }
  });

  const previewScore =
    values.situation && values.audience && values.timeline
      ? computeReadinessScore({
          schemaScore,
          audience: values.audience,
          situation: values.situation,
          timeline: values.timeline,
        })
      : null;

  if (submitState === "done" && result) {
    return (
      <div className="rounded-xl border border-ink/8 bg-papyrus p-8 text-center">
        <p className="text-eyebrow text-foil-dark">Application received</p>
        <p
          className="mt-3 font-mono text-5xl font-semibold text-ink tabular-nums"
          data-mono
        >
          {result.readinessScore}
          <span className="text-2xl text-slate">/100</span>
        </p>
        <p className="text-caption mt-1 text-slate">Your readiness score</p>
        <p className="text-lead measure mx-auto mt-5 text-ink">
          {readinessInterpretation(result.readinessScore)}
        </p>
        <p className="text-body-sm mt-4 text-slate">
          We review within 3 business days. If we&apos;re a fit, Brett or Mike
          will email to schedule a 20-minute discovery call. A confirmation is
          on its way to your inbox.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="rounded-xl border border-ink/8 bg-papyrus p-6 sm:p-8"
    >
      <div className="mb-6 flex items-center justify-between">
        <p className="text-caption text-slate">
          Question {step + 1} of {STEPS.length}
        </p>
        <div
          className="h-1.5 w-40 overflow-hidden rounded-full bg-ink/10"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={STEPS.length}
          aria-valuenow={step + 1}
        >
          <div
            className="h-full bg-foil transition-all duration-300"
            style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.fieldset
          key={step}
          initial={{ opacity: 0, x: 16 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -16 }}
          transition={{ duration: 0.2 }}
        >
          <legend className="text-h4 text-ink">{current.question}</legend>

          {current.kind === "identity" && (
            <div className="mt-5 space-y-4">
              <div>
                <label htmlFor="app-name" className="text-caption text-slate">
                  Full name
                </label>
                <input
                  id="app-name"
                  type="text"
                  {...register("name")}
                  className="mt-1 w-full rounded-md border border-ink/15 bg-white px-4 py-3 text-ink focus:border-foil focus:outline-none"
                />
                {errors.name && (
                  <p className="text-caption mt-1 text-error">
                    Enter your full name (2+ characters).
                  </p>
                )}
              </div>
              <div>
                <label htmlFor="app-email" className="text-caption text-slate">
                  Email
                </label>
                <input
                  id="app-email"
                  type="email"
                  {...register("email")}
                  className="mt-1 w-full rounded-md border border-ink/15 bg-white px-4 py-3 text-ink focus:border-foil focus:outline-none"
                />
                {errors.email && (
                  <p className="text-caption mt-1 text-error">
                    Enter a valid email address.
                  </p>
                )}
              </div>
            </div>
          )}

          {(current.kind === "radio" || current.kind === "final") &&
            current.options &&
            current.key && (
              <div className="mt-5 space-y-2" role="radiogroup">
                {Object.entries(current.options).map(([value, label]) => (
                  <label
                    key={value}
                    className="flex cursor-pointer items-center gap-3 rounded-md border border-ink/10 bg-white px-4 py-3 transition-colors hover:border-foil has-checked:border-foil has-checked:bg-foil/10"
                  >
                    <input
                      type="radio"
                      value={value}
                      {...register(current.key as "situation")}
                      className="accent-[#c4a365]"
                    />
                    <span>{label}</span>
                  </label>
                ))}
                {current.key && errors[current.key] && (
                  <p className="text-caption text-error">Pick one to continue.</p>
                )}
              </div>
            )}

          {current.kind === "final" && (
            <div className="mt-6">
              <label htmlFor="app-open" className="text-caption text-slate">
                Optional: what would a Google-recognized entity change for you?
              </label>
              <textarea
                id="app-open"
                rows={3}
                {...register("openText")}
                className="mt-1 w-full rounded-md border border-ink/15 bg-white px-4 py-3 text-ink focus:border-foil focus:outline-none"
              />
            </div>
          )}
        </motion.fieldset>
      </AnimatePresence>

      {current.kind === "final" && previewScore !== null && (
        <div className="mt-6 rounded-lg border border-foil/40 bg-foil/10 p-4">
          <p className="text-body-sm text-ink">
            Your readiness score:{" "}
            <span className="font-mono font-semibold" data-mono>
              {previewScore}/100
            </span>
            . {readinessInterpretation(previewScore)}
          </p>
        </div>
      )}

      {submitState === "error" && (
        <p className="text-body-sm mt-4 text-error">
          Something failed on our side. Try once more, or email
          brett@podcastnetwork.org directly.
        </p>
      )}

      <div className="mt-7 flex items-center justify-between">
        <Button
          variant="ghost"
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
        >
          ← Back
        </Button>
        {current.kind === "final" ? (
          <Button
            type="submit"
            variant="primary"
            disabled={submitState === "submitting"}
          >
            {submitState === "submitting"
              ? "Submitting…"
              : "Submit application"}
          </Button>
        ) : (
          <Button variant="primary" onClick={advance}>
            Next →
          </Button>
        )}
      </div>
    </form>
  );
}
