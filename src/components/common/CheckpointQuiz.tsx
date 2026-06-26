import { useState } from "react";
import type { CheckpointQuestion } from "../../data/moduleLearningContent";

export function CheckpointQuiz({ questions }: { questions: CheckpointQuestion[] }) {
  const [answers, setAnswers] = useState<Record<number, number>>({});

  if (!questions.length) return null;

  return (
    <section className="rounded-md border border-violet-200 bg-violet-50 p-4">
      <div className="text-xs font-bold uppercase tracking-wide text-violet-800">Checkpoint</div>
      <div className="mt-3 space-y-3">
        {questions.map((question, questionIndex) => {
          const selected = answers[questionIndex];
          return (
            <div key={question.question} className="rounded-md border border-violet-100 bg-white p-3">
              <div className="text-sm font-semibold text-slate-900">{question.question}</div>
              <div className="mt-3 flex flex-wrap gap-2">
                {question.options.map((option, optionIndex) => (
                  <button
                    key={option}
                    type="button"
                    className={`rounded-md border px-3 py-2 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 ${
                      selected === optionIndex
                        ? optionIndex === question.correctIndex
                          ? "border-emerald-300 bg-emerald-50 text-emerald-900"
                          : "border-amber-300 bg-amber-50 text-amber-950"
                        : "border-slate-200 bg-white text-slate-700 hover:border-violet-300 hover:bg-violet-50"
                    }`}
                    onClick={() => setAnswers((current) => ({ ...current, [questionIndex]: optionIndex }))}
                  >
                    {option}
                  </button>
                ))}
              </div>
              {selected !== undefined && (
                <p className="mt-3 text-sm text-slate-700">{question.explanation}</p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
