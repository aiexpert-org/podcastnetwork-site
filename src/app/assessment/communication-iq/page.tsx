import type { Metadata } from 'next';
import { CommunicationQuiz } from '@/components/quiz/CommunicationQuiz';
import { PODCASTNETWORK_SHORT_CONFIG } from '@/components/quiz/tenant-configs';
import type { QuizConfig } from '@/components/quiz/types';
import questionsRaw from '@/lib/quiz/data/questions-short.json';
import type { QuizQuestion } from '@/components/quiz/types';

export const metadata: Metadata = {
  title: 'Communication IQ Quiz | PodcastNetwork.org',
  description:
    'Test your Communication IQ in 5 minutes. 15 questions across grammar, logic, rhetoric, voice, and application.',
};

const questions = questionsRaw as QuizQuestion[];

const config: QuizConfig = {
  variant: 'short',
  tenant: PODCASTNETWORK_SHORT_CONFIG,
};

export default function CommunicationIqPage() {
  return (
    <main>
      <CommunicationQuiz questions={questions} config={config} />
    </main>
  );
}
