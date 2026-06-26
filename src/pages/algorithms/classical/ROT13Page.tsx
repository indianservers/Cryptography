import { useMemo, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { caesar } from "../../../lib/classical";

const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function ROT13Page() {
  const [text, setText] = useState("Hello, World!");
  const encoded = useMemo(() => caesar(text, 13), [text]);
  const roundTrip = useMemo(() => caesar(encoded, 13), [encoded]);

  // ROT13 pairs A-M with N-Z
  const pairs = alphabet.slice(0, 13).split("").map((letter, index) => ({
    from: letter,
    to: alphabet[index + 13],
  }));

  return (
    <div className="space-y-6">
      <PageHeader title="ROT13" category="Classical Cryptography" status="Unsafe">
        A Caesar cipher fixed at shift 13. Applying ROT13 twice returns the original text because 13+13=26. It is its own inverse.
      </PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Input">
          <Field label="Text">
            <textarea
              className="field min-h-28"
              value={text}
              onChange={(e) => setText(e.target.value)}
            />
          </Field>
          <div className="mt-3 flex gap-2">
            <button className="btn" onClick={() => setText("Hello, World!")}>Sample</button>
            <button className="btn" onClick={() => setText("")}>Clear</button>
          </div>
        </Card>
        <Card title="Output">
          <div className="space-y-3">
            <ValueRow label="ROT13 encoded" value={encoded} />
            <ValueRow label="Re-apply ROT13 (round-trip)" value={roundTrip} />
          </div>
        </Card>
      </div>
      <Card title="Paired alphabet (A-M <-> N-Z)">
        <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-13">
          {pairs.map(({ from, to }) => (
            <div key={from} className="rounded-md border border-slate-200 bg-slate-50 p-2 text-center font-mono text-sm">
              {from} {"<->"} {to}
            </div>
          ))}
        </div>
      </Card>
      <Card title="ROT13 beside Caesar shift 13">
        <div className="grid gap-3 md:grid-cols-3">
          <ValueRow label="Original text" value={text} />
          <ValueRow label="Caesar +13" value={caesar(text, 13)} />
          <ValueRow label="ROT13 again" value={roundTrip} />
        </div>
        <div className="mt-4 rounded-md border border-teal-200 bg-teal-50 p-3 text-sm text-teal-900">
          ROT13 is not a different algorithm from Caesar here: it is Caesar with a fixed shift of 13. Because the alphabet has 26 letters, applying the same shift twice lands back at the start.
        </div>
      </Card>
      <WarningBadge>ROT13 provides zero secrecy: any reader can decode it instantly. Use it only to obscure spoilers or trivia, never to protect data.</WarningBadge>
    </div>
  );
}
