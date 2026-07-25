import type { TenantConfig } from './types';

export const PODCASTNETWORK_CONFIG: TenantConfig = {
  site: 'podcastnetwork',
  ctaHeading: 'Ready to Publish a Book That Builds Your Business?',
  ctaBody:
    'Your Communication DNA score shows exactly where your voice is strong and where it costs you readers. Legacy Publishing takes authors from manuscript to bestseller with done-for-you positioning, editing, and launch strategy. Pre-Sold Author Package ($30K) includes a full launch. Pre-Sold Author Lite ($9,997) gets your book to market fast. Or start with a Manuscript Review ($497) to see exactly what your draft needs.',
  ctaPrimaryLabel: 'Apply for the Pre-Sold Author Package',
  ctaPrimaryUrl: '/apply',
  ctaSecondaryLabel: 'Get a Manuscript Review ($497)',
  ctaSecondaryUrl: '/manuscript-review',
  quizTitle: 'Communication DNA Assessment',
  quizSubtitle: 'Discover the 23 dimensions of your writing voice',
};

export const PODCASTNETWORK_SHORT_CONFIG: TenantConfig = {
  ...PODCASTNETWORK_CONFIG,
  quizTitle: 'Communication IQ Quiz',
  quizSubtitle: 'Test your Communication IQ in 5 minutes',
};
