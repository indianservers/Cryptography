import { HelpCircle } from "lucide-react";
import { getGlossaryDefinition, glossaryTerms } from "../../data/glossaryTerms";

const sortedTerms = glossaryTerms
  .flatMap((definition) => [definition.term, ...definition.aliases])
  .sort((left, right) => right.length - left.length)
  .map((term) => term.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));

const glossaryPattern = new RegExp(`\\b(${sortedTerms.join("|")})\\b`, "gi");

export function GlossaryPopover({ term, children }: { term: string; children?: React.ReactNode }) {
  const definition = getGlossaryDefinition(term);
  if (!definition) return <>{children ?? term}</>;
  const popoverId = `glossary-${definition.term.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <span className="group/glossary relative inline-flex align-baseline">
      <button
        type="button"
        aria-describedby={popoverId}
        className="inline-flex items-center gap-0.5 rounded border border-blue-200 bg-blue-50 px-1 font-semibold text-blue-900 underline decoration-blue-300 decoration-dotted underline-offset-2 transition hover:border-blue-300 hover:bg-blue-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
      >
        {children ?? term}
        <HelpCircle className="h-3 w-3" aria-hidden="true" />
      </button>
      <span
        id={popoverId}
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-40 mt-2 hidden w-[min(20rem,calc(100vw-2rem))] rounded-md border border-slate-300 bg-white p-3 text-left text-xs font-normal leading-relaxed text-slate-700 shadow-xl group-hover/glossary:block group-focus-within/glossary:block"
      >
        <span className="block text-sm font-bold text-slate-950">{definition.term}</span>
        <span className="mt-1 block font-semibold text-blue-900">{definition.shortDefinition}</span>
        <span className="mt-2 block">{definition.details}</span>
        <span className="mt-2 block rounded border border-slate-200 bg-slate-50 p-2"><span className="font-semibold">Example:</span> {definition.example}</span>
      </span>
    </span>
  );
}

export function GlossaryText({ text }: { text: string }) {
  if (!text) return null;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  for (const match of text.matchAll(glossaryPattern)) {
    const [value] = match;
    const index = match.index ?? 0;
    if (index > lastIndex) parts.push(text.slice(lastIndex, index));
    parts.push(<GlossaryPopover key={`${value}-${index}`} term={value}>{value}</GlossaryPopover>);
    lastIndex = index + value.length;
  }

  if (lastIndex < text.length) parts.push(text.slice(lastIndex));
  return <>{parts}</>;
}
