import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { quizQuestions } from '@/data';
import { motion, AnimatePresence } from 'framer-motion';

export const Quiz = () => {
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | string[] | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState({ correct: 0, total: 0 });

  const currentQuestion = quizQuestions[currentQuestionIdx];

  const handleAnswer = (answer: string) => {
    if (currentQuestion.type === 'multi-select') {
      setSelectedAnswer((prev) => {
        if (!prev || typeof prev === 'string') {
          return [answer];
        }
        const arr = prev as string[];
        if (arr.includes(answer)) {
          return arr.filter((a) => a !== answer);
        } else {
          return [...arr, answer];
        }
      });
    } else {
      setSelectedAnswer(answer);
    }
  };

  const handleSubmit = () => {
    if (!selectedAnswer) return;

    let isCorrect = false;
    if (currentQuestion.type === 'multi-select') {
      const correctArray = Array.isArray(currentQuestion.correctAnswer)
        ? currentQuestion.correctAnswer
        : [currentQuestion.correctAnswer];
      const selectedArray = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
      isCorrect = correctArray.length === selectedArray.length &&
                  correctArray.every(a => selectedArray.includes(String(a)));
    } else {
      isCorrect = selectedAnswer === String(currentQuestion.correctAnswer);
    }

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

  let isCorrect = false;
  if (currentQuestion.type === 'multi-select') {
    const correctArray = Array.isArray(currentQuestion.correctAnswer)
      ? currentQuestion.correctAnswer
      : [currentQuestion.correctAnswer];
    const selectedArray = Array.isArray(selectedAnswer) ? selectedAnswer : [];
    isCorrect = correctArray.length === selectedArray.length &&
                correctArray.every(a => selectedArray.includes(String(a)));
  } else {
    isCorrect = selectedAnswer === String(currentQuestion.correctAnswer);
  }

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
              <div className="flex items-center justify-between mb-4">
                <p className="text-lg font-medium text-slate-900 dark:text-slate-100">
                  {currentQuestion.question}
                </p>
                {currentQuestion.type === 'multi-select' && (
                  <Badge variant="default" className="ml-2 flex-shrink-0">Multi-select</Badge>
                )}
              </div>

              {/* Options */}
              <div className="space-y-2">
                {currentQuestion.options?.map((option) => {
                  const selectedArray = Array.isArray(selectedAnswer) ? selectedAnswer : [selectedAnswer];
                  const correctArray = Array.isArray(currentQuestion.correctAnswer)
                    ? currentQuestion.correctAnswer
                    : [currentQuestion.correctAnswer];

                  const isSelected = selectedArray.includes(option);
                  const isCorrectAnswer = correctArray.includes(option);
                  const showResult = showExplanation;

                  return (
                    <button
                      key={option}
                      onClick={() => !showExplanation && handleAnswer(option)}
                      disabled={showExplanation}
                      className={`w-full p-4 text-left rounded-lg border-2 transition-all ${
                        showResult
                          ? isCorrectAnswer
                            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                            : isSelected
                            ? 'border-red-500 bg-red-50 dark:bg-red-900/20'
                            : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800'
                          : isSelected
                          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-slate-300 dark:hover:border-slate-600'
                      } ${showExplanation ? 'cursor-default' : 'cursor-pointer'}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          {currentQuestion.type === 'multi-select' && (
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                              isSelected ? 'bg-blue-600 border-blue-600' : 'border-slate-300 dark:border-slate-600'
                            }`}>
                              {isSelected && <span className="text-white text-sm">✓</span>}
                            </div>
                          )}
                          <span className="text-slate-900 dark:text-slate-100">{option}</span>
                        </div>
                        {showResult && isCorrectAnswer && (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">✓</span>
                        )}
                        {showResult && isSelected && !isCorrectAnswer && (
                          <span className="text-red-600 dark:text-red-400 font-semibold">✗</span>
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
