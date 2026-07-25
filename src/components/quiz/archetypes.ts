import type { Archetype } from './types';

export const ARCHETYPES: Record<string, Archetype> = {
  rhetorician: {
    name: 'The Rhetorician',
    tagline: "You don't just make points. You make them land.",
    description:
      'The Rhetorician treats language as a precision instrument. Every sentence has a job, and you instinctively know whether that job is to persuade, reframe, or close. You move between emotional appeals and logical arguments with fluency most people reserve for their native tongue. Your communication shifts the room.',
    famousExamples: ['Barack Obama', 'Cicero', 'Peggy Noonan', 'Frederick Douglass'],
    strengths: [
      'Reads an audience and adjusts in real time without losing authenticity',
      'Builds arguments that feel inevitable rather than forced',
      'Uses repetition, contrast, and cadence to make ideas memorable',
    ],
    blindSpots: [
      'Can prioritize how something sounds over whether it holds up under scrutiny',
      'Sometimes mistakes persuasion for communication',
      'May underinvest in plain, direct language when simplicity would hit harder',
    ],
    growthRecommendation:
      'Practice writing that removes all ornamentation. Send emails that are five sentences or fewer. The discipline of saying less will make your rhetorical instincts sharper when you deploy them.',
  },
  'precise-editor': {
    name: 'The Precise Editor',
    tagline: 'You find the error everyone else missed, and it matters more than they think.',
    description:
      "The Precise Editor operates with a belief that clarity is kindness. Sloppy language creates sloppy thinking, and you can feel it when a sentence doesn't parse. Your communication is clean, structured, and trustworthy. People rely on you because when you say something, it's been vetted.",
    famousExamples: ['William Strunk Jr.', 'Nora Ephron', 'George Orwell', 'Ben Bradlee'],
    strengths: [
      'Produces communication that holds up under cross-examination',
      'Eliminates ambiguity, which builds trust in high-stakes environments',
      'Catches logical gaps and inconsistencies others gloss over',
    ],
    blindSpots: [
      'Can edit the life out of a piece by optimizing for correctness over resonance',
      'Sometimes reads emotional communication as sloppy when it is doing different work',
      'May struggle to connect with audiences who process through feeling before logic',
    ],
    growthRecommendation:
      'Write something intentionally rough. A journal entry, a raw first draft you share before editing. Learning when to leave the rough edges will make your communication feel more human.',
  },
  storyteller: {
    name: 'The Storyteller',
    tagline: "You don't explain things. You make people live them.",
    description:
      "The Storyteller understands something most communicators miss: people don't remember arguments, they remember moments. You instinctively reach for narrative when others reach for bullet points. Your communication has characters, tension, and resolution. When you need to make a case, you find the story that carries the case inside it.",
    famousExamples: ['Brene Brown', 'Anthony Bourdain', 'Malcolm Gladwell', 'Chimamanda Ngozi Adichie'],
    strengths: [
      'Makes abstract ideas tangible by grounding them in human experience',
      'Creates emotional investment that keeps audiences engaged through complexity',
      'Builds trust through vulnerability and specificity',
    ],
    blindSpots: [
      'Can lean so hard into narrative that the underlying point gets buried',
      'Sometimes substitutes a good story for a rigorous argument',
      'May resist structured formats that certain audiences need',
    ],
    growthRecommendation:
      'After writing your next story-driven piece, add a single paragraph at the end that states the point in plain, structural terms. Train yourself to do both.',
  },
  analyst: {
    name: 'The Analyst',
    tagline: 'You see the framework before you see the feelings.',
    description:
      'The Analyst communicates like an engineer builds: load-bearing structure first, aesthetics second. You are the person who asks "what is the actual question here?" while everyone else is still reacting. Your communication is organized, evidence-driven, and methodical. There is always an architecture underneath.',
    famousExamples: ['Ben Thompson', 'Nate Silver', 'Ruth Bader Ginsburg', 'Annie Duke'],
    strengths: [
      'Brings order to chaotic conversations and complex problems',
      'Builds arguments that are hard to dismantle because the structure is visible and sound',
      'Earns credibility through consistency and intellectual rigor',
    ],
    blindSpots: [
      'Can come across as cold or clinical when the situation calls for warmth',
      'Sometimes over-structures communication that would benefit from a looser approach',
      'May dismiss emotional arguments as irrational rather than engaging with what they reveal',
    ],
    growthRecommendation:
      'Pick one framework-heavy piece and rewrite the opening as a story. Start with a person, a moment, a problem. Then let the framework emerge from the narrative.',
  },
  diplomat: {
    name: 'The Diplomat',
    tagline: 'You say the hard thing in a way people can actually hear.',
    description:
      "The Diplomat has mastered context sensitivity. You read the room before you open your mouth, and you adjust register, vocabulary, and emotional temperature to match. This isn't people-pleasing. It's strategic awareness. You never confuse honesty with bluntness.",
    famousExamples: ['Jacinda Ardern', 'Kofi Annan', 'Oprah Winfrey', 'Doris Kearns Goodwin'],
    strengths: [
      'Navigates politically sensitive communication without sacrificing substance',
      'Builds bridges between audiences who would otherwise talk past each other',
      'Maintains credibility across very different contexts and stakeholder groups',
    ],
    blindSpots: [
      'Can over-calibrate, sanding down a message until it loses its edge',
      'Sometimes prioritizes relationship preservation over necessary confrontation',
      'May be perceived as evasive by audiences who value directness',
    ],
    growthRecommendation:
      'Practice taking a clear, unapologetic position in writing. Not reckless, but firm. You already know how to soften. Learning when not to will make you more trusted.',
  },
  firebrand: {
    name: 'The Firebrand',
    tagline: "You don't just communicate. You combust.",
    description:
      'The Firebrand writes and speaks with intensity that others find either thrilling or exhausting (often both). Your communication runs hot. It has cadence, conviction, and a refusal to hedge. You believe that if something matters, it deserves to sound like it matters.',
    famousExamples: ['Martin Luther King Jr.', 'Christopher Hitchens', 'Toni Morrison', 'Ta-Nehisi Coates'],
    strengths: [
      'Creates urgency and emotional momentum that moves people to action',
      'Writes sentences that lodge in memory because of their rhythm and force',
      'Willing to take positions others will not, which builds a following',
    ],
    blindSpots: [
      'Intensity is expensive. Audiences can only sustain it for so long before they tune out',
      'Can mistake volume for clarity',
      'May alienate potential allies who agree with the substance but not the temperature',
    ],
    growthRecommendation:
      'Write your next important piece at half the emotional intensity you instinctively want. The restraint will make your peaks hit harder, because contrast creates impact.',
  },
  cultivator: {
    name: 'The Cultivator',
    tagline: "You make the complex feel obvious. That's harder than it looks.",
    description:
      "The Cultivator has a gift that sophisticated communicators often undervalue: radical clarity. You don't dumb things down. You translate ideas into language that respects the audience's intelligence while meeting them where they are. The result is communication that feels effortless to consume, which is the hardest thing to produce.",
    famousExamples: ['Mr. Rogers', 'Paul Graham', 'Anne Lamott', 'Warren Buffett'],
    strengths: [
      'Reaches audiences that other communicators accidentally exclude',
      "Builds deep trust because clarity signals respect for the reader's time",
      'Produces communication with an unusually long shelf life because simplicity ages well',
    ],
    blindSpots: [
      'Can flatten nuance in the pursuit of accessibility',
      'Sometimes avoids technical precision or jargon that would actually serve an expert audience',
      'May underuse rhetorical tools that would make clear writing also compelling',
    ],
    growthRecommendation:
      'Take your clearest piece and add one section that uses a rhetorical device deliberately. Anaphora, antithesis, or a well-placed metaphor. Your plainspoken foundation can support more ornamentation than you think.',
  },
  architect: {
    name: 'The Architect',
    tagline: 'You build arguments the way engineers build bridges. Load-tested.',
    description:
      'The Architect thinks in systems. Where others see a topic, you see a structure. Your communication has a visible logic to it. Readers can feel the blueprint underneath, and that blueprint makes your arguments feel inevitable rather than arbitrary. You are drawn to contrast, categorization, and parallel structure.',
    famousExamples: ['Charlie Munger', 'Isabel Wilkerson', 'Edward Tufte', 'Yuval Noah Harari'],
    strengths: [
      'Creates communication that teaches people how to think about a topic, not just what to think',
      'Builds frameworks that others adopt and reference, extending your influence',
      'Organizes complexity in ways that make it navigable and actionable',
    ],
    blindSpots: [
      'Can impose structure on topics that resist it',
      'Sometimes builds the framework so carefully that the human element disappears',
      'May prioritize elegance of structure over emotional truth',
    ],
    growthRecommendation:
      'Before your next piece, interview someone affected by the topic. Let their story open the piece before the framework appears. Grounding your architecture in a human moment makes it feel less like a textbook.',
  },
};
