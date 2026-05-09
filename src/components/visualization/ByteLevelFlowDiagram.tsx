const utf8 = new TextEncoder();

const toHexBytes = (value: string, limit = 16) => {
  const bytes = Array.from(utf8.encode(value || " "));
  return bytes.slice(0, limit).map((byte) => byte.toString(16).padStart(2, "0"));
};

const deriveBytes = (seed: string, label: string, limit = 16) => {
  const source = toHexBytes(`${label}:${seed}`, Math.max(limit, 4));
  return Array.from({ length: limit }, (_, index) => {
    const byte = parseInt(source[index % source.length] ?? "00", 16);
    return ((byte ^ ((index + 1) * 37)) & 255).toString(16).padStart(2, "0");
  });
};

function ByteStrip({ bytes, active }: { bytes: string[]; active: number }) {
  return (
    <div className="flex flex-wrap gap-1 font-mono text-[11px]">
      {bytes.map((byte, index) => (
        <span key={`${byte}-${index}`} className={`rounded px-1.5 py-1 ${index === active ? "bg-cyan-600 text-white changed-byte" : "bg-slate-100 text-slate-700"}`}>
          {byte}
        </span>
      ))}
    </div>
  );
}

export function ByteLevelFlowDiagram({
  input,
  output,
  operation,
  activeStep = 0,
}: {
  input: string;
  output: string;
  operation: string;
  activeStep?: number;
}) {
  const stages = [
    { label: "Plaintext / input", bytes: toHexBytes(input) },
    { label: "Encode to bytes", bytes: deriveBytes(input, "encode") },
    { label: operation, bytes: deriveBytes(`${input}:${output}`, operation) },
    { label: "Ciphertext / hash / signature", bytes: toHexBytes(output) },
  ];
  const active = activeStep % stages.length;

  return (
    <div className="rounded-md border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <h3 className="text-sm font-bold uppercase tracking-wide text-slate-600">Byte-level flow diagram</h3>
        <span className="rounded-full border border-cyan-200 bg-cyan-50 px-2 py-1 text-xs font-semibold text-cyan-800">Step {active + 1} / {stages.length}</span>
      </div>
      <div className="grid gap-3 xl:grid-cols-4">
        {stages.map((stage, index) => (
          <div key={stage.label} className={`rounded-md border p-3 ${index === active ? "border-cyan-300 bg-cyan-50" : "border-slate-200 bg-slate-50"}`}>
            <div className="mb-2 text-xs font-semibold uppercase text-slate-500">{stage.label}</div>
            <ByteStrip bytes={stage.bytes} active={activeStep % Math.max(stage.bytes.length, 1)} />
          </div>
        ))}
      </div>
      <p className="mt-3 text-xs text-slate-500">Bytes are shown as hex. Long values are previewed so the diagram stays readable on mobile screens.</p>
    </div>
  );
}
