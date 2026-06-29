'use client'

import Image from 'next/image'
import { useCallback, useEffect, useRef, useState } from 'react'
import { useReducedMotion } from 'framer-motion'

const COVERS = [
  'show-the-apex-podcast',
  'show-perfect-love',
  'show-the-listener',
  'show-album-one',
  'show-master-of-two-worlds',
  'show-b-sides',
  'show-five-fingers',
  'show-the-anti-label',
  'show-second-acts',
  'show-coaches',
  'show-old-books',
  'show-pure-reading',
  'show-n-of-one',
  'show-legacy',
  'show-the-brief',
  'show-reps',
  'show-the-liner-notes',
  'show-the-comeback-mile',
  'show-hands-on',
  'show-same-stars',
  'show-first-principles',
  'show-etymon',
  'show-producers-chair',
  'show-men-im-lucky-to-know',
  'show-basics',
  'show-sweeter-after-difficulty',
  'show-one-note',
  'show-hard-questions-for-the-faithful',
  'show-black-belt-at-40',
  'show-the-55-plus-operator',
  'show-ai-native',
  'show-pure-reading',
  'show-album-one',
  'show-perfect-love',
  'show-the-listener',
  'show-b-sides',
  'show-the-apex-podcast',
  'show-master-of-two-worlds',
  'show-five-fingers',
  'show-the-anti-label',
]

const EXT: Record<string, 'webp' | 'svg'> = {
  'show-album-one': 'webp',
  'show-b-sides': 'webp',
  'show-basics': 'webp',
  'show-black-belt-at-40': 'webp',
  'show-five-fingers': 'webp',
  'show-men-im-lucky-to-know': 'webp',
  'show-n-of-one': 'webp',
  'show-one-note': 'webp',
  'show-producers-chair': 'webp',
  'show-reps': 'webp',
  'show-second-acts': 'webp',
  'show-sweeter-after-difficulty': 'webp',
  'show-the-anti-label': 'webp',
  'show-the-apex-podcast': 'webp',
  'show-the-comeback-mile': 'webp',
  'show-the-listener': 'webp',
}

function srcFor(slug: string) {
  const ext = EXT[slug] ?? 'svg'
  return `/covers/${slug}.${ext}`
}

function hoverIntensity(col: number): { saturation: number; brightness: number } {
  if (col <= 3) return { saturation: 0.35, brightness: 0.95 }
  if (col <= 5) return { saturation: 0.55, brightness: 1.0 }
  if (col <= 7) return { saturation: 0.75, brightness: 1.05 }
  return { saturation: 1.0, brightness: 1.1 }
}

export function HeroMosaicBackground() {
  return (
    <div
      className="absolute inset-0 -z-10 overflow-hidden"
      aria-hidden="true"
    >
      <div className="grid h-full w-full auto-rows-fr grid-cols-6 gap-1.5 sm:grid-cols-8 lg:grid-cols-10">
        {COVERS.map((slug, i) => {
          const col = i % 10
          const inTextColumns = col <= 3
          const { saturation, brightness } = hoverIntensity(col)
          return (
            <div
              key={`${slug}-${i}`}
              data-col={col}
              tabIndex={-1}
              className={
                'relative overflow-hidden rounded-sm ' +
                (inTextColumns
                  ? 'pointer-events-none'
                  : 'group pointer-events-auto cursor-pointer transition duration-[480ms] ease-[cubic-bezier(0.16,1,0.3,1)] hover:z-10 hover:shadow-[0_8px_24px_rgba(0,0,0,0.2)]')
              }
              style={
                inTextColumns
                  ? undefined
                  : ({
                      '--hover-saturation': saturation,
                      '--hover-brightness': brightness,
                    } as React.CSSProperties)
              }
            >
              <Image
                src={srcFor(slug)}
                alt=""
                fill
                sizes="(min-width: 1024px) 10vw, (min-width: 640px) 12vw, 16vw"
                className="mosaic-tile-img object-cover"
                priority={i < 10}
              />
            </div>
          )
        })}
      </div>

      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,1) 35%, rgba(255,255,255,0.8) 50%, rgba(255,255,255,0.3) 75%, rgba(255,255,255,0) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-32"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,1) 0%, rgba(255,255,255,0) 100%)',
        }}
      />
      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32"
        style={{
          background:
            'linear-gradient(to bottom, rgba(255,255,255,0) 0%, rgba(255,255,255,1) 100%)',
        }}
      />
    </div>
  )
}

const MOSAIC_TILES = COVERS.slice(0, 20)

export function HeroMosaic() {
  const shouldReduceMotion = useReducedMotion()
  const ref = useRef<HTMLDivElement>(null)
  const [cursor, setCursor] = useState<{ x: number; y: number } | null>(null)
  const [tileRects, setTileRects] = useState<Array<{ cx: number; cy: number } | null>>([])

  const measure = useCallback(() => {
    if (!ref.current) return
    const containerRect = ref.current.getBoundingClientRect()
    const tiles = ref.current.querySelectorAll<HTMLElement>('[data-tile]')
    const rects: Array<{ cx: number; cy: number } | null> = []
    tiles.forEach((el) => {
      const r = el.getBoundingClientRect()
      rects.push({
        cx: r.left - containerRect.left + r.width / 2,
        cy: r.top - containerRect.top + r.height / 2,
      })
    })
    setTileRects(rects)
  }, [])

  useEffect(() => {
    measure()
    const onResize = () => measure()
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [measure])

  const onMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (shouldReduceMotion) return
      if (!ref.current) return
      const rect = ref.current.getBoundingClientRect()
      setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top })
    },
    [shouldReduceMotion],
  )

  const onLeave = useCallback(() => setCursor(null), [])

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative grid aspect-square w-full grid-cols-5 grid-rows-4 gap-2 sm:gap-3"
      aria-hidden="true"
    >
      {MOSAIC_TILES.map((slug, i) => {
        const rect = tileRects[i] ?? null
        let darken = 0
        if (cursor && rect) {
          const dx = cursor.x - rect.cx
          const dy = cursor.y - rect.cy
          const dist = Math.sqrt(dx * dx + dy * dy)
          const radius = 200
          darken = Math.max(0, 1 - dist / radius)
        }
        const grayscale = 1 - darken * 0.95
        const brightness = 1.0 - darken * 0.2
        const opacity = 0.7 + darken * 0.3
        const tilt = (i % 3) - 1
        return (
          <div
            key={`${slug}-${i}`}
            data-tile
            className="relative overflow-hidden rounded-xl shadow-sm ring-1 ring-neutral-900/10"
            style={{
              transform: `rotate(${tilt}deg)`,
              transition: shouldReduceMotion
                ? undefined
                : 'filter 250ms ease, opacity 250ms ease',
              filter: `grayscale(${grayscale}) brightness(${brightness})`,
              opacity,
            }}
          >
            <Image
              src={srcFor(slug)}
              alt=""
              fill
              sizes="(min-width: 1024px) 20vw, 25vw"
              className="object-cover"
              priority={i < 5}
            />
          </div>
        )
      })}
    </div>
  )
}
