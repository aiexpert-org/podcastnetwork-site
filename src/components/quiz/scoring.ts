import { ARCHETYPES } from './archetypes';
import type { QuizQuestion, QuizResults, SectionScore, Archetype, DimensionResult } from './types';

const SECTION_WEIGHTS: Record<string, number> = {
  grammar: 20,
  logic: 15,
  rhetoric: 30,
  voice: 20,
  application: 15,
};

const SCORE_TIERS = [
  {
    min: 90,
    label: 'Master Communicator',
    description:
      'You have deep command of communication at every level. Your voice is distinctive, intentional, and informed by classical and modern technique.',
  },
  {
    min: 75,
    label: 'Advanced Practitioner',
    description:
      'You understand most communication dimensions intuitively and can name many of the techniques you use. A few blind spots remain.',
  },
  {
    min: 60,
    label: 'Skilled Communicator',
    description:
      'You have strong instincts and solid fundamentals. The gap between what you feel and what you can name is where your next growth lives.',
  },
  {
    min: 45,
    label: 'Developing Voice',
    description:
      'You communicate effectively in your comfort zone. Expanding your technical vocabulary will give you conscious control over techniques you already use unconsciously.',
  },
  {
    min: 30,
    label: 'Emerging Communicator',
    description:
      'You have a foundation to build on. The 23-dimension framework will give you a map for deliberate improvement across every layer of communication.',
  },
  {
    min: 0,
    label: 'Fresh Start',
    description:
      'Every master was once a beginner. You now have a clear picture of the 23 dimensions. That awareness is the first step toward command.',
  },
];

const SECTION_SUMMARIES: Record<string, { high: string; medium: string; low: string }> = {
  grammar: {
    high: 'You have strong command of the structural mechanics of language. You can identify sentence architecture, voice, mood, and diction patterns with precision.',
    medium:
      'You understand the basics of sentence construction and can recognize common patterns. Deepening your technical vocabulary around mood, tense, and diction will sharpen your editorial eye.',
    low: 'Grammar is your biggest growth opportunity. The good news: these are the most learnable dimensions. Focused study of sentence architecture and diction will change how you read and write.',
  },
  logic: {
    high: 'You think in structured arguments. You can identify deductive, inductive, and abductive reasoning, and you notice when a writer uses frameworks, antithesis, or causal chains.',
    medium:
      'You follow arguments well but may not always name the reasoning pattern at work. Learning to spot enthymemes and framework thinking will give you an analytical edge.',
    low: 'Argumentation structure is a blind spot. Most people learn to write sentences before they learn to build arguments. Studying deductive vs inductive reasoning will transform your persuasive writing.',
  },
  rhetoric: {
    high: 'You have a trained ear for rhetorical craft. You can identify schemes, tropes, sound patterns, and persuasive strategy. This separates good writers from memorable ones.',
    medium:
      'You recognize many rhetorical devices but may confuse related ones (chiasmus vs antimetabole, litotes vs meiosis). Sharpening these distinctions will give you precision.',
    low: 'Rhetoric is a wide-open frontier. The devices in this section (anaphora, tricolon, metaphor, personification) are the tools that turn functional writing into writing people remember.',
  },
  voice: {
    high: 'You understand voice as a system, not just a feeling. You can analyze opening patterns, storytelling structure, audience framing, and the role of personal history in communication.',
    medium:
      'You have good intuition about voice but may not have the vocabulary to articulate why one writer sounds different from another. The Voice + Identity dimensions give you that vocabulary.',
    low: 'Voice and identity are the dimensions most people overlook. They are also the dimensions that matter most for building a distinctive personal brand.',
  },
  application: {
    high: 'You can apply communication concepts in context. You know which techniques work for which audiences, and you can diagnose voice problems in real writing.',
    medium:
      'You have decent applied judgment but may not always match technique to context. Practicing with real writing samples will build your applied instinct.',
    low: 'Bridging theory to practice is your next step. You know more concepts than you realize. The gap is in matching the right technique to the right situation.',
  },
};

