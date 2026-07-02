import type { Metadata } from "next";
import bookPayload from "../../../../content/schema/06-book.json";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { AiOrDieMetrics } from "@/components/case-studies/AiOrDieMetrics";
import { SchemaGraph } from "@/components/seo/SchemaGraph";
import { aiOrDieSchema } from "@/lib/schema-graph";
import { AiOrDieGraphInset } from "@/components/case-studies/AiOrDieGraphInset";

export const metadata: Metadata = {
  title: "AI or Die — The founder-run case study",
  description:
    "Brett K Moore and Mike Partners ran the Pre-Sold Author Package on themselves before selling it to anyone. AI or Die launched 2026-06-24. Live metrics refresh hourly.",
  alternates: { canonical: "/case-studies/ai-or-die/" },
};

const ARC = [
  {
    phase: "Day 1 to 30",
    body: "Manuscript work in flight with Legacy Publishing. Podcast production stood up. Entity Home built. Knowledge panel work seeded on Wikidata.",
  },
  {
    phase: "Day 30 to 90",
    body: "Podcast in-market and shipping episodes on cadence. Knowledge panel indexing in motion. Guest appearance sequence live. Waitlist accepting sign-ups.",
  },
  {
    phase: "Day 90 to 180",
    body: "Manuscript into final production with Legacy. Knowledge panels maturing. Guest appearance count building. Waitlist growing toward the Day 180 pre-order target.",
  },
  {
    phase: "Day 180",
    body: "Book launched 2026-06-24. Pre-orders converted. Knowledge panel entity work live and indexing. Podcast established in-market.",
  },
];

export default function AiOrDiePage() {
  return (
    <>
      <SchemaGraph schema={aiOrDieSchema()} />
      <Header />
      <main>
        <Section>
          <Eyebrow>The anchor case study.</Eyebrow>
          <h1 className="text-display-1 mt-4 max-w-4xl">AI or Die.</h1>
          <p className="text-lead measure mt-6 text-slate">
            Before the Pre-Sold Author Package was ever offered to an outside
            author, Brett K Moore and Mike Partners ran the full package on
            themselves. Same book pipeline through Legacy Publishing. Same
            podcast-driven audience build. Same knowledge panel work. Same
            waitlist mechanics. If the sequence had not produced the outcomes,
            we would have rebuilt it before taking a single outside
            author&apos;s payment.
          </p>
        </Section>

        {/* Entity graph inset: AI or Die's node neighborhood */}
        <AiOrDieGraphInset />

        <Section>
          <Eyebrow>Live state.</Eyebrow>
          <h2 className="text-display-2 mt-4">
            The launch, happening now.
          </h2>
          <p className="text-body-sm measure mt-5 text-slate">
            The book launched 2026-06-24. What you see below is not a
            projection or a retrospective assembled after the fact. It is the
            launch in progress, and it refreshes hourly.
          </p>
          <div className="mt-10">
            <AiOrDieMetrics variant="full" />
          </div>
        </Section>

        <Section className="border-t border-ink/8">
          <Eyebrow>The schema graph.</Eyebrow>
          <h2 className="text-display-2 mt-4">
            The actual JSON-LD behind the entity.
          </h2>
          <p className="text-body-sm measure mt-5 text-slate">
            This is the Book entity as it ships in this page&apos;s own
            structured data. Google reads exactly this.
          </p>
          <pre
            className="text-mono-body mt-8 max-h-[480px] overflow-auto rounded-xl border border-viz-border bg-viz-ink p-6 text-papyrus/85"
            data-mono
          >
            {JSON.stringify(
              Object.fromEntries(
                Object.entries(bookPayload).filter(
                  ([k, v]) =>
                    !k.startsWith("$") &&
                    !(typeof v === "string" && v.includes("{{")),
                ),
              ),
              null,
              2,
            )}
          </pre>
        </Section>

        <Section className="border-t border-ink/8">
          <Eyebrow>The arc, as it ran.</Eyebrow>
          <h2 className="text-display-2 mt-4">Month by month.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-2">
            {ARC.map((a) => (
              <div
                key={a.phase}
                className="rounded-xl border border-ink/8 bg-papyrus p-7"
              >
                <p className="text-caption tracking-[0.12em] text-foil-dark">
                  {a.phase}
                </p>
                <p className="text-body-sm mt-3 text-slate">{a.body}</p>
              </div>
            ))}
          </div>
          <p className="text-body-sm measure mt-10 text-slate">
            The Pre-Sold Author Package works because the founders ran it on
            themselves first. Every author inside the current cohort runs the
            same sequence, on the same 180-day clock, through the same Legacy
            Publishing pipeline. AI or Die is not a demo. It is the case study
            we shipped so that no outside author has to be the first.
          </p>
          <div className="mt-10 text-center">
            <Button href="/apply/" variant="primary" size="lg">
              Start the diagnostic →
            </Button>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
