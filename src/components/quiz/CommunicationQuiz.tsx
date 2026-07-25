'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { QuizQuestion, QuizConfig, QuizResults, QuizState, SectionScore } from './types';
import { calculateResults, getSectionSummary } from './scoring';

const STORAGE_KEY = 'communication-dna-quiz';

interface SavedProgress {
  answers: Record<number, string>;
  currentIndex: number;
  variant: 'long' | 'short';
  timestamp: number;
}

export function CommunicationQuiz({
  questions,
  config,
}: {
  questions: QuizQuestion[];
  config: QuizConfig;
}) {
  const [state, setState] = useState<QuizState>('intro');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [results, setResults] = useState<QuizResults | null>(null);
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [emailError, setEmailError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);

  const currentQuestion = questions[currentIndex];
  const totalQuestions = questions.length;
  const progress = totalQuestions > 0 ? ((currentIndex + 1) / totalQuestions) * 100 : 0;
  const isLong = config.variant === 'long';

  const currentSection = currentQuestion?.section;
  const prevSection = currentIndex > 0 ? questions[currentIndex - 1]?.section : null;
  const isSectionTransition = currentSection !== prevSection && currentIndex > 0;

  useEffect(() => {
    if (!isLong) return;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (!saved) return;
      const parsed: SavedProgress = JSON.parse(saved);
      if (parsed.variant !== config.variant) return;
      if (Date.now() - parsed.timestamp > 7 * 24 * 60 * 60 * 1000) {
        localStorage.removeItem(STORAGE_KEY);
        return;
      }
      setAnswers(parsed.answers);
      setCurrentIndex(parsed.currentIndex);
      setState('questions');
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [isLong, config.variant]);

  const saveProgress = useCallback(
    (newAnswers: Record<number, string>, newIndex: number) => {
      if (!isLong) return;
      try {
        const data: SavedProgress = {
          answers: newAnswers,
          currentIndex: newIndex,
          variant: config.variant,
          timestamp: Date.now(),
        };
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      } catch {
        // localStorage unavailable
      }
    },
    [isLong, config.variant]
  );

  const handleStart = () => {
    setState('questions');
  };

  const handleResume = () => {
    setState('questions');
  };

  const handleRestart = () => {
    setAnswers({});
    setCurrentIndex(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setResults(null);
    setState('intro');
    if (isLong) {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }
  };

  const handleSelectAnswer = (answer: string) => {
    if (showExplanation) return;
    setSelectedAnswer(answer);
    setShowExplanation(true);

    const newAnswers = { ...answers, [currentQuestion.id]: answer };
    setAnswers(newAnswers);
    saveProgress(newAnswers, currentIndex);
  };

  const handleNext = () => {
    const nextIndex = currentIndex + 1;

    if (nextIndex >= totalQuestions) {
      const quizResults = calculateResults(questions, answers, config.variant);
      setResults(quizResults);
      setState('email-gate');
      return;
    }

    const nextQuestion = questions[nextIndex];
    if (
      isLong &&
      nextQuestion.section !== currentQuestion.section &&
      !isSectionTransition
    ) {
      setState('section-break');
    }

    setCurrentIndex(nextIndex);
    setSelectedAnswer(null);
    setShowExplanation(false);
    saveProgress(answers, nextIndex);

    questionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const handleSectionContinue = () => {
    setState('questions');
  };

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEmailError('');

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }

    if (!results) return;

    setIsSubmitting(true);

    try {
      await fetch('/api/quiz/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          firstName,
          results,
          variant: config.variant,
          site: config.tenant.site,
        }),
      });
    } catch {
      // Don't block results on submission failure
    }

    setIsSubmitting(false);
    setState('results');

    if (isLong) {
      try { localStorage.removeItem(STORAGE_KEY); } catch {}
    }

    config.onComplete?.(results);
  };

  const sectionLabel = (section: string): string => {
    const labels: Record<string, string> = {
      grammar: 'Grammar',
      logic: 'Logic',
      rhetoric: 'Rhetoric',
      voice: 'Voice + Identity',
      application: 'Application',
    };
    return labels[section] ?? section;
  };

  const completedSections = (): SectionScore[] => {
    if (!results) return [];
    return results.sectionScores;
  };

  void completedSections;

  // --- RENDER ---

  if (state === 'intro') {
    const hasSaved = isLong && Object.keys(answers).length > 0;

    return (
      <div className="quiz-container">
        <div className="quiz-intro">
          <h1 className="quiz-title">{config.tenant.quizTitle}</h1>
          <p className="quiz-subtitle">{config.tenant.quizSubtitle}</p>

          <div className="quiz-meta">
            <span>{totalQuestions} questions</span>
            <span>{isLong ? '~25 minutes' : '~5 minutes'}</span>
            <span>Free</span>
          </div>

          <p className="quiz-description">
            Test your knowledge across the 23-Dimension Voice Corpus Framework.
            Every question teaches a real communication concept. You will get
            immediate feedback after each answer, plus a full scored report at
            the end.
          </p>

          {isLong && (
            <p className="quiz-save-note">
              Your progress is saved automatically. You can close this page and
              come back anytime within 7 days.
            </p>
          )}

          <div className="quiz-actions">
            <button className="btn-primary" onClick={handleStart}>
              {hasSaved ? 'Start Fresh' : 'Start Quiz'}
            </button>
            {hasSaved && (
              <button className="btn-secondary" onClick={handleResume}>
                Resume ({Object.keys(answers).length}/{totalQuestions} answered)
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  if (state === 'section-break') {
    const completedSection = prevSection ?? '';
    const sectionQuestions = questions.filter((q) => q.section === completedSection);
    const sectionCorrect = sectionQuestions.filter(
      (q) => answers[q.id] === q.correctAnswer
    ).length;
    const sectionPct = Math.round((sectionCorrect / sectionQuestions.length) * 100);

    return (
      <div className="quiz-container">
        <div className="section-break">
          <div className="section-break-icon" aria-hidden="true">
            {sectionPct >= 75 ? '!' : sectionPct >= 50 ? '~' : '+'}
          </div>
          <h2>{sectionLabel(completedSection)} Complete</h2>
          <p className="section-score">
            {sectionCorrect}/{sectionQuestions.length} correct ({sectionPct}%)
          </p>
          <p className="section-summary">
            {getSectionSummary(completedSection, sectionPct)}
          </p>
          <p className="section-next">
            Next up: <strong>{sectionLabel(currentSection ?? '')}</strong>
          </p>
          <button className="btn-primary" onClick={handleSectionContinue}>
            Continue
          </button>
        </div>
      </div>
    );
  }

  if (state === 'email-gate') {
    return (
      <div className="quiz-container">
        <div className="email-gate">
          <h2>Your results are ready.</h2>
          <p>
            Enter your email to see your Communication DNA score, archetype
            assignment, personalized strengths, growth edges, and
            recommendations.
          </p>
          <form onSubmit={handleEmailSubmit} className="email-form">
            <div className="form-field">
              <label htmlFor="quiz-first-name">First name (optional)</label>
              <input
                id="quiz-first-name"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="First name"
                autoComplete="given-name"
              />
            </div>
            <div className="form-field">
              <label htmlFor="quiz-email">Email address</label>
              <input
                id="quiz-email"
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError('');
                }}
                placeholder="you@example.com"
                required
                autoComplete="email"
                aria-describedby={emailError ? 'email-error' : undefined}
              />
              {emailError && (
                <p id="email-error" className="form-error" role="alert">
                  {emailError}
                </p>
              )}
            </div>
            <button
              type="submit"
              className="btn-primary"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Loading...' : 'See My Results'}
            </button>
            <p className="email-disclaimer">
              No spam. Your results go to your inbox along with a short series
              about the 23-dimension framework.
            </p>
          </form>
        </div>
      </div>
    );
  }

  if (state === 'results' && results) {
    return (
      <div className="quiz-container">
        <div className="results">
          <div className="results-header">
            <div className="score-circle" role="img" aria-label={`Score: ${results.overallScore} out of 100`}>
              <span className="score-number">{results.overallScore}</span>
              <span className="score-label">/100</span>
            </div>
            <h2 className="tier-label">{results.tierLabel}</h2>
            <p className="tier-description">{results.tierDescription}</p>
          </div>

          <div className="results-sections">
            <h3>Section Breakdown</h3>
            {results.sectionScores.map((s) => (
              <div key={s.section} className="section-bar">
                <div className="section-bar-header">
                  <span className="section-bar-label">
                    {sectionLabel(s.section)}
                  </span>
                  <span className="section-bar-score">
                    {s.correct}/{s.total} ({s.percentage}%)
                  </span>
                </div>
                <div
                  className="section-bar-track"
                  role="progressbar"
                  aria-valuenow={s.percentage}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${sectionLabel(s.section)}: ${s.percentage}%`}
                >
                  <div
                    className="section-bar-fill"
                    style={{ width: `${s.percentage}%` }}
                  />
                </div>
                <p className="section-bar-summary">
                  {getSectionSummary(s.section, s.percentage)}
                </p>
              </div>
            ))}
          </div>

          <div className="results-archetype">
            <h3>Your Communication Archetype</h3>
            <div className="archetype-card">
              <h4>{results.archetype.name}</h4>
              <p className="archetype-tagline">
                {results.archetype.tagline}
              </p>
              <p>{results.archetype.description}</p>

              <div className="archetype-examples">
                <strong>Famous communicators who share your archetype:</strong>
                <p>{results.archetype.famousExamples.join(', ')}</p>
              </div>

              <div className="archetype-strengths">
                <strong>Your strengths:</strong>
                <ul>
                  {results.archetype.strengths.map((s, i) => (
                    <li key={i}>{s}</li>
                  ))}
                </ul>
              </div>

              <div className="archetype-blindspots">
                <strong>Your blind spots:</strong>
                <ul>
                  {results.archetype.blindSpots.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>

              <div className="archetype-growth">
                <strong>Your growth path:</strong>
                <p>{results.archetype.growthRecommendation}</p>
              </div>

              {results.secondaryArchetype && (
                <p className="secondary-archetype">
                  Secondary archetype:{' '}
                  <strong>{results.secondaryArchetype.name}</strong>
                </p>
              )}
            </div>
          </div>

          {results.strengths.length > 0 && (
            <div className="results-strengths">
              <h3>Your Top Strengths</h3>
              {results.strengths.map((s, i) => (
                <div key={i} className="strength-card">
                  <h4>
                    Strength #{i + 1}: {s.dimension}
                  </h4>
                  <p>{s.summary}</p>
                  <div className="strength-bar">
                    <div
                      className="strength-bar-fill"
                      style={{ width: `${s.percentage}%` }}
                    />
                    <span>{s.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.growthEdges.length > 0 && (
            <div className="results-growth">
              <h3>Your Growth Edges</h3>
              {results.growthEdges.map((g, i) => (
                <div key={i} className="growth-card">
                  <h4>
                    Growth Edge #{i + 1}: {g.dimension}
                  </h4>
                  <p>{g.summary}</p>
                  <div className="growth-bar">
                    <div
                      className="growth-bar-fill"
                      style={{ width: `${g.percentage}%` }}
                    />
                    <span>{g.percentage}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.recommendations.length > 0 && (
            <div className="results-recommendations">
              <h3>Personalized Recommendations</h3>
              <ol>
                {results.recommendations.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ol>
            </div>
          )}

          <div className="results-cta">
            <h3>{config.tenant.ctaHeading}</h3>
            <p>{config.tenant.ctaBody}</p>
            <div className="cta-buttons">
              <a href={config.tenant.ctaPrimaryUrl} className="btn-primary">
                {config.tenant.ctaPrimaryLabel}
              </a>
              {config.tenant.ctaSecondaryLabel && config.tenant.ctaSecondaryUrl && (
                <a
                  href={config.tenant.ctaSecondaryUrl}
                  className="btn-secondary"
                >
                  {config.tenant.ctaSecondaryLabel}
                </a>
              )}
            </div>
          </div>

          <div className="results-footer">
            <button className="btn-text" onClick={handleRestart}>
              Retake the quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  // --- QUESTION STATE ---
  if (!currentQuestion) return null;

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <div className="quiz-container" ref={questionRef}>
      <div className="quiz-progress">
        <div className="progress-bar" role="progressbar" aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <div className="progress-text">
          <span>
            Question {currentIndex + 1} of {totalQuestions}
          </span>
          <span className="progress-section">
            {sectionLabel(currentQuestion.section)}
          </span>
        </div>
      </div>

      <div className="question-card">
        <p className="question-stem">{currentQuestion.stem}</p>

        <div className="options-list" role="radiogroup" aria-label="Answer options">
          {currentQuestion.options.map((option) => {
            const isSelected = selectedAnswer === option.label;
            const isOptionCorrect = option.label === currentQuestion.correctAnswer;
            let optionClass = 'option';

            if (showExplanation) {
              if (isOptionCorrect) optionClass += ' option-correct';
              else if (isSelected) optionClass += ' option-incorrect';
              else optionClass += ' option-disabled';
            } else if (isSelected) {
              optionClass += ' option-selected';
            }

            return (
              <button
                key={option.label}
                className={optionClass}
                onClick={() => handleSelectAnswer(option.label)}
                disabled={showExplanation}
                role="radio"
                aria-checked={isSelected}
                aria-label={`${option.label}: ${option.text}`}
              >
                <span className="option-label">{option.label}</span>
                <span className="option-text">{option.text}</span>
              </button>
            );
          })}
        </div>

        {showExplanation && (
          <div className={`explanation ${isCorrect ? 'explanation-correct' : 'explanation-incorrect'}`}>
            <p className="explanation-verdict">
              {isCorrect ? 'Correct!' : `Not quite. The answer is ${currentQuestion.correctAnswer}.`}
            </p>
            <p className="explanation-text">{currentQuestion.explanation}</p>
            <p className="explanation-dimension">
              <small>{currentQuestion.dimensionTested}</small>
            </p>
            <button className="btn-primary" onClick={handleNext}>
              {currentIndex + 1 === totalQuestions ? 'See Results' : 'Next Question'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
