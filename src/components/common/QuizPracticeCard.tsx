import { useEffect, useMemo, useState } from "react";
import { CheckCircle2, Circle, RotateCcw, XCircle } from "lucide-react";
import { Link } from "react-router-dom";
import type { QuizPracticeQuestion } from "../../data/quizPractice";
import { clearQuizAnswer, readQuizProgress, saveQuizAnswer } from "../../lib/quizProgress";
import { SecurityStatusBadge, type SecurityStatusLike } from "./SecurityStatusBadge";
import { GlossaryText } from "./GlossaryPopover";

export function QuizPracticeCard({ question, compact = false, onAnswered }: { question: QuizPracticeQuestion; compact?: boolean; onAnswered?: () => void }) {
  const [selected, setSelected] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);
  const stored = useMemo(() => readQuizProgress()[question.id], [question.id]);

  useEffect(() => {
    if (!stored) {
      setSelected(null);
      setSubmitted(false);
      return;
    }
    setSelected(stored.selectedIndex);
    setSubmitted(true);
  }, [stored, question.id]);

  const correct = selected === question.correctIndex;
  const choose = (index: number) => {
    if (submitted) return;
    setSelected(index);
  };
  const submit = () => {
    if (selected === null) return;
    saveQuizAnswer({
      quizId: question.id,
      route: question.route,
      selectedIndex: selected,
      correct: selected === question.correctIndex,
      answeredAt: new Date().toISOString(),
    });
    setSubmitted(true);
    onAnswered?.();
  };
  const retry = () => {
    clearQuizAnswer(question.id);
    setSelected(null);
    setSubmitted(false);
    onAnswered?.();
  };

  return (
    <article className={`rounded-md border border-slate-200 bg-white shadow-sm ${compact ? "p-3" : "p-4"}`}>
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">{question.difficulty}</span>
        <SecurityStatusBadge status={question.status as SecurityStatusLike} compact />
        {!compact && <Link className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-semibold text-blue-800 hover:border-blue-300 hover:bg-blue-100" to={question.route}>{question.algorithm}</Link>}
      </div>

      <h3 className={`${compact ? "mt-3 text-sm" : "mt-4 text-base"} font-semibold text-slate-950`}>
        <GlossaryText text={question.question} />
      </h3>

      <div className="mt-3 grid gap-2">
        {question.options.map((option, index) => {
          const isSelected = selected === index;
          const isCorrect = submitted && index === question.correctIndex;
          const isWrong = submitted && isSelected && !isCorrect;
          return (
            <button
              key={option}
              type="button"
              className={`flex min-h-11 items-start gap-2 rounded-md border px-3 py-2 text-left text-sm transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 ${
                isCorrect
                  ? "border-emerald-300 bg-emerald-50 text-emerald-950"
                  : isWrong
                    ? "border-red-300 bg-red-50 text-red-950"
                    : isSelected
                      ? "border-teal-400 bg-teal-50 text-teal-950"
                      : "border-slate-200 bg-slate-50 text-slate-700 hover:border-teal-300 hover:bg-teal-50"
              }`}
              onClick={() => choose(index)}
              aria-pressed={isSelected}
            >
              <span className="mt-0.5 shrink-0">
                {isCorrect ? <CheckCircle2 className="h-4 w-4 text-emerald-700" /> : isWrong ? <XCircle className="h-4 w-4 text-red-700" /> : <Circle className="h-4 w-4 text-slate-400" />}
              </span>
              <span><GlossaryText text={option} /></span>
            </button>
          );
        })}
      </div>

      {submitted && (
        <div className={`mt-3 rounded-md border p-3 text-sm ${correct ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-950"}`}>
          <div className="font-semibold">{correct ? "Correct" : "Not quite"}</div>
          <p className="mt-1"><GlossaryText text={question.explanation} /></p>
          {!correct && <p className="mt-1"><span className="font-semibold">Correct answer:</span> <GlossaryText text={question.options[question.correctIndex]} /></p>}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button className="btn btn-primary" disabled={selected === null || submitted} onClick={submit}>Check answer</button>
        <button className="btn" onClick={retry}><RotateCcw className="h-4 w-4" /> Try again</button>
        {compact && <Link className="btn" to="/quiz-practice">Practice all</Link>}
      </div>
    </article>
  );
}
