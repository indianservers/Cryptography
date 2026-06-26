export function ConceptualBoundaryNote({ note }: { note: string }) {
  return (
    <section className="rounded-md border border-red-200 bg-red-50 p-4 text-sm text-red-950">
      <div className="text-xs font-bold uppercase tracking-wide text-red-800">Conceptual boundary</div>
      <p className="mt-2">{note}</p>
    </section>
  );
}
