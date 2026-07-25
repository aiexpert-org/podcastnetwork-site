export interface QuizQuestion {
  id: number;
  section: 'grammar' | 'logic' | 'rhetoric' | 'voice' | 'application';
  dimension: string;
  stem: string;
  options: { label: string; text: string }[];
  correctAnswer: string;
  explanation: string;
  dimensionTested: string;
}

export interface QuizConfig {
  variant: 'long' | 'short';
  tenant: TenantConfig;
  onComplete?: (results: QuizResults) => void;
}

export interface TenantConfig {
  site: 'brettkmoore' | 'podcastnetwork';
  ctaHeading: string;
  ctaBody: string;
  ctaPrimaryLabel: string;
  ctaPrimaryUrl: string;
  ctaSecondaryLabel?: string;
  ctaSecondaryUrl?: string;
  quizTitle: string;
  quizSubtitle: string;
}

export interface SectionScore {
  section: string;
  correct: number;
  total: number;
  percentage: number;
}

export interface QuizResults {
  overallScore: number;
  scoreTier: string;
  tierLabel: string;
  tierDescription: string;
  sectionScores: SectionScore[];
  archetype: Archetype;
  secondaryArchetype?: Archetype;
  strengths: DimensionResult[];
  growthEdges: DimensionResult[];
  recommendations: string[];
  answers: Record<number, string>;
}

export interface DimensionResult {
  dimension: string;
  percentage: number;
  summary: string;
}

export interface Archetype {
  name: string;
  tagline: string;
  description: string;
  famousExamples: string[];
  strengths: string[];
  blindSpots: string[];
  growthRecommendation: string;
}

export type QuizState = 'intro' | 'questions' | 'section-break' | 'email-gate' | 'results';
