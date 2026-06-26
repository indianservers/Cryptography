import { getChallengesForRoute } from "../../data/moduleChallenges";
import { useChallengeMode } from "../../hooks/useChallengeMode";

function SingleChallenge({ route }: { route: string }) {
  const challenge = getChallengesForRoute(route)[0];
  const mode = useChallengeMode(challenge);
  if (!challenge) return null;

  return (
    <section className="mt-5 rounded-md border border-violet-200 bg-violet-50 p-4" aria-label={`${challenge.title} challenge mode`}>
      <div className="text-xs font-bold uppercase tracking-wide text-violet-800">Challenge mode</div>
      <div className="mt-1 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="text-xl font-bold text-slate-900">{challenge.title}</h2>
          <p className="mt-1 text-sm text-slate-700">{challenge.prompt}</p>
        </div>
        <span className="rounded-full border border-violet-200 bg-white px-3 py-1 text-sm font-bold capitalize text-violet-900">{challenge.difficulty}</span>
      </div>
      {challenge.options ? (
        <fieldset className="mt-4 grid gap-2 md:grid-cols-2">
          <legend className="sr-only">Choose an answer</legend>
          {challenge.options.map((option) => (
            <label key={option} className="flex min-h-11 items-center gap-2 rounded-md border border-violet-100 bg-white p-3 text-sm font-semibold text-slate-800">
              <input type="radio" name={challenge.id} value={option} checked={mode.answer === option} onChange={(event) => mode.setAnswer(event.target.value)} />
              {option}
            </label>
          ))}
        </fieldset>
      ) : (
        <label className="label mt-4 block">Answer<input className="field mt-1" value={mode.answer} onChange={(event) => mode.setAnswer(event.target.value)} /></label>
      )}
      {mode.revealed && (
        <div className={`mt-4 rounded-md border p-3 text-sm ${mode.correct ? "border-emerald-200 bg-emerald-50 text-emerald-900" : "border-amber-200 bg-amber-50 text-amber-950"}`}>
          <div className="font-bold">{mode.correct ? "Correct" : "Not quite yet"}</div>
          <p className="mt-1">{challenge.explanation}</p>
          {!mode.correct && <p className="mt-1">Correct answer: {challenge.correctAnswer}</p>}
        </div>
      )}
      {challenge.exactnessNote && <p className="mt-3 rounded-md border border-slate-200 bg-white p-2 text-sm text-slate-700">{challenge.exactnessNote}</p>}
      <div className="mt-4 flex flex-wrap gap-2">
        <button type="button" className="btn btn-primary" onClick={mode.submit}>Submit answer</button>
        <button type="button" className="btn" onClick={mode.reveal}>Reveal explanation</button>
        <button type="button" className="btn btn-secondary" onClick={mode.reset}>Retry</button>
      </div>
    </section>
  );
}

export function ChallengeModePanel({ route }: { route: string }) {
  return <SingleChallenge route={route} />;
}