const DIMENSION_RECOMMENDATIONS: Record<string, string> = {
  'rhetorical-schemes':
    'Read the speeches of MLK and Churchill. Copy out passages by hand. Identify every scheme you find. This trains your ear faster than any textbook.',
  diction:
    'Build a signature words list. Write down 10 words you use all the time, then 10 words you never use but wish you did. Swap one reject word into your next piece.',
  storytelling:
    'Write a 200-word anecdote every day for 14 days. Focus on sensory detail. Time yourself: setup should be under 30% of the word count.',
  argumentation:
    'Before your next persuasive piece, write the argument skeleton first. Label each point: is this deductive, inductive, or abductive? Vary your pattern deliberately.',
  'audience-frames':
    'Write the same 100-word paragraph for three different readers: a CEO, a college student, and your best friend. Notice what changes and what stays the same.',
  'opening-patterns':
    'Audit your last 10 pieces. Categorize each opening. If more than 7 use the same type, you have a default. Try a different opening type for your next 5 pieces.',
  'sound-patterns':
    'Read your next draft out loud. Circle any accidental alliteration or assonance. Then try adding one deliberate sound pattern per paragraph.',
  'sentence-rhythm':
    'Count the words in each sentence of your next paragraph. If the numbers are all within 5 of each other, you have a rhythm problem. Vary intentionally.',
  'active-voice':
    'Search your last piece for "was" and "were." For each instance, try rewriting with an active verb. Keep the passive only where it genuinely serves the sentence.',
  'framework-thinking':
    'Take one complex idea and organize it into a named framework with 3-5 parts. Give the framework a name. See if the structure clarifies the idea or forces it.',
};

export function calculateResults(
  questions: QuizQuestion[],
  answers: Record<number, string>,
  variant: 'long' | 'short'
): QuizResults {
  const sectionScores = calculateSectionScores(questions, answers);
  const overallScore =
    variant === 'short'
      ? calculateShortScore(questions, answers)
      : calculateWeightedScore(sectionScores);

  const tier = SCORE_TIERS.find((t) => overallScore >= t.min) ?? SCORE_TIERS[SCORE_TIERS.length - 1];

  const dimensionScores = calculateDimensionScores(questions, answers);
  const sorted = [...dimensionScores].sort((a, b) => b.percentage - a.percentage);
  const strengths = sorted.slice(0, 3);
  const growthEdges = sorted.slice(-3).reverse();

  const archetype = assignArchetype(sectionScores);
  const secondaryArchetype = assignSecondaryArchetype(sectionScores, archetype.name);

  const recommendations = generateRecommendations(growthEdges);

  return {
    overallScore: Math.round(overallScore),
    scoreTier: tier.label.toLowerCase().replace(/\s+/g, '-'),
    tierLabel: tier.label,
    tierDescription: tier.description,
    sectionScores,
    archetype,
    secondaryArchetype,
    strengths,
    growthEdges,
    recommendations,
    answers,
  };
}

function calculateSectionScores(
  questions: QuizQuestion[],
  answers: Record<number, string>
): SectionScore[] {
  const sections = ['grammar', 'logic', 'rhetoric', 'voice', 'application'] as const;

  return sections.map((section) => {
    const sectionQuestions = questions.filter((q) => q.section === section);
    const correct = sectionQuestions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const total = sectionQuestions.length;
    return {
      section,
      correct,
      total,
      percentage: total > 0 ? Math.round((correct / total) * 100) : 0,
    };
  });
}

function calculateWeightedScore(sectionScores: SectionScore[]): number {
  return sectionScores.reduce((total, s) => {
    const weight = SECTION_WEIGHTS[s.section] ?? 0;
    return total + (s.percentage / 100) * weight;
  }, 0);
}

function calculateShortScore(
  questions: QuizQuestion[],
  answers: Record<number, string>
): number {
  const correct = questions.filter((q) => answers[q.id] === q.correctAnswer).length;
  return Math.round((correct / questions.length) * 100);
}

function calculateDimensionScores(
  questions: QuizQuestion[],
  answers: Record<number, string>
): DimensionResult[] {
  const dimensionMap = new Map<string, { correct: number; total: number }>();

  for (const q of questions) {
    const dim = q.dimension;
    const entry = dimensionMap.get(dim) ?? { correct: 0, total: 0 };
    entry.total++;
    if (answers[q.id] === q.correctAnswer) entry.correct++;
    dimensionMap.set(dim, entry);
  }

  return Array.from(dimensionMap.entries()).map(([dimension, { correct, total }]) => {
    const percentage = total > 0 ? Math.round((correct / total) * 100) : 0;
    return {
      dimension,
      percentage,
      summary: getDimensionSummary(dimension, percentage),
    };
  });
}

