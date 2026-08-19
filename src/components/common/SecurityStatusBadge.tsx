import type { SecurityStatus } from "../../types";

export type SecurityStatusLike =
  | SecurityStatus
  | "Recommended"
  | "Acceptable for specific use"
  | "Broken"
  | "Educational only";

interface SecurityStatusExplanation {
  label: string;
  shortLabel: string;
  description: string;
  useWhen: string;
  avoidWhen: string;
  learnerAction: string;
}

const styles: Record<SecurityStatusLike, string> = {
  Modern: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Recommended: "border-emerald-200 bg-emerald-50 text-emerald-700",
  "Acceptable for specific use": "border-teal-200 bg-teal-50 text-teal-700",
  Legacy: "border-amber-200 bg-amber-50 text-amber-700",
  Deprecated: "border-rose-200 bg-rose-50 text-rose-700",
  Educational: "border-sky-200 bg-sky-50 text-sky-700",
  "Educational only": "border-sky-200 bg-sky-50 text-sky-700",
  Unsafe: "border-red-200 bg-red-50 text-red-700",
  Broken: "border-red-200 bg-red-50 text-red-700",
};

const explanations: Record<SecurityStatusLike, SecurityStatusExplanation> = {
  Modern: {
    label: "Recommended",
    shortLabel: "Recommended",
    description: "A modern choice when used through vetted APIs with correct parameters.",
    useWhen: "Use for new designs when it fits the protocol and platform requirements.",
    avoidWhen: "Avoid handwritten implementations, hardcoded keys, nonce reuse, and unauthenticated use where integrity matters.",
    learnerAction: "Check the required key size, nonce or IV rule, authentication tag handling, and official implementation support.",
  },
  Recommended: {
    label: "Recommended",
    shortLabel: "Recommended",
    description: "A preferred modern option for the right cryptographic job.",
    useWhen: "Use when the algorithm matches the requirement and a vetted implementation is available.",
    avoidWhen: "Avoid changing parameters casually or using it outside its intended purpose.",
    learnerAction: "Confirm the exact construction, parameters, and misuse warnings before copying the pattern.",
  },
  "Acceptable for specific use": {
    label: "Acceptable for specific use",
    shortLabel: "Contextual",
    description: "A valid choice only in certain standards, protocols, compatibility cases, or constrained environments.",
    useWhen: "Use when a policy, interoperability need, or well-reviewed protocol specifically calls for it.",
    avoidWhen: "Avoid making it the default for new systems without a clear reason.",
    learnerAction: "Read the page's current recommendation and compare against newer alternatives.",
  },
  Legacy: {
    label: "Legacy",
    shortLabel: "Legacy",
    description: "Historically important and still seen in older systems, but usually not the best new choice.",
    useWhen: "Use mainly for reading old systems, migration planning, or compatibility work.",
    avoidWhen: "Avoid selecting it for fresh designs when modern alternatives are available.",
    learnerAction: "Identify the modern replacement and the migration risk.",
  },
  Deprecated: {
    label: "Deprecated",
    shortLabel: "Deprecated",
    description: "No longer recommended for most security-sensitive uses.",
    useWhen: "Use only for study, controlled compatibility, or migration from old systems.",
    avoidWhen: "Avoid protecting new sensitive data, signatures, passwords, or network sessions with it.",
    learnerAction: "Treat the demo as a warning and look for the recommended alternative.",
  },
  Educational: {
    label: "Educational only",
    shortLabel: "Educational",
    description: "Included to teach the idea, math, or visual structure rather than provide production security.",
    useWhen: "Use for classroom examples, local toy data, and conceptual understanding.",
    avoidWhen: "Avoid treating demo output as secure, standards-compliant, or ready for real secrets.",
    learnerAction: "Focus on what the example teaches and where the safe boundary is.",
  },
  "Educational only": {
    label: "Educational only",
    shortLabel: "Educational",
    description: "Included for learning only, often with simplified math or toy data.",
    useWhen: "Use in safe local demonstrations and beginner walkthroughs.",
    avoidWhen: "Avoid using it for real confidentiality, authentication, passwords, or key management.",
    learnerAction: "Keep inputs fictional and note which modern construction replaces it.",
  },
  Unsafe: {
    label: "Broken / unsafe",
    shortLabel: "Unsafe",
    description: "Unsafe for real protection, often because attacks are practical or misuse is too easy.",
    useWhen: "Use only to understand weaknesses and defensive migration needs.",
    avoidWhen: "Avoid new deployments, real secrets, and security claims based on this primitive.",
    learnerAction: "Find the attack shown on the page and the safer replacement.",
  },
  Broken: {
    label: "Broken",
    shortLabel: "Broken",
    description: "Known weaknesses make this unsuitable for real security goals.",
    useWhen: "Use only for historical study, safe attack demonstrations, or explaining why recommendations changed.",
    avoidWhen: "Avoid using it to protect data, verify integrity, or authenticate users.",
    learnerAction: "Look for the page's replacement recommendation before choosing an algorithm.",
  },
};

export function getSecurityStatusExplanation(status: SecurityStatusLike) {
  return explanations[status];
}

export const securityStatusLegendItems = [
  "Recommended",
  "Acceptable for specific use",
  "Legacy",
  "Deprecated",
  "Broken",
  "Educational only",
] as const;

export function SecurityStatusBadge({ status, compact = false }: { status: SecurityStatusLike; compact?: boolean }) {
  const explanation = getSecurityStatusExplanation(status);
  const label = compact ? explanation.shortLabel : explanation.label;
  const popoverId = `security-status-${explanation.label.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`;

  return (
    <span className="group/status relative inline-flex shrink-0 align-middle">
      <span
        role="button"
        tabIndex={0}
        aria-describedby={popoverId}
        title={`${explanation.label}: ${explanation.description}`}
        className={`cursor-help rounded-full border font-semibold ${styles[status]} ${compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"} focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-teal-400 focus-visible:ring-offset-2`}
      >
        {label}
      </span>
      <span
        id={popoverId}
        role="tooltip"
        className="pointer-events-none absolute left-0 top-full z-50 mt-2 hidden w-[min(22rem,calc(100vw-2rem))] rounded-md border border-slate-300 bg-white p-3 text-left text-xs font-normal leading-relaxed text-slate-700 shadow-xl group-hover/status:block group-focus-within/status:block"
      >
        <span className="block text-sm font-bold text-slate-950">{explanation.label}</span>
        <span className="mt-1 block">{explanation.description}</span>
        <span className="mt-2 block"><span className="font-semibold text-emerald-800">Use when:</span> {explanation.useWhen}</span>
        <span className="mt-1 block"><span className="font-semibold text-red-800">Avoid when:</span> {explanation.avoidWhen}</span>
        <span className="mt-2 block rounded border border-blue-200 bg-blue-50 p-2 text-blue-950"><span className="font-semibold">Learner check:</span> {explanation.learnerAction}</span>
      </span>
    </span>
  );
}
