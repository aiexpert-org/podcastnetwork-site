"use client";

import { useState } from "react";
import { SchemaValidator } from "@/components/validator/SchemaValidator";
import { ApplicationDiagnostic } from "@/components/application/ApplicationDiagnostic";
import type { SchemaScoreReport } from "@/app/api/schema-scan/route";

/**
 * The /apply/ flow: the schema validator is intake step 1; its score feeds
 * the diagnostic's readiness computation.
 */
export function ApplyFlow() {
  const [report, setReport] = useState<SchemaScoreReport | null>(null);

  return (
    <div className="space-y-14">
      <div>
        <p className="text-eyebrow text-foil-dark">Step 1 of 2</p>
        <h2 className="text-display-2 mt-3">
          First, let&apos;s see where you stand today.
        </h2>
        <p className="measure mt-4 text-slate">
          Paste any URL that represents your public presence. Personal site,
          About page, LinkedIn profile, anything. We fetch it, extract every
          structured-data block, and score it against a full Knowledge Panel
          entity graph.
        </p>
        <div className="mt-8">
          <SchemaValidator
            showApplyCTA={false}
            onScanComplete={(r) => setReport(r)}
          />
        </div>
        {report && (
          <p className="text-body-sm mt-4 text-slate">
            That&apos;s your current authority baseline. Now let&apos;s talk
            about where you want to go.
          </p>
        )}
      </div>

      <div>
        <p className="text-eyebrow text-foil-dark">Step 2 of 2</p>
        <h2 className="text-display-2 mt-3">Six questions.</h2>
        <p className="measure mt-4 text-slate">
          {report
            ? "Your schema score carries into the readiness computation below."
            : "You can run the scan above first (recommended) or go straight to the questions."}
        </p>
        <div className="mt-8">
          <ApplicationDiagnostic
            schemaScore={report?.totalScore ?? null}
            scannedUrl={report?.url ?? ""}
          />
        </div>
      </div>
    </div>
  );
}
