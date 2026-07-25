import type { Metadata } from 'next';
import { CommunicationQuiz } from '@/components/quiz/CommunicationQuiz';
import { PODCASTNETWORK_CONFIG } from '@/components/quiz/tenant-configs';
import type { QuizConfig } from '@/components/quiz/types';
import questionsRaw from '@/lib/quiz/data/questions-long.json';
import type { QuizQuestion } from '@/components/quiz/types';

export const metadata: Metadata = {
  title: 'Communication DNA Assessment | PodcastNetwork.org',
  description:
    'Test your knowledge across all 23 dimensions of the Voice Corpus Framework. 92 questions, ~25 minutes. Free.',
};

const questions = questionsRaw as QuizQuestion[];

const config: QuizConfig = {
  variant: 'long',
  tenant: PODCASTNETWORK_CONFIG,
};

export default function CommunicationDnaPage() {
  return (
    <main>
      <CommunicationQuiz questions={questions} config={config} />
    </main>
  );
}
