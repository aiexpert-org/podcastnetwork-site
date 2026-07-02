import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { Section } from "@/components/layout/Section";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <>
      <Header />
      <main>
        <Section className="text-center">
          <Eyebrow>404</Eyebrow>
          <h1 className="text-display-2 mt-4">
            This page isn&apos;t in the graph.
          </h1>
          <p className="text-lead mx-auto mt-5 max-w-xl text-slate">
            The URL you followed doesn&apos;t resolve to an entity on this
            site. The homepage graph is the best place to start.
          </p>
          <div className="mt-8">
            <Button href="/" variant="primary">
              Back to the graph →
            </Button>
          </div>
        </Section>
      </main>
      <Footer />
    </>
  );
}