function getDimensionSummary(dimension: string, percentage: number): string {
  if (percentage >= 75) return `Strong command of ${dimension}.`;
  if (percentage >= 50) return `Solid foundation in ${dimension} with room to sharpen.`;
  return `Growth opportunity in ${dimension}.`;
}

function assignArchetype(sectionScores: SectionScore[]): Archetype {
  const scores: Record<string, number> = {};
  for (const s of sectionScores) {
    scores[s.section] = s.percentage;
  }

  const patterns: { key: string; match: (s: Record<string, number>) => boolean }[] = [
    { key: 'rhetorician', match: (s) => s.rhetoric >= 75 && s.grammar >= 40 && s.rhetoric > s.grammar },
    { key: 'precise-editor', match: (s) => s.grammar >= 75 && s.logic >= 65 && s.rhetoric < 60 },
    { key: 'storyteller', match: (s) => s.voice >= 75 && s.application >= 60 && s.voice > s.logic },
    { key: 'analyst', match: (s) => s.logic >= 75 && s.grammar >= 60 && s.logic > s.voice },
    { key: 'diplomat', match: (s) => s.application >= 75 && s.voice >= 60 && s.rhetoric >= 50 },
    { key: 'firebrand', match: (s) => s.rhetoric >= 70 && s.voice >= 70 && s.grammar < 50 },
    { key: 'cultivator', match: (s) => s.grammar >= 65 && s.application >= 65 && s.rhetoric < 55 },
    { key: 'architect', match: (s) => s.logic >= 70 && s.grammar >= 65 && s.application >= 60 },
  ];

  for (const p of patterns) {
    if (p.match(scores)) {
      return ARCHETYPES[p.key];
    }
  }

  const highest = Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0];
  const fallbackMap: Record<string, string> = {
    grammar: 'precise-editor',
    logic: 'analyst',
    rhetoric: 'rhetorician',
    voice: 'storyteller',
    application: 'diplomat',
  };
  return ARCHETYPES[fallbackMap[highest] ?? 'rhetorician'];
}

function assignSecondaryArchetype(
  sectionScores: SectionScore[],
  primaryName: string
): Archetype | undefined {
  const scores: Record<string, number> = {};
  for (const s of sectionScores) {
    scores[s.section] = s.percentage;
  }

  const secondHighest = Object.entries(scores).sort((a, b) => b[1] - a[1])[1];

  if (!secondHighest || secondHighest[1] < 50) return undefined;

  const sectionToArchetype: Record<string, string> = {
    grammar: 'precise-editor',
    logic: 'analyst',
    rhetoric: 'rhetorician',
    voice: 'storyteller',
    application: 'diplomat',
  };

  const secondaryKey = sectionToArchetype[secondHighest[0]];
  if (!secondaryKey) return undefined;

  const secondary = ARCHETYPES[secondaryKey];
  if (secondary?.name === primaryName) return undefined;

  return secondary;
}

function generateRecommendations(growthEdges: DimensionResult[]): string[] {
  return growthEdges
    .map((edge) => {
      const key = edge.dimension.toLowerCase().replace(/\s+/g, '-');
      return DIMENSION_RECOMMENDATIONS[key];
    })
    .filter(Boolean) as string[];
}

export function getSectionSummary(section: string, percentage: number): string {
  const summaries = SECTION_SUMMARIES[section];
  if (!summaries) return '';
  if (percentage >= 75) return summaries.high;
  if (percentage >= 50) return summaries.medium;
  return summaries.low;
}

export function generateGhlTags(results: QuizResults, variant: 'long' | 'short'): string[] {
  const tags: string[] = [];

  tags.push(variant === 'long' ? 'quiz-communication-dna' : 'quiz-communication-iq');
  tags.push(`score-${results.scoreTier}`);

  const archetypeSlug = results.archetype.name
    .toLowerCase()
    .replace(/^the\s+/, '')
    .replace(/\s+/g, '-');
  tags.push(`archetype-${archetypeSlug}`);

  for (const s of results.sectionScores) {
    if (s.percentage >= 75) tags.push(`score-high-${s.section}`);
    if (s.percentage < 40) tags.push(`score-low-${s.section}`);
  }

  return tags;
}
