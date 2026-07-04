import React, { useState, useEffect } from 'react';
import { Award, CheckCircle2, AlertCircle, HelpCircle, RotateCcw, Sparkles } from 'lucide-react';
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

  // Reset trivia state when destination changes
  useEffect(() => {
    setCurrentIdx(0);
    setSelectedAnswer(null);
    setScore(0);
    setCompleted(false);
    setShowExplanation(false);
  }, [destinationName, triviaQuestions]);

  if (triviaQuestions.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-sm text-center text-slate-500">
        Cultural trivia has not been prepared. Select a destination to compile a quiz.
      </div>
    );
  }

  const currentQuestion = triviaQuestions[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer !== null) return; // already answered
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
    <div id="cultural-trivia-panel" className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      <div className="flex justify-between items-start border-b border-slate-100 pb-4">
        <div>
          <h3 className="text-base font-bold font-sans text-slate-900 flex items-center gap-2">
            <HelpCircle className="text-blue-600" size={18} />
            Cultural Etiquette & Lore Challenge
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Test your understanding of {destinationName} customs before you land
          </p>
        </div>

        {!completed && (
          <span className="text-xs font-mono bg-slate-50 px-2 py-0.5 rounded text-slate-600 border border-slate-200">
            Q: {currentIdx + 1} / {triviaQuestions.length}
          </span>
        )}
      </div>

      {completed ? (
        <div className="text-center py-6 space-y-4">
          <div className="inline-flex items-center justify-center p-4 bg-blue-50 border border-blue-200 text-blue-600 rounded-full">
            <Award size={36} />
          </div>

          <div className="space-y-1">
            <h4 className="text-base font-bold text-slate-900">Etiquette Challenge Complete!</h4>
            <p className="text-xs text-slate-600">
              You scored <span className="font-bold text-blue-600">{score} out of {triviaQuestions.length}</span> correct answers.
            </p>
          </div>

          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            {score === triviaQuestions.length 
              ? "Flawless! You possess a deep respect for local community rules and native lore."
              : "Splendid effort! Learning these social frameworks is key to being a respectful traveler."}
          </p>

          <button
            onClick={handleRestart}
            id="restart-trivia-btn"
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg inline-flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RotateCcw size={14} />
            Try Challenge Again
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-800 leading-relaxed">
            {currentQuestion.question}
          </h4>

          {/* Options Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
            {currentQuestion.options.map((option, idx) => {
              const isSelected = selectedAnswer === idx;
              const isCorrect = currentQuestion.correctIndex === idx;
              const isWrongAndSelected = isSelected && !isCorrect;

              let buttonStyle = "bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100 hover:text-slate-950";
              if (selectedAnswer !== null) {
                if (isCorrect) {
                  buttonStyle = "bg-green-50 border-green-300 text-green-900 font-semibold";
                } else if (isWrongAndSelected) {
                  buttonStyle = "bg-rose-50 border-rose-300 text-rose-900";
                } else {
                  buttonStyle = "bg-slate-50/55 border-slate-100 text-slate-400 opacity-60";
                }
              }

              return (
                <button
                  key={idx}
                  id={`trivia-option-btn-${idx}`}
                  disabled={selectedAnswer !== null}
                  onClick={() => handleSelectOption(idx)}
                  className={`w-full text-left p-3 rounded-xl border text-xs transition-all flex items-center justify-between gap-2 ${buttonStyle}`}
                >
                  <span>{option}</span>
                  {selectedAnswer !== null && isCorrect && <CheckCircle2 size={14} className="text-green-600 shrink-0" />}
                  {selectedAnswer !== null && isWrongAndSelected && <AlertCircle size={14} className="text-rose-600 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Answer explanation */}
          {showExplanation && (
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mt-4 space-y-2 animate-fade-in">
              <span className="flex items-center gap-1 text-[10px] font-mono font-semibold text-blue-600 uppercase tracking-wider">
                <Sparkles size={11} />
                Cultural Perspective
              </span>
              <p className="text-xs text-slate-600 leading-relaxed">
                {currentQuestion.explanation}
              </p>

              <div className="flex justify-end pt-2">
                <button
                  onClick={handleNext}
                  id="next-trivia-question-btn"
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold transition-all shadow-sm"
                >
                  {currentIdx < triviaQuestions.length - 1 ? "Next Etiquette Lesson →" : "Finish Challenge"}
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
