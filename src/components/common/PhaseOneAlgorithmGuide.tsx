import { BookOpen, CheckCircle2, ExternalLink, Lightbulb } from "lucide-react";
import { findAlgorithmLearningContent } from "../../data/phaseTwoAlgorithmContent";
import { GlossaryText } from "./GlossaryPopover";
import { SecurityStatusBadge } from "./SecurityStatusBadge";
import { getQuizQuestionForRoute } from "../../data/quizPractice";
import { QuizPracticeCard } from "./QuizPracticeCard";

function MiniList({ title, items, tone = "slate" }: { title: string; items: string[]; tone?: "slate" | "emerald" | "amber" | "red" | "blue" }) {
  const tones = {
    slate: "border-slate-200 bg-slate-50 text-slate-700",
    emerald: "border-emerald-200 bg-emerald-50 text-emerald-900",
    amber: "border-amber-200 bg-amber-50 text-amber-900",
    red: "border-red-200 bg-red-50 text-red-900",
    blue: "border-blue-200 bg-blue-50 text-blue-900",
  };
  return (
    <div className={`rounded-md border p-3 ${tones[tone]}`}>
      <div className="text-xs font-bold uppercase">{title}</div>
      <ul className="mt-2 space-y-1 text-sm">
        {items.slice(0, 4).map((item) => <li key={item}>- <GlossaryText text={item} /></li>)}
      </ul>
    </div>
  );
}

export function PhaseOneAlgorithmGuide({ route }: { route: string }) {
  const content = findAlgorithmLearningContent(route);
  if (!content) return null;
  const quiz = getQuizQuestionForRoute(route);

  return (
    <section className="mt-4 rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap items-center gap-2">
        <span className="rounded-full border border-blue-200 bg-blue-50 px-2 py-1 text-xs font-bold uppercase text-blue-800">Learning guide</span>
        <SecurityStatusBadge status={content.securityStatus} compact />
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">{content.difficulty}</span>
        <span className="rounded-full border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700">{content.implementationSupport}</span>
      </div>

      <div className="mt-3 grid gap-4 xl:grid-cols-[1fr_1fr]">
        <div>
          <h2 className="flex items-center gap-2 text-lg font-semibold text-ink"><BookOpen className="h-5 w-5 text-blue-700" /> Beginner explanation</h2>
          <p className="mt-2 text-sm text-slate-700"><GlossaryText text={content.summary} /></p>
          <p className="mt-2 text-sm text-slate-600"><span className="font-semibold">Analogy:</span> <GlossaryText text={content.analogy} /></p>
          <p className="mt-2 text-sm text-slate-600"><span className="font-semibold">Why it exists:</span> <GlossaryText text={content.purpose} /></p>
        </div>
        <div className="rounded-md border border-blue-200 bg-blue-50 p-3 text-sm text-blue-950">
          <div className="flex items-center gap-2 font-semibold"><Lightbulb className="h-4 w-4" /> Worked example</div>
          <div className="mt-2 grid gap-1">
            <div><span className="font-semibold">Input:</span> <GlossaryText text={content.workedExample.input} /></div>
            <div><span className="font-semibold">Parameters:</span> <GlossaryText text={content.workedExample.parameters} /></div>
            <div><span className="font-semibold">Output:</span> <GlossaryText text={content.workedExample.output} /></div>
          </div>
          <ol className="mt-2 space-y-1 pl-4">
            {content.workedExample.trace.slice(0, 4).map((step, index) => <li key={step}>{index + 1}. <GlossaryText text={step} /></li>)}
          </ol>
        </div>
      </div>

      <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <MiniList title="Where used" items={content.useCases} tone="emerald" />
        <MiniList title="Avoid for" items={content.avoidFor} tone="red" />
        <MiniList title="Operation steps" items={content.steps} tone="blue" />
        <MiniList title="Common mistakes" items={content.implementationMistakes} tone="amber" />
      </div>

      <details className="mt-4 rounded-md border border-slate-200 bg-slate-50">
        <summary className="cursor-pointer px-4 py-3 text-sm font-bold text-slate-800">Technical notes, pseudocode, attacks, quiz, and references</summary>
        <div className="grid gap-4 border-t border-slate-200 p-4 lg:grid-cols-2">
          <div className="space-y-3">
            <MiniList title="Inputs and outputs" items={[...content.inputs.map((item) => `Input: ${item}`), ...content.outputs.map((item) => `Output: ${item}`)]} />
            <MiniList title="Key sizes / parameters" items={[...content.keySizes, ...content.parameters]} />
            <MiniList title="Known attacks" items={content.attacks} tone="red" />
          </div>
          <div className="space-y-3">
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <div className="mb-2 text-xs font-bold uppercase text-slate-500">Pseudocode</div>
              <pre className="overflow-auto whitespace-pre-wrap rounded bg-slate-900 p-3 font-mono text-xs text-slate-50">{content.pseudocode.join("\n")}</pre>
            </div>
            <div className="rounded-md border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-950">
              <div className="flex items-center gap-2 font-semibold"><CheckCircle2 className="h-4 w-4" /> Current recommendation</div>
              <p className="mt-1"><GlossaryText text={content.recommendation} /></p>
            </div>
            {quiz && <QuizPracticeCard question={quiz} compact />}
            <div className="rounded-md border border-slate-200 bg-white p-3">
              <div className="text-xs font-bold uppercase text-slate-500">References, last reviewed {content.lastReviewed}</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {content.references.map((reference) => (
                  <a key={reference.url} href={reference.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-semibold text-slate-700 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-900">
                    {reference.label}<ExternalLink className="h-3 w-3" />
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </details>
    </section>
  );
}
