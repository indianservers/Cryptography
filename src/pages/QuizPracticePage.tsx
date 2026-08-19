import { useEffect, useMemo, useState } from "react";
import { BookOpenCheck, RotateCcw, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { quizCategories, quizDifficulties, filterQuizQuestions, quizPracticeQuestions } from "../data/quizPractice";
import { readQuizProgress, resetQuizProgress, summarizeQuizProgress } from "../lib/quizProgress";
import { QuizPracticeCard } from "../components/common/QuizPracticeCard";

export default function QuizPracticePage() {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [difficulty, setDifficulty] = useState("All");
  const [mode, setMode] = useState<"all" | "unanswered" | "missed">("all");
  const [progress, setProgress] = useState(readQuizProgress);

  useEffect(() => {
    const sync = () => setProgress(readQuizProgress());
    window.addEventListener("quiz-progress-change", sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener("quiz-progress-change", sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const filtered = useMemo(() => {
    const base = filterQuizQuestions({ query, category, difficulty });
    if (mode === "unanswered") return base.filter((item) => !progress[item.id]);
    if (mode === "missed") return base.filter((item) => progress[item.id] && !progress[item.id].correct);
    return base;
  }, [category, difficulty, mode, progress, query]);
  const summary = summarizeQuizProgress(quizPracticeQuestions.length, progress);

  const resetAll = () => {
    resetQuizProgress();
    setProgress({});
  };

  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <div className="flex flex-wrap items-center gap-3">
          <span className="rounded-md border border-teal-200 bg-teal-50 p-2 text-teal-800"><BookOpenCheck className="h-5 w-5" /></span>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-teal-700">Local quiz practice</p>
            <h1 className="text-2xl font-bold text-slate-950 sm:text-3xl">Quiz and Practice</h1>
          </div>
        </div>
        <p className="mt-3 max-w-3xl text-slate-600">Practice questions generated from the algorithm learning registry. Progress is stored only in this browser profile.</p>
      </section>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-500">Answered</div>
          <div className="mt-1 text-2xl font-bold">{summary.answered}/{summary.total}</div>
        </div>
        <div className="rounded-md border border-emerald-200 bg-emerald-50 p-4 shadow-sm text-emerald-950">
          <div className="text-xs font-bold uppercase">Correct</div>
          <div className="mt-1 text-2xl font-bold">{summary.correct}</div>
        </div>
        <div className="rounded-md border border-blue-200 bg-blue-50 p-4 shadow-sm text-blue-950">
          <div className="text-xs font-bold uppercase">Score</div>
          <div className="mt-1 text-2xl font-bold">{summary.percent}%</div>
        </div>
        <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
          <div className="text-xs font-bold uppercase text-slate-500">Visible</div>
          <div className="mt-1 text-2xl font-bold">{filtered.length}</div>
        </div>
      </section>

      <section className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
        <div className="grid gap-3 lg:grid-cols-[1fr_14rem_12rem_12rem_auto]">
          <label className="flex min-h-11 items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-100">
            <Search className="h-4 w-4 text-slate-500" />
            <input className="w-full outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search algorithms, category, status..." />
          </label>
          <select className="field" value={category} onChange={(event) => setCategory(event.target.value)}>
            <option>All</option>
            {quizCategories.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="field" value={difficulty} onChange={(event) => setDifficulty(event.target.value)}>
            <option>All</option>
            {quizDifficulties.map((item) => <option key={item}>{item}</option>)}
          </select>
          <select className="field" value={mode} onChange={(event) => setMode(event.target.value as typeof mode)}>
            <option value="all">All questions</option>
            <option value="unanswered">Unanswered</option>
            <option value="missed">Missed</option>
          </select>
          <button className="btn btn-warning" onClick={resetAll}><RotateCcw className="h-4 w-4" /> Reset</button>
        </div>
      </section>

      <section className="grid gap-4 xl:grid-cols-2">
        {filtered.map((question) => <QuizPracticeCard key={question.id} question={question} onAnswered={() => setProgress(readQuizProgress())} />)}
        {!filtered.length && (
          <div className="rounded-md border border-dashed border-slate-300 bg-white p-6 text-sm text-slate-600">
            No questions match the current filters. <Link className="font-semibold text-teal-700 hover:text-teal-900" to="/quiz-practice" onClick={() => { setQuery(""); setCategory("All"); setDifficulty("All"); setMode("all"); }}>Show all questions</Link>
          </div>
        )}
      </section>
    </div>
  );
}
