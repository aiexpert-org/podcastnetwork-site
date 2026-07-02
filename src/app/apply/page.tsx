import type { Metadata } from "next";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { ApplyFlow } from "@/components/application/ApplyFlow";
import { SchemaGraph } from "@/components/seo/SchemaGraph";
import { applySchema } from "@/lib/schema-graph";

export const metadata: Metadata = {
  title: "Apply — The application is the diagnostic",
  description:
    "The intake opens with a live schema validator. Paste your URL, see your current authority baseline, then answer six questions. We respond within two business days.",
  alternates: { canonical: "/apply/" },
};

export default function ApplyPage() {
  return (
    <>
      <SchemaGraph schema={applySchema()} />
      <Header />
      <main>
        <Section>
          <Eyebrow>Apply.</Eyebrow>
          <h1 className="text-display-1 mt-4 max-w-4xl">
            The application is the diagnostic.
          </h1>
          <p className="text-lead measure mt-6 text-slate">
            No form fields until we&apos;ve shown you where you stand today.
            The honest map comes first on every engagement we run. About 10
            minutes end to end. We respond within two business days.
          </p>
        </Section>
        <Section className="border-t border-ink/8">
          <ApplyFlow />
        </Section>
      </main>
      <Footer />
    </>
  );
}
