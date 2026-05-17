import type { ValidationIssue } from "../../lib/cryptoValidation";

export function ErrorSummary({ issues }: { issues: ValidationIssue[] }) {
  if (!issues.length) return null;
  return (
    <div className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-800">
      <div className="font-semibold">Validation summary</div>
      <ul className="mt-2 space-y-1">
        {issues.map((issue, index) => <li key={`${issue.field}-${index}`}><span className="font-semibold">{issue.field}:</span> {issue.message}</li>)}
      </ul>
    </div>
  );
}
