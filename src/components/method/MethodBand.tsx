'use client'

import dynamic from 'next/dynamic'
import { useMemo } from 'react'

import pnGraph from '../../../data/pn-entity-graph.json'
import pnKeyframes from '../../../data/pn-playhead-keyframes.json'
import { Container } from '@/components/Container'
import { FadeIn } from '@/components/FadeIn'
import {
  FULL_DAY,
  usePlayhead,
} from '@/components/demo/PlayheadContext'
import { SixMonthPlayhead } from '@/components/demo/SixMonthPlayhead'
import { visibleSetsAtDay } from '@/lib/compute-graph-at-day'
import type { EntityGraph, Keyframe } from '@/lib/entity-graph'

const EntityGraphHero = dynamic(
  () =>
    import('@/components/hero/EntityGraphHero').then((m) => m.EntityGraphHero),
  { ssr: false, loading: () => <div style={{ height: '44vh' }} /> },
)

const graph = pnGraph as unknown as EntityGraph
const keyframes = (pnKeyframes as { keyframes: Keyframe[] }).keyframes

/*
 * /the-method/ interactive band: the persistent playhead (same shared state
 * as the homepage, via sessionStorage) with a smaller entity graph above it.
 * Dark viz surface in Studio's rounded-band idiom.
 */
export function MethodBand() {
  const { day } = usePlayhead()
  const { nodeIds, edgeIds } = useMemo(
    () => visibleSetsAtDay(day, keyframes),
    [day],
  )
  const showFull = day >= FULL_DAY

  return (
    <Container className="mt-16 sm:mt-20">
      <FadeIn>
        <div className="-mx-6 overflow-hidden bg-viz-ink py-8 text-papyrus sm:mx-0 sm:rounded-4xl">
          <div className="h-[44vh] min-h-95">
            <EntityGraphHero
              graph={graph}
              visibleNodeIds={showFull ? null : [...nodeIds]}
              visibleEdgeIds={showFull ? null : [...edgeIds]}
              height="100%"
              minHeight="380px"
            />
          </div>
          <div className="mt-8 px-6 md:px-12">
            <SixMonthPlayhead keyframes={keyframes} variant="controller" />
          </div>
        </div>
      </FadeIn>
    </Container>
  )
}
