"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { motion } from "framer-motion";
import pnGraph from "../../../data/pn-entity-graph.json";
import pnKeyframes from "../../../data/pn-playhead-keyframes.json";
import type { EntityGraph, Keyframe } from "@/lib/entity-graph";
import { visibleSetsAtDay } from "@/lib/compute-graph-at-day";
import { usePlayhead, FULL_DAY } from "@/components/demo/PlayheadContext";
import { SixMonthPlayhead } from "@/components/demo/SixMonthPlayhead";
import { YouSearchDemo } from "@/components/demo/YouSearchDemo";
import { Eyebrow } from "@/components/ui/Eyebrow";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/layout/Container";

const EntityGraphHero = dynamic(
  () =>
    import("@/components/hero/EntityGraphHero").then((m) => m.EntityGraphHero),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex w-full items-center justify-center"
        style={{ height: "60vh", minHeight: 480 }}
      >
        <span className="text-caption animate-pulse text-fog">
          Rendering the entity graph…
        </span>
      </div>
    ),
  },
);

const graph = pnGraph as unknown as EntityGraph;
const keyframes = (pnKeyframes as { keyframes: Keyframe[] }).keyframes;

/**
 * Homepage sections 1-3 as one continuous full-bleed dark pane: the entity
 * graph hero, the You Search demo, and the six-month playhead. The playhead
 * mutates the hero graph above it through the shared PlayheadContext.
 */
export function HeroAndDemoBand() {
  const { day } = usePlayhead();

  const { nodeIds, edgeIds } = useMemo(
    () => visibleSetsAtDay(day, keyframes),
    [day],
  );

  const showFull = day >= FULL_DAY;

  return (
    <div className="border-b border-viz-border bg-viz-ink text-papyrus">
      {/* Section 1: Entity graph hero */}
      <section aria-label="PodcastNetwork.org entity graph">
        <div className="h-[60vh] min-h-[480px] md:h-[70vh] md:min-h-[560px]">
          <EntityGraphHero
            graph={graph}
            visibleNodeIds={showFull ? null : [...nodeIds]}
            visibleEdgeIds={showFull ? null : [...edgeIds]}
            height="100%"
            minHeight="480px"
          />
        </div>

        <Container className="pt-6 pb-20 text-center md:pb-24">
          {/* Transform-only entrance: an opacity fade here would delay LCP
              (this block holds the LCP headline). */}
          <motion.div
            initial={{ y: 16 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.6, delay: 0.6, ease: [0.4, 0, 0.2, 1] }}
          >
            <Eyebrow className="!text-foil">
              Authority architecture, engineered.
            </Eyebrow>
            <h1 className="text-display-1 mx-auto mt-4 max-w-4xl text-papyrus">
              This is what a Knowledge Panel looks like from the inside.
            </h1>
            <p className="text-lead mx-auto mt-6 max-w-2xl text-papyrus/90">
              PodcastNetwork.org builds live entity graphs for executives and
              authors who want Google to know exactly who they are. Six months.
              One package. Real signals.
            </p>
          </motion.div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.0 }}
            className="mt-10 flex flex-wrap items-center justify-center gap-6"
          >
            <Button
              variant="dark-primary"
              size="lg"
              onClick={() =>
                document
                  .getElementById("you-search")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Show me your entity graph →
            </Button>
            <Button href="/apply/" variant="dark-ghost" size="lg">
              Apply
            </Button>
          </motion.div>
        </Container>
      </section>

      {/* Section 2: You Search demo */}
      <section
        id="you-search"
        className="border-t border-viz-border py-20 md:py-24"
        aria-label="See your own entity graph"
      >
        <Container>
          <div className="text-center">
            <Eyebrow className="!text-foil">See yours.</Eyebrow>
            <h2 className="text-display-2 mt-4 text-papyrus">
              Type your name. See what Google sees.
            </h2>
            <p className="text-lead mx-auto mt-5 max-w-2xl text-papyrus/85">
              We fan out to SerpAPI, Wikidata, and Google&apos;s Knowledge
              Graph in real time and render whatever&apos;s there. For most
              people, most of it&apos;s empty. That&apos;s the honest answer,
              and it&apos;s the starting line.
            </p>
          </div>
          <div className="mt-10">
            <YouSearchDemo />
          </div>
        </Container>
      </section>

      {/* Section 3: Six-month playhead */}
      <section
        className="border-t border-viz-border py-20 md:py-24"
        aria-label="The six-month arc"
      >
        <Container>
          <div className="grid items-start gap-10 lg:grid-cols-[2fr_3fr]">
            <div>
              <Eyebrow className="!text-foil">The 6-month arc.</Eyebrow>
              <h2 className="text-display-2 mt-4 text-papyrus">
                Drag the playhead. Watch the graph mutate.
              </h2>
              <p className="text-body-sm measure mt-5 text-papyrus/85">
                This is the exact arc PN.org runs. Month one is discovery: we
                understand who you are and what the market needs from you.
                Month two, we start writing. Month three, your podcast goes
                live in our network. Month four, the pre-sell sequence hits.
                Month five, the knowledge panel resolves. Month six, the book
                lands into an audience that already said yes.
              </p>
              <p className="text-body-sm measure mt-4 text-papyrus/85">
                Drag the playhead. Every step compounds the next one.
                That&apos;s the whole compression. The graph at the top of this
                page mutates as you scrub.
              </p>
            </div>
            <SixMonthPlayhead keyframes={keyframes} variant="controller" />
          </div>
        </Container>
      </section>
    </div>
  );
}
