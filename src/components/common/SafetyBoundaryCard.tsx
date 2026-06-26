import { AlertTriangle, ShieldAlert } from "lucide-react";

export interface SafetyBoundaryCardProps {
  educationalOnly?: boolean;
  deprecatedUnsafe?: boolean;
  attackConcept?: boolean;
  secretInputRisk?: boolean;
  productionNotAllowed?: boolean;
  vectorVerificationPending?: boolean;
  genericShell?: boolean;
  className?: string;
}

export function SafetyBoundaryCard({
  educationalOnly,
  deprecatedUnsafe,
  attackConcept,
  secretInputRisk,
  productionNotAllowed,
  vectorVerificationPending,
  genericShell,
  className = "",
}: SafetyBoundaryCardProps) {
  const items = [
    educationalOnly && "Educational boundary: this page is for learning and inspection.",
    genericShell && "This page is currently a conceptual educational preview unless marked exact by vector tests.",
    genericShell && "Outputs may illustrate structure and should not be treated as standards-compliant cryptographic results.",
    deprecatedUnsafe && "Deprecated or unsafe primitive: do not use this to protect real data.",
    attackConcept && "Attack concept for authorized learning only. Do not target systems or data you do not own.",
    secretInputRisk && "Do not paste real private keys, wallet secrets, passwords, tokens, certificates, or production secrets.",
    productionNotAllowed && "Do not use this browser demo as production security code.",
    vectorVerificationPending && "Official vector verification is still required before this page can claim exactness.",
  ].filter(Boolean) as string[];

  if (!items.length) return null;

  const urgent = deprecatedUnsafe || attackConcept || secretInputRisk;

  return (
    <section className={`rounded-md border p-3 text-sm shadow-sm ${urgent ? "border-amber-300 bg-amber-50 text-amber-950" : "border-blue-200 bg-blue-50 text-blue-950"} ${className}`}>
      <div className="mb-2 flex items-center gap-2 font-bold">
        {urgent ? <ShieldAlert className="h-4 w-4" /> : <AlertTriangle className="h-4 w-4" />}
        Trust and safety boundary
      </div>
      <ul className="grid gap-1.5">
        {items.map((item) => <li key={item}>{item}</li>)}
      </ul>
    </section>
  );
}
