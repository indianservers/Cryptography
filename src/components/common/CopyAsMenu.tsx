const utf8 = new TextEncoder();
const toHex = (value: string) => Array.from(utf8.encode(value), (byte) => byte.toString(16).padStart(2, "0")).join("");
const toBinary = (value: string) => Array.from(utf8.encode(value), (byte) => byte.toString(2).padStart(8, "0")).join(" ");
const toBase64 = (value: string) => btoa(String.fromCharCode(...utf8.encode(value)));

export function CopyAsMenu({ value, json }: { value: string; json?: unknown }) {
  const copy = (next: string) => navigator.clipboard?.writeText(next);
  return (
    <div className="flex flex-wrap gap-2">
      <button className="btn" onClick={() => copy(value)}>Copy text</button>
      <button className="btn" onClick={() => copy(toHex(value))}>Copy hex</button>
      <button className="btn" onClick={() => copy(toBase64(value))}>Copy base64</button>
      <button className="btn" onClick={() => copy(toBinary(value))}>Copy binary</button>
      <button className="btn" onClick={() => copy(JSON.stringify(json ?? { value }, null, 2))}>Copy JSON</button>
    </div>
  );
}
