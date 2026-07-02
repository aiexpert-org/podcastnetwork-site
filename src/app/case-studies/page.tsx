import type { Metadata } from "next";
import caseStudies from "../../../data/case-studies.json";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import {
  LiveCaseStudyCard,
  type CaseStudyStatic,
} from "@/components/case-studies/LiveCaseStudyCard";
import { SchemaGraph } from "@/components/seo/SchemaGraph";
import { caseStudiesHubSchema } from "@/lib/schema-graph";

export const metadata: Metadata = {
  title: "Case Studies — Live entity pages",
  description:
    "The graphs we've built and the ones we're building right now. AI or Die with live metrics, plus three in-launch authors reporting honest state on the 180-day clock.",
  alternates: { canonical: "/case-studies/" },
};

export default function CaseStudiesPage() {
  const studies = Object.values(
    caseStudies as unknown as Record<string, CaseStudyStatic | string>,
  ).filter(
    (c): c is CaseStudyStatic =>
      typeof c === "object" && c !== null && "slug" in c,
  );
  const featured = studies.find((c) => c.variant === "featured");
  const inLaunch = studies.filter((c) => c.variant === "in-launch");

  return (
    <>
      <SchemaGraph schema={caseStudiesHubSchema()} />
      <Header />
      <main>
        <Section>
          <Eyebrow>In the wild.</Eyebrow>
          <h1 className="text-display-1 mt-4 max-w-4xl">
            The graphs we&apos;ve built. And the ones we&apos;re building right
            now.
          </h1>
          <p className="text-lead measure mt-6 text-slate">
            One anchor case study the founders ran on themselves, reporting
            live data. Three in-launch authors reporting honest state on the
            180-day clock. Where a number does not yet exist, there is no
            number. That is the standard we publish against.
          </p>
        </Section>

        <Section className="border-t border-ink/8">
          <div className="space-y-5">
            {featured && (
              <LiveCaseStudyCard data={featured} headingLevel="h2" />
            )}
            <div className="grid gap-5 md:grid-cols-3">
              {inLaunch.map((c) => (
                <LiveCaseStudyCard key={c.slug} data={c} headingLevel="h2" />
              ))}
            </div>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
