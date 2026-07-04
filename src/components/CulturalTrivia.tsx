import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, AlertCircle, RotateCcw, HelpCircle } from 'lucide-react';
import { TriviaQuestion } from '../types';

interface CulturalTriviaProps {
  triviaQuestions: TriviaQuestion[];
  destinationName: string;
}

export default function CulturalTrivia({ triviaQuestions, destinationName }: CulturalTriviaProps) {
  const [currentIdx, setCurrentIdx] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState<number>(0);
  const [completed, setCompleted] = useState<boolean>(false);
  const [showExplanation, setShowExplanation] = useState<boolean>(false);

  useEffect(() => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setCompleted(false);
    setShowExplanation(false);
  }, [destinationName, triviaQuestions]);

  if (!triviaQuestions || triviaQuestions.length === 0) {
    return (
      <div className="text-center py-12 font-body" style={{ color: 'var(--text-muted)' }}>
        <div className="text-4xl mb-3">🧩</div>
        <p>No trivia generated. Try searching for a destination.</p>
      </div>
    );
  }

  const currentQuestion = triviaQuestions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(idx);
    setShowExplanation(true);
    if (idx === currentQuestion.correctIndex) {
      setScore((prev) => prev + 1);
    }
  };

  const handleNext = () => {
    setSelectedAnswer(null);
    setShowExplanation(false);
    if (currentIdx < triviaQuestions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
    } else {
      setCompleted(true);
    }
  };

  const handleRestart = () => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setCompleted(false);
    setShowExplanation(false);
  };

  return (
    <div id="cultural-trivia-panel" className="india-card p-6 md:p-8 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6 pb-5"
        style={{ borderBottom: '1px solid rgba(201,150,12,0.15)' }}>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <HelpCircle size={18} style={{ color: 'var(--saffron)' }} />
            <h3 className="font-display font-bold text-xl" style={{ color: 'var(--text-dark)' }}>
              Cultural Challenge
            </h3>
          </div>
          <p className="text-xs font-body" style={{ color: 'var(--text-muted)' }}>
            Test your knowledge of {destinationName} customs & folklore
          </p>
        </div>
        {!completed && (
          <div className="text-right">
            <div className="text-xs font-body font-semibold" style={{ color: 'var(--saffron)' }}>
              Question
            </div>
            <div className="font-display font-bold text-2xl" style={{ color: 'var(--text-dark)' }}>
              {currentIdx + 1}/{triviaQuestions.length}
            </div>
          </div>
        )}
      </div>

      {completed ? (
        /* ── Score screen ── */
        <div className="text-center py-6 space-y-6 animate-bloom">
          <div className="text-6xl mb-2">{score === triviaQuestions.length ? '🏆' : score >= triviaQuestions.length / 2 ? '⭐' : '📚'}</div>
          <div>
            <h4 className="font-display font-bold text-2xl mb-2" style={{ color: 'var(--text-dark)' }}>
              {score === triviaQuestions.length ? 'Flawless!' : 'Well Done!'}
            </h4>
            <p className="font-body text-base mb-1" style={{ color: 'var(--text-medium)' }}>
              You scored{' '}
              <span className="font-bold font-display text-xl" style={{ color: 'var(--saffron)' }}>
                {score}
              </span>
              {' '}out of{' '}
              <span className="font-bold" style={{ color: 'var(--text-dark)' }}>
                {triviaQuestions.length}
              </span>
            </p>
            <p className="text-sm font-body max-w-sm mx-auto leading-relaxed" style={{ color: 'var(--text-muted)' }}>
              {score === triviaQuestions.length
                ? 'You possess a deep respect for local customs and lore. You are ready to travel as a true cultural explorer!'
                : 'Great effort! Understanding these cultural nuances makes you a more respectful and enriched traveler.'}
            </p>
          </div>

          {/* Score bar */}
          <div className="mx-auto max-w-xs">
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(201,150,12,0.2)' }}>
              <div
                className="h-full rounded-full transition-all duration-1000"
                style={{
                  width: `${(score / triviaQuestions.length) * 100}%`,
                  background: 'linear-gradient(90deg, var(--saffron), var(--gold))',
                }}
              />
            </div>
            <div className="text-xs font-body mt-1.5 text-center" style={{ color: 'var(--text-muted)' }}>
              {Math.round((score / triviaQuestions.length) * 100)}% accuracy
            </div>
          </div>

          <button
            id="restart-trivia-btn"
            onClick={handleRestart}
            className="btn-saffron px-6 py-3 rounded-full text-sm font-semibold inline-flex items-center gap-2"
          >
            <RotateCcw size={14} />
            Play Again
          </button>
        </div>
      ) : (
        /* ── Question screen ── */
        <div className="space-y-5 animate-fade-in" key={currentIdx}>
          {/* Question */}
          <div className="p-4 rounded-2xl"
            style={{ background: 'rgba(232,132,26,0.06)', border: '1px solid rgba(232,132,26,0.15)' }}>
            <h4 className="font-body font-semibold text-base leading-relaxed" style={{ color: 'var(--text-dark)' }}>
              {currentQuestion.question}
            </h4>
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3" role="radiogroup" aria-label="Answer options">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = currentQuestion.correctIndex === idx;
              const isWrongSelected = isSelected && !isCorrect;
              const answered = selectedAnswer !== null;

              let extraClass = 'trivia-option';
              if (answered) {
                if (isCorrect) extraClass += ' correct';
                else if (isWrongSelected) extraClass += ' wrong';
                else extraClass += ' dimmed';
              }

              return (
                <button
                  key={idx}
                  id={`trivia-option-btn-${idx}`}
                  disabled={answered}
                  onClick={() => handleSelectOption(idx)}
                  className={`${extraClass} w-full p-3.5 rounded-xl text-sm font-body flex items-center justify-between gap-2`}
                  role="radio"
                  aria-checked={isSelected}
                  aria-label={`Option ${idx + 1}: ${option}${answered && isCorrect ? ' (Correct answer)' : answered && isWrongSelected ? ' (Your answer — incorrect)' : ''}`}
                >
                  <span className="text-left">{option}</span>
                  {answered && isCorrect && <CheckCircle2 size={16} style={{ color: '#15803d', flexShrink: 0 }} />}
                  {answered && isWrongSelected && <AlertCircle size={16} style={{ color: 'var(--crimson)', flexShrink: 0 }} />}
                </button>
              );
            })}
          </div>

          {/* Explanation */}
          {showExplanation && (
            <div className="rounded-2xl p-4 animate-bloom"
              style={{ background: 'rgba(14,95,108,0.07)', border: '1px solid rgba(14,95,108,0.2)' }}>
              <div className="text-xs font-body font-semibold uppercase tracking-wider mb-2 flex items-center gap-1.5"
                style={{ color: 'var(--teal)' }}>
                <Award size={12} />
                Cultural Perspective
              </div>
              <p className="text-sm font-body leading-relaxed" style={{ color: 'var(--text-medium)' }}>
                {currentQuestion.explanation}
              </p>

              <div className="flex justify-end mt-3">
                <button
                  id="next-trivia-question-btn"
                  onClick={handleNext}
                  className="btn-saffron px-5 py-2 rounded-full text-sm font-semibold"
                >
                  {currentIdx < triviaQuestions.length - 1 ? 'Next Question →' : 'See Results'}
                </button>
              </div>
            </div>
          )}

          {/* Progress dots */}
          <div className="flex items-center justify-center gap-2 pt-2">
            {triviaQuestions.map((_, i) => (
              <div
                key={i}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === currentIdx ? '24px' : '6px',
                  background: i < currentIdx
                    ? 'var(--gold)'
                    : i === currentIdx
                      ? 'var(--saffron)'
                      : 'rgba(201,150,12,0.2)',
                }}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
