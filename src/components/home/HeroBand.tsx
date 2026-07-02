'use client'

import dynamic from 'next/dynamic'
import { useEffect, useMemo, useRef, useState } from 'react'

import pnGraph from '../../../data/pn-entity-graph.json'
import pnKeyframes from '../../../data/pn-playhead-keyframes.json'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import {
  FULL_DAY,
  PlayheadProvider,
  usePlayhead,
} from '@/components/demo/PlayheadContext'
import { SixMonthPlayhead } from '@/components/demo/SixMonthPlayhead'
import { visibleSetsAtDay } from '@/lib/compute-graph-at-day'
import type { EntityGraph, Keyframe } from '@/lib/entity-graph'

const EntityGraphHero = dynamic(
  () =>
    import('@/components/hero/EntityGraphHero').then((m) => m.EntityGraphHero),
  {
    ssr: false,
    loading: () => (
      <div
        className="flex w-full items-center justify-center"
        style={{ height: '100%', minHeight: 440 }}
      >
        <span className="text-caption animate-pulse text-fog">
          Rendering the entity graph
        </span>
      </div>
    ),
  },
)

const graph = pnGraph as unknown as EntityGraph
const keyframes = (pnKeyframes as { keyframes: Keyframe[] }).keyframes

function GraphPane() {
  const { day } = usePlayhead()

  const { nodeIds, edgeIds } = useMemo(
    () => visibleSetsAtDay(day, keyframes),
    [day],
  )

  const showFull = day >= FULL_DAY

  return (
    <EntityGraphHero
      graph={graph}
      visibleNodeIds={showFull ? null : [...nodeIds]}
      visibleEdgeIds={showFull ? null : [...edgeIds]}
      height="100%"
      minHeight="440px"
    />
  )
}

/*
 * Dark immersive viz band in Studio's rounded-4xl dark-panel idiom: the live
 * PN entity graph with the six-month playhead anchored to its base. Scrubbing
 * the playhead mutates the graph above it through the shared PlayheadContext.
 * Ink ground + Papyrus text per the Editorial Premium palette lock.
 */
export function HeroBand() {
  const sectionRef = useRef<HTMLElement>(null)
  const [nearView, setNearView] = useState(false)

  // The React Flow chunk is heavy; keep it off the critical path until the
  // band approaches the viewport so the hero text LCP never waits on it.
  useEffect(() => {
    const el = sectionRef.current
    if (!el || nearView) return
    if (!('IntersectionObserver' in window)) {
      setNearView(true)
      return
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setNearView(true)
          observer.disconnect()
        }
      },
      { rootMargin: '100% 0px' },
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [nearView])

  return (
    <Container className="mt-16 sm:mt-20">
      <FadeIn>
        <section
          ref={sectionRef}
          aria-label="PodcastNetwork.org entity graph"
          className="-mx-6 overflow-hidden bg-viz-ink text-papyrus sm:mx-0 sm:rounded-4xl"
        >
          <div className="flex items-center gap-x-8 px-6 pt-10 md:px-12">
            <h2 className="font-display text-sm font-semibold tracking-wider text-white">
              The PN.org entity graph, live
            </h2>
            <div className="h-px flex-auto bg-viz-border" />
            <p className="text-caption hidden text-fog sm:block">
              Every node is a real, indexed signal
            </p>
          </div>
          <PlayheadProvider>
            <div className="h-[55vh] min-h-[440px] md:h-[60vh] md:min-h-[520px]">
              {nearView ? (
                <GraphPane />
              ) : (
                <div
                  className="flex h-full w-full items-center justify-center"
                  style={{ minHeight: 440 }}
                >
                  <span className="text-caption text-fog">
                    Rendering the entity graph
                  </span>
                </div>
              )}
            </div>
            <div className="border-t border-viz-border px-6 py-8 md:px-12">
              <SixMonthPlayhead keyframes={keyframes} variant="controller" />
            </div>
          </PlayheadProvider>
        </section>
      </FadeIn>
    </Container>
  )
}
