import Link from 'next/link'
import { notFound } from 'next/navigation'

import { findAuthorBySlug } from '@/lib/portal/authors'

type Module = {
  slug: string
  title: string
  description: string
  category: string
  duration?: string
  outline: string[]
}

const MODULES: Record<string, Module> = {
  'voice-foundations': {
    slug: 'voice-foundations',
    title: 'Voice Foundations',
    category: 'Voice',
    duration: '18 min',
    description:
      'How your voice shows up on the page and on the mic. The 23 dimensions we listen for, and how to read your own corpus.',
    outline: [
      'What a voice corpus actually captures.',
      'The 23 dimensions in plain language.',
      'How to use your dominant metaphors on purpose.',
      'The difference between voice and tone.',
      'Why voice fidelity beats voice matching.',
    ],
  },
  'writing-craft-scene': {
    slug: 'writing-craft-scene',
    title: 'Writing Craft: Scene',
    category: 'Craft',
    duration: '15 min',
    description:
      'How to put the reader inside the moment. Sensory anchors, tension, and the difference between a lived scene and a summary.',
    outline: [
      'What a scene is doing that a summary is not.',
      'The five sensory anchors, ranked by payoff.',
      'Tension as a physical fact on the page.',
      'When to stay in scene, when to step out.',
    ],
  },
  'writing-craft-dialogue': {
    slug: 'writing-craft-dialogue',
    title: 'Writing Craft: Dialogue',
    category: 'Craft',
    duration: '14 min',
    description:
      'How real people actually speak. Rhythm, subtext, and the moves that turn dialogue into character.',
    outline: [
      'Rhythm you can hear.',
      'The one-line rule.',
      'Subtext: what the character is not saying.',
      'Attribution and beats.',
    ],
  },
  'writing-craft-chapter-architecture': {
    slug: 'writing-craft-chapter-architecture',
    title: 'Writing Craft: Chapter Architecture',
    category: 'Craft',
    duration: '20 min',
    description:
      'What every chapter needs to earn its own place. Opens, turns, closes, and the reader promise across the book.',
    outline: [
      'The chapter promise.',
      'The open that earns the read.',
      'The turn in the middle.',
      'The close that pulls the next chapter forward.',
      'How chapter architecture stacks into book architecture.',
    ],
  },
  'communication-development': {
    slug: 'communication-development',
    title: 'Communication Development',
    category: 'Communication',
    duration: '22 min',
    description:
      'How to sharpen the way you speak on podcasts, stages, and interviews. Signature language, response frames, and the trap of the safe answer.',
    outline: [
      'Your signature language pack.',
      'Response frames for the four common host questions.',
      'The safe-answer trap.',
      'Bridging without sounding trained.',
    ],
  },
}

export default async function LearnModulePage({
  params,
}: {
  params: Promise<{ authorSlug: string; moduleSlug: string }>
}) {
  const { authorSlug, moduleSlug } = await params
  const author = findAuthorBySlug(authorSlug)
  if (!author) return notFound()
  const mod = MODULES[moduleSlug]
  if (!mod) return notFound()

  return (
    <div className="max-w-3xl space-y-8">
      <Link
        href={`/portal/${authorSlug}/learn/`}
        className="text-xs text-portal-muted hover:text-portal-ink"
      >
        {'←'} All modules
      </Link>

      <header>
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-amber">
          {mod.category}
          {mod.duration && ` · ${mod.duration}`}
        </p>
        <h1 className="mt-2 font-portal-serif text-4xl font-semibold tracking-tight text-portal-ink">
          {mod.title}
        </h1>
        <p className="mt-3 text-base text-portal-muted">{mod.description}</p>
      </header>

      <section className="rounded-2xl border border-portal-line bg-portal-surface p-6 shadow-sm">
        <h2 className="font-portal-serif text-lg font-semibold text-portal-ink">
          What we cover
        </h2>
        <ul className="mt-4 space-y-2">
          {mod.outline.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-portal-amber" />
              <span className="text-sm text-portal-ink">{item}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-2xl border border-portal-line bg-portal-amber-tint/40 p-6">
        <p className="text-[0.65rem] font-semibold uppercase tracking-[0.2em] text-portal-amber">
          Module content
        </p>
        <p className="mt-2 text-sm text-portal-ink">
          The full lesson (video walkthrough plus workbook) drops in v0.3.
          The stub above is the outline your pilot session walks through this
          week.
        </p>
      </section>
    </div>
  )
}
