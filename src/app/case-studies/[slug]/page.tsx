import type { Metadata } from "next";
import { notFound } from "next/navigation";
import caseStudies from "../../../../data/case-studies.json";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import {
  LiveCaseStudyCard,
  type CaseStudyStatic,
} from "@/components/case-studies/LiveCaseStudyCard";
import { SchemaGraph } from "@/components/seo/SchemaGraph";
import { inLaunchCaseStudySchema } from "@/lib/schema-graph";

const IN_LAUNCH_SLUGS = ["michele-okimura", "dominic-jones", "rob-okimura"];

const ICP_CONTEXT: Record<string, string> = {
  "michele-okimura":
    "Michele Okimura fits the Pre-Sold Author Package ICP because she is building a category-defining book alongside an existing professional platform. She co-hosts In a Moment with Brett K Moore inside the PN.org network, which serves as the primary audience-building engine for her launch. Her book pipeline runs directly on the Legacy Publishing JV rails.",
  "dominic-jones":
    "Dominic Jones is a non-fiction author inside the current PodcastNetwork.org cohort, writing A Heart That Says Yes through the Legacy Publishing pipeline. Discovery is complete and manuscript kickoff is underway; his podcast arc begins next month inside the network.",
  "rob-okimura":
    "Rob Okimura is in the current PodcastNetwork.org cohort with the pre-sell sequence live. Knowledge panel indexing is in motion and the launch window lands in Q3. His case study page updates as each verified milestone clears.",
};

export function generateStaticParams() {
  return IN_LAUNCH_SLUGS.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const study = (
    caseStudies as unknown as Record<string, CaseStudyStatic | undefined>
  )[slug];
  if (!study || typeof study === "string") return {};
  return {
    title: `${study.title} — In launch, Month ${study.currentMonth} of ${study.totalMonths}`,
    description: study.blurb,
    alternates: { canonical: `/case-studies/${slug}/` },
  };
}

export default async function InLaunchCaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  if (!IN_LAUNCH_SLUGS.includes(slug)) notFound();

  const study = (
    caseStudies as unknown as Record<string, CaseStudyStatic | undefined>
  )[slug];
  if (!study || typeof study === "string") notFound();

  return (
    <>
      <SchemaGraph
        schema={inLaunchCaseStudySchema(
          slug,
          study.title,
          study.workingTitle && study.workingTitle !== "In development"
            ? study.workingTitle
            : null,
        )}
      />
      <Header />
      <main>
        <Section>
          <Eyebrow>In launch.</Eyebrow>
          <h1 className="text-display-1 mt-4">{study.title}</h1>
          <p className="text-lead measure mt-6 text-slate">
            {ICP_CONTEXT[slug]}
          </p>
        </Section>

        <Section className="border-t border-ink/8">
          <div className="mx-auto max-w-xl">
            <LiveCaseStudyCard data={study} headingLevel="h2" />
          </div>
          <p className="text-body-sm measure mx-auto mt-10 text-center text-slate">
            This page reports honest state only. If a metric is not on the
            page, that metric does not yet exist in defensible form. The full
            case study lands at launch, and the page updates as each verified
            milestone clears.
          </p>
          <div className="mt-10 text-center">
            <Button href="/apply/" variant="primary">
              Start the diagnostic →
            </Button>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
