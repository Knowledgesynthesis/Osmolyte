import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { quizQuestions } from '@/data';
import { motion, AnimatePresence } from 'framer-motion';

export const Quiz = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const currentQuestion = quizQuestions[currentQuestionIdx];

  const handleAnswer = (answer: string) => {
    setSelectedAnswer(answer);
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuestion.correctAnswer;
    setScore((prev) => ({
      correct: prev.correct + (isCorrect ? 1 : 0),
      total: prev.total + 1,
    }));
    setShowExplanation(true);
  };

  const handleNext = () => {
    if (currentQuestionIdx < quizQuestions.length - 1) {
      setCurrentQuestionIdx((prev) => prev + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      // Quiz complete
      setCurrentQuestionIdx(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  };

  const isCorrect = selectedAnswer === currentQuestion.correctAnswer;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quick Quiz</CardTitle>
          <div className="flex items-center gap-3">
            <Badge>{currentQuestion.difficulty}</Badge>
            <span className="text-sm text-slate-600">
              Question {currentQuestionIdx + 1} of {quizQuestions.length}
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {/* Score */}
          {score.total > 0 && (
            <div className="p-3 bg-slate-100 rounded-lg text-center">
              <span className="text-sm font-medium text-slate-700">
                Score: {score.correct} / {score.total} ({((score.correct / score.total) * 100).toFixed(0)}%)
              </span>
            </div>
          )}

          {/* Question */}
          <AnimatePresence mode="wait">
            <motion.div
              key={currentQuestionIdx}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-lg font-medium text-slate-900 mb-4">
                {currentQuestion.question}
              </p>

              {/* Options */}
              <div className="space-y-2">
                {currentQuestion.options?.map((option) => {
                  const isSelected = selectedAnswer === option;
                  const isCorrectAnswer = option === currentQuestion.correctAnswer;
                  const showResult = showExplanation;

                  return (
                    <button
                      key={option}
                      onClick={() => !showExplanation && handleAnswer(option)}
                      disabled={showExplanation}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        showResult
                          ? isCorrectAnswer
                            ? 'border-emerald-500 bg-emerald-50'
                            : isSelected
                            ? 'border-red-500 bg-red-50'
                            : 'border-slate-200 bg-white'
                          : isSelected
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-slate-200 bg-white hover:border-slate-300'
                      } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-slate-900">{option}</span>
                        {showResult && isCorrectAnswer && (
                          <span className="text-emerald-600 font-semibold">✓</span>
                        )}
                        {showResult && isSelected && !isCorrectAnswer && (
                          <span className="text-red-600 font-semibold">✗</span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {showExplanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className={`mt-4 p-4 rounded-lg border-2 ${
                      isCorrect
                        ? 'border-emerald-300 bg-emerald-50'
                        : 'border-red-300 bg-red-50'
                    }`}
                  >
                    <h4 className={`font-semibold mb-2 ${
                      isCorrect ? 'text-emerald-900' : 'text-red-900'
                    }`}>
                      {isCorrect ? '✓ Correct!' : '✗ Incorrect'}
                    </h4>
                    <p className={`text-sm ${
                      isCorrect ? 'text-emerald-800' : 'text-red-800'
                    }`}>
                      {currentQuestion.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Actions */}
              <div className="flex gap-3 mt-6">
                {!showExplanation ? (
                  <Button
                    onClick={handleSubmit}
                    disabled={!selectedAnswer}
                    className="flex-1"
                  >
                    Submit Answer
                  </Button>
                ) : (
                  <Button onClick={handleNext} className="flex-1">
                    {currentQuestionIdx < quizQuestions.length - 1 ? 'Next Question' : 'Restart Quiz'}
                  </Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </CardContent>
    </Card>
  );
};
