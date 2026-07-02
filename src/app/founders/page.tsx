import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { FounderAnchorLive } from "@/components/founders/FounderAnchorLive";
import { FoundersGraphInset } from "@/components/founders/FoundersGraphInset";
import { SchemaGraph } from "@/components/seo/SchemaGraph";
import { foundersSchema } from "@/lib/schema-graph";

export const metadata: Metadata = {
  title: "Founders — We ran the method on ourselves first",
  description:
    "Brett K Moore and Mike Partners, co-founders of PodcastNetwork.org. Co-authors of AI or Die, the founder-run case study with live metrics refreshing hourly.",
  alternates: { canonical: "/founders/" },
};

export default function FoundersPage() {
  return (
    <>
      <SchemaGraph schema={foundersSchema()} />
      <Header />
      <main>
        <Section>
          <Eyebrow>The founders.</Eyebrow>
          <h1 className="text-display-1 mt-4 max-w-4xl">
            We ran the method on ourselves first.
          </h1>
          <p className="text-lead measure mt-6 text-slate">
            We are Brett K Moore and Mike Partners, co-founders of
            PodcastNetwork.org. Fifty-fifty. That split was locked on day one
            and it has not moved. We co-authored AI or Die, launched it through
            our own sequence, and built the machine that pre-sold it. Then we
            realized the machine was the product.
          </p>
        </Section>

        {/* Founder entity subgraph on the dark viz surface */}
        <FoundersGraphInset />

        <Section>
          <Eyebrow>Live proof.</Eyebrow>
          <h2 className="text-display-2 mt-4">
            The book. The metrics. The receipt.
          </h2>
          <div className="mt-12">
            <FounderAnchorLive showCta={false} />
          </div>
        </Section>

        <Section className="border-t border-ink/8">
          <div className="grid gap-10 lg:grid-cols-[2fr_3fr]">
            <div>
              <Eyebrow>Why we built PN.org.</Eyebrow>
              <h2 className="text-display-2 mt-4">
                Cold launches are a sequencing failure.
              </h2>
            </div>
            <div className="space-y-5">
              <p className="measure">
                Most authors launch cold. They write for two to three years,
                they land a publisher, and then the book ships into a market
                that has no idea who they are. The retail stack is weak. The
                knowledge panel is nonexistent. The audience is a mailing list
                they have not tended. The book fades in 90 days.
              </p>
              <p className="measure">
                The alternative is not more marketing. More marketing after a
                cold launch does not fix a cold launch. The alternative is a
                coordinated six-month sequence that produces the book, the
                podcast, the knowledge panel, and the pre-sold audience in
                parallel. All four pillars mature together. By the time the
                book lists, the audience has already opted in, the podcast has
                already been running, and Google already knows who the author
                is. PodcastNetwork.org is the operator of that sequence.
              </p>
            </div>
          </div>
        </Section>

        <Section className="border-t border-ink/8">
          <Eyebrow>The organizations.</Eyebrow>
          <h2 className="text-display-2 mt-4">One operator, three partners.</h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {[
              {
                name: "AI Expert",
                line: "Sister firm. Builds the AI-native architecture underneath the sequence: transcript-to-manuscript pipelines, guest-booking sequencing tooling, and the structured-data workflows Google indexes fastest. Same two co-founders.",
              },
              {
                name: "Legacy Publishing",
                line: "Publishing partner. Application-only elite publisher operating at 10 percent of net book sales with no upfront fee. Every book in the package publishes through Legacy under the JV.",
              },
              {
                name: "Apex Podcast Co",
                line: "Production partner. Ongoing white-glove podcast production after Day 180, on a separate retainer, for authors who want the show to keep growing. Brett is 50/50 with Randy Highsmith on Apex.",
              },
            ].map((org) => (
              <div
                key={org.name}
                className="rounded-xl border border-ink/8 bg-papyrus p-7"
              >
                <h3 className="text-h3 font-(family-name:--font-display) font-bold">
                  {org.name}
                </h3>
                <p className="text-body-sm mt-3 text-slate">{org.line}</p>
              </div>
            ))}
          </div>
          <p className="text-body-sm measure mt-8 text-slate">
            PodcastNetwork.org sits in the middle. Authors talk to one
            operator, sign one contract, pay one price, and get four pillars
            delivered in parallel.
          </p>
          <div className="mt-12 text-center">
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
