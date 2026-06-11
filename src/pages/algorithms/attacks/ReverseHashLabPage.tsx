import { useMemo, useRef, useState } from "react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { hmacHex, pbkdf2Hex } from "../../../lib/cryptoDemos";
import { md5 } from "../../../lib/hashCores";
import { shaHex } from "../../../lib/simpleDemos";

type DemoAlgorithm = "MD5" | "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512" | "md5(pass.salt)" | "md5(salt.pass)" | "sha256(pass.salt)" | "sha512(pass.salt)" | "HMAC-SHA256" | "PBKDF2-HMAC-SHA256";
type AttackMode = "wordlist" | "bruteforce";

interface ModeInfo {
  mode: string;
  name: string;
  family: string;
  example: string;
  notes: string;
  demoSupported: boolean;
}

const demoAlgorithms: DemoAlgorithm[] = ["MD5", "SHA-1", "SHA-256", "SHA-384", "SHA-512", "md5(pass.salt)", "md5(salt.pass)", "sha256(pass.salt)", "sha512(pass.salt)", "HMAC-SHA256", "PBKDF2-HMAC-SHA256"];

const modes: ModeInfo[] = [
  { mode: "0", name: "MD5", family: "Fast hash", example: "5d41402abc4b2a76b9719d911017c592", notes: "Fast and unsafe for passwords.", demoSupported: true },
  { mode: "100", name: "SHA-1", family: "Fast hash", example: "aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d", notes: "Deprecated for collision resistance and too fast for password storage.", demoSupported: true },
  { mode: "1400", name: "SHA2-256", family: "Fast hash", example: "2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824", notes: "Modern hash, but still fast and unsuitable alone for password storage.", demoSupported: true },
  { mode: "1700", name: "SHA2-512", family: "Fast hash", example: "9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca7...", notes: "Large digest, but password safety still requires salts and slow KDFs.", demoSupported: true },
  { mode: "10", name: "md5($pass.$salt)", family: "Salted fast hash", example: "hash:salt", notes: "Real local demo available. Fast salted hashes are still weak for passwords.", demoSupported: true },
  { mode: "20", name: "md5($salt.$pass)", family: "Salted fast hash", example: "hash:salt", notes: "Real local demo available. Ordering matters.", demoSupported: true },
  { mode: "1410", name: "sha256($pass.$salt)", family: "Salted fast hash", example: "hash:salt", notes: "Real local demo available; still too fast for password storage.", demoSupported: true },
  { mode: "1710", name: "sha512($pass.$salt)", family: "Salted fast hash", example: "hash:salt", notes: "Real local demo available; digest length does not replace slow KDFs.", demoSupported: true },
  { mode: "1450", name: "HMAC-SHA256 (key as salt)", family: "MAC", example: "hash:key", notes: "Real local demo uses the salt/key field as the HMAC key.", demoSupported: true },
  { mode: "10900", name: "PBKDF2-HMAC-SHA256", family: "Password KDF", example: "iterations:salt:hash", notes: "Real local demo available with adjustable iterations.", demoSupported: true },
  { mode: "900", name: "MD4", family: "Legacy hash", example: "866437cb7a794bce2b727acc0362ee27", notes: "Legacy primitive, commonly discussed around old systems.", demoSupported: false },
  { mode: "1000", name: "NTLM", family: "Windows credential hash", example: "8846f7eaee8fb117ad06bdd830b7586c", notes: "Credential-derived hash. Catalog only in this app.", demoSupported: false },
  { mode: "1100", name: "Domain Cached Credentials", family: "Windows credential hash", example: "$DCC2$10240#user#...", notes: "Salted/iterated credential hash. Catalog only.", demoSupported: false },
  { mode: "500", name: "md5crypt", family: "Unix password hash", example: "$1$salt$hash", notes: "Password-hash format with salt and iterations.", demoSupported: false },
  { mode: "7400", name: "sha256crypt", family: "Unix password hash", example: "$5$salt$hash", notes: "Unix-style salted password hash.", demoSupported: false },
  { mode: "1800", name: "sha512crypt", family: "Unix password hash", example: "$6$salt$hash", notes: "Unix-style salted password hash.", demoSupported: false },
  { mode: "3200", name: "bcrypt", family: "Password KDF", example: "$2b$12$...", notes: "Slow password hash designed to resist cracking.", demoSupported: false },
  { mode: "8900", name: "scrypt", family: "Password KDF", example: "SCRYPT:...", notes: "Memory-hard password KDF.", demoSupported: false },
  { mode: "8200", name: "PBKDF2-HMAC-SHA512", family: "Password KDF", example: "sha512:iterations:salt:hash", notes: "Iterated password hashing construction. Catalog only here.", demoSupported: false },
  { mode: "22000", name: "WPA/WPA2", family: "Network credential hash", example: "WPA*02*...", notes: "Network handshake material. Catalog only.", demoSupported: false },
  { mode: "6211", name: "TrueCrypt/VeraCrypt", family: "Encrypted container", example: "container header", notes: "Container key derivation formats. Catalog only.", demoSupported: false },
  { mode: "11600", name: "7-Zip", family: "Archive", example: "$7z$...", notes: "Archive password verification format. Catalog only.", demoSupported: false },
  { mode: "13600", name: "WinZip", family: "Archive", example: "$zip2$...", notes: "Archive password verification format. Catalog only.", demoSupported: false },
  { mode: "10500", name: "PDF", family: "Document", example: "$pdf$...", notes: "Document password verification metadata. Catalog only.", demoSupported: false },
  { mode: "9400", name: "MS Office", family: "Document", example: "$office$...", notes: "Office password verification metadata. Catalog only.", demoSupported: false },
];

const normalize = (value: string) => value.trim().replace(/^0x/i, "").toLowerCase();
const bruteForceSafetyLimit = 250000;
const charsets = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  digits: "0123456789",
  lowercaseDigits: "abcdefghijklmnopqrstuvwxyz0123456789",
  alphaNumeric: "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
};

async function digest(algorithm: DemoAlgorithm, candidate: string, salt: string, iterations: number) {
  if (algorithm === "MD5") return md5(candidate).digest;
  if (algorithm === "md5(pass.salt)") return md5(`${candidate}${salt}`).digest;
  if (algorithm === "md5(salt.pass)") return md5(`${salt}${candidate}`).digest;
  if (algorithm === "sha256(pass.salt)") return shaHex("SHA-256", `${candidate}${salt}`);
  if (algorithm === "sha512(pass.salt)") return shaHex("SHA-512", `${candidate}${salt}`);
  if (algorithm === "HMAC-SHA256") return hmacHex("SHA-256", salt, candidate);
  if (algorithm === "PBKDF2-HMAC-SHA256") return pbkdf2Hex(candidate, salt, Math.max(1, Math.min(100000, iterations)), "SHA-256", 256);
  return shaHex(algorithm, candidate);
}

function estimateCandidates(alphabetSize: number, minLength: number, maxLength: number) {
  let total = 0;
  for (let length = minLength; length <= maxLength; length += 1) total += alphabetSize ** length;
  return total;
}

function candidateAt(index: number, alphabet: string, minLength: number, maxLength: number) {
  let offset = index;
  for (let length = minLength; length <= maxLength; length += 1) {
    const count = alphabet.length ** length;
    if (offset < count) {
      const chars = Array.from({ length }, () => alphabet[0]);
      let value = offset;
      for (let position = length - 1; position >= 0; position -= 1) {
        chars[position] = alphabet[value % alphabet.length];
        value = Math.floor(value / alphabet.length);
      }
      return chars.join("");
    }
    offset -= count;
  }
  return "";
}

export default function ReverseHashLabPage() {
  const [query, setQuery] = useState("");
  const [attackMode, setAttackMode] = useState<AttackMode>("wordlist");
  const [algorithm, setAlgorithm] = useState<DemoAlgorithm>("MD5");
  const [target, setTarget] = useState(md5("hello").digest);
  const [salt, setSalt] = useState("local-demo-salt");
  const [iterations, setIterations] = useState(1000);
  const [wordlist, setWordlist] = useState("password\n123456\nadmin\nhello\nletmein\ncryptography");
  const [charsetKey, setCharsetKey] = useState<keyof typeof charsets>("lowercase");
  const [customCharset, setCustomCharset] = useState("");
  const [minLength, setMinLength] = useState(1);
  const [maxLength, setMaxLength] = useState(4);
  const [status, setStatus] = useState("Ready.");
  const [found, setFound] = useState("");
  const [checked, setChecked] = useState(0);
  const [totalWork, setTotalWork] = useState(0);
  const [running, setRunning] = useState(false);
  const [startedAt, setStartedAt] = useState(0);
  const runId = useRef(0);
  const alphabet = customCharset || charsets[charsetKey];
  const keyspaceEstimate = useMemo(() => estimateCandidates(alphabet.length, minLength, maxLength), [alphabet.length, minLength, maxLength]);
  const progress = totalWork ? Math.min(100, (checked / totalWork) * 100) : 0;
  const elapsedSeconds = running && startedAt ? Math.max(0.1, (Date.now() - startedAt) / 1000) : 0;
  const rate = running && checked ? checked / elapsedSeconds : 0;
  const remainingSeconds = running && rate ? Math.max(0, (totalWork - checked) / rate) : 0;
  const eta = remainingSeconds ? `${Math.floor(remainingSeconds / 60)}m ${Math.round(remainingSeconds % 60)}s` : "estimating";

  const filtered = useMemo(() => {
    const needle = query.trim().toLowerCase();
    return modes.filter((mode) => !needle || [mode.mode, mode.name, mode.family, mode.notes].some((value) => value.toLowerCase().includes(needle)));
  }, [query]);

  const runWordlistDemo = async () => {
    const currentRun = runId.current + 1;
    runId.current = currentRun;
    const words = wordlist.split(/\r?\n/).map((word) => word.trim()).filter(Boolean);
    setFound("");
    setChecked(0);
    setTotalWork(words.length);
    setRunning(true);
    setStartedAt(Date.now());
    setStatus(`Checking ${words.length.toLocaleString()} wordlist candidates...`);
    for (let index = 0; index < words.length; index += 1) {
      if (runId.current !== currentRun) return;
      const value = await digest(algorithm, words[index], salt, iterations);
      setChecked(index + 1);
      if (value === normalize(target)) {
        setFound(words[index]);
        setStatus(`Match found at row ${index + 1}.`);
        setRunning(false);
        return;
      }
      if (index % 100 === 0) await new Promise((resolve) => window.setTimeout(resolve, 0));
    }
    setStatus("No match in the provided wordlist.");
    setRunning(false);
  };

  const runBruteForceDemo = async () => {
    const currentRun = runId.current + 1;
    runId.current = currentRun;
    const safeMin = Math.max(1, Math.min(8, minLength));
    const safeMax = Math.max(safeMin, Math.min(8, maxLength));
    const total = estimateCandidates(alphabet.length, safeMin, safeMax);
    if (!alphabet.length) {
      setStatus("Add at least one character to brute force.");
      return;
    }
    if (total > bruteForceSafetyLimit) {
      setFound("");
      setChecked(0);
      setTotalWork(total);
      setStatus(`Selected keyspace has ${total.toLocaleString()} candidates. Narrow charset or length to run in-browser.`);
      return;
    }
    setFound("");
    setChecked(0);
    setTotalWork(total);
    setRunning(true);
    setStartedAt(Date.now());
    setStatus(`Brute forcing ${total.toLocaleString()} candidates...`);
    for (let index = 0; index < total; index += 1) {
      if (runId.current !== currentRun) return;
      const candidate = candidateAt(index, alphabet, safeMin, safeMax);
      const value = await digest(algorithm, candidate, salt, iterations);
      setChecked(index + 1);
      if (value === normalize(target)) {
        setFound(candidate);
        setStatus(`Brute force match found after ${(index + 1).toLocaleString()} attempts.`);
        setRunning(false);
        return;
      }
      if (index % 250 === 0) await new Promise((resolve) => window.setTimeout(resolve, 0));
    }
    setStatus(`No match in all ${total.toLocaleString()} selected brute force candidates.`);
    setRunning(false);
  };

  const runDemo = () => {
    void (attackMode === "wordlist" ? runWordlistDemo() : runBruteForceDemo());
  };

  const loadSample = async () => {
    setTarget(await digest(algorithm, "hello", salt, iterations));
    setFound("");
    setStatus(`Loaded ${algorithm} sample for "hello".`);
  };

  const stopRun = () => {
    runId.current += 1;
    setRunning(false);
    setStatus("Stopped.");
  };

  return (
    <div className="space-y-6">
      <PageHeader title="Reverse Hash Lab" category="Cryptanalysis and Attacks" status="Educational">
        Browse common hash families and run local recovery demos against simple MD5, SHA, salted, HMAC, and PBKDF2 samples you control. This is a learning aid for local, authorized examples.
      </PageHeader>

      <Card title="Hash recovery">
        <div className="mb-4 flex flex-wrap gap-2">
          <button className={`btn ${attackMode === "wordlist" ? "btn-primary" : ""}`} type="button" onClick={() => setAttackMode("wordlist")}>Wordlist</button>
          <button className={`btn ${attackMode === "bruteforce" ? "btn-primary" : ""}`} type="button" onClick={() => setAttackMode("bruteforce")}>Brute Force</button>
        </div>
        <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
          <div className="grid gap-4">
            <Field label="Demo algorithm">
              <select className="field" value={algorithm} onChange={(event) => setAlgorithm(event.target.value as DemoAlgorithm)}>
                {demoAlgorithms.map((item) => <option key={item} value={item}>{item}</option>)}
              </select>
            </Field>
            <Field label="Target hash">
              <input className="field font-mono" value={target} onChange={(event) => setTarget(event.target.value)} />
            </Field>
            <Field label="Salt or HMAC key">
              <input className="field font-mono" value={salt} onChange={(event) => setSalt(event.target.value)} />
            </Field>
            <Field label="PBKDF2 iterations">
              <input className="field font-mono" type="number" min={1} max={100000} value={iterations} onChange={(event) => setIterations(Number(event.target.value))} />
            </Field>
            <div className="flex flex-wrap gap-2">
              <button className="btn btn-primary" type="button" disabled={running} onClick={runDemo}>Start search</button>
              <button className="btn" type="button" disabled={!running} onClick={stopRun}>Stop</button>
              <button className="btn" type="button" onClick={() => void loadSample()}>Hash hello sample</button>
            </div>
          </div>
          {attackMode === "wordlist" ? (
            <Field label="Wordlist">
              <textarea className="field min-h-48 font-mono" value={wordlist} onChange={(event) => setWordlist(event.target.value)} />
            </Field>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              <Field label="Character set">
                <select className="field" value={charsetKey} onChange={(event) => setCharsetKey(event.target.value as keyof typeof charsets)}>
                  <option value="lowercase">a-z</option>
                  <option value="digits">0-9</option>
                  <option value="lowercaseDigits">a-z, 0-9</option>
                  <option value="alphaNumeric">a-z, A-Z, 0-9</option>
                </select>
              </Field>
              <Field label="Custom charset">
                <input className="field font-mono" value={customCharset} onChange={(event) => setCustomCharset(Array.from(new Set(event.target.value.split(""))).join(""))} />
              </Field>
              <Field label="Min length">
                <input className="field font-mono" type="number" min={1} max={8} value={minLength} onChange={(event) => setMinLength(Number(event.target.value))} />
              </Field>
              <Field label="Max length">
                <input className="field font-mono" type="number" min={1} max={8} value={maxLength} onChange={(event) => setMaxLength(Number(event.target.value))} />
              </Field>
              <div className="panel-muted">
                <div className="text-xs font-semibold uppercase text-slate-500">Estimated keyspace</div>
                <div className="mt-1 text-sm text-slate-700">{keyspaceEstimate.toLocaleString()} candidates. In-browser brute force runs when the selected keyspace is at or below {bruteForceSafetyLimit.toLocaleString()} candidates.</div>
              </div>
            </div>
          )}
        </div>
        <div className="mt-4 rounded-md border border-slate-200 bg-slate-50 p-3">
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2 text-xs font-semibold uppercase text-slate-500">
            <span>Progress</span>
            <span>{checked.toLocaleString()} / {totalWork.toLocaleString()} {running ? `- ETA ${eta}` : ""}</span>
          </div>
          <div className="h-3 overflow-hidden rounded-full bg-slate-200">
            <div className="h-full rounded-full bg-teal-600 transition-all" style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-3">
          <StatusPill tone={found ? "success" : "info"}>{status}</StatusPill>
          <ValueRow label="Checked" value={checked.toString()} copy={false} />
          <ValueRow label="Recovered demo value" value={found || "not found"} />
        </div>
        <div className="mt-4 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
          Wordlist mode checks every pasted word. Brute force mode checks the full selected keyspace when it fits the browser safety limit, and PBKDF2 iterations are limited to 100,000.
        </div>
      </Card>

      <Card title="Hash type catalog">
        <Field label="Search modes">
          <input className="field" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search by mode, name, family, or note" />
        </Field>
        <div className="mt-4 overflow-auto rounded-md border border-slate-200">
          <table className="w-full text-sm">
            <thead className="bg-slate-100"><tr><th className="p-2 text-left">Mode</th><th className="p-2 text-left">Name</th><th className="p-2 text-left">Family</th><th className="p-2 text-left">Example</th><th className="p-2 text-left">Demo</th></tr></thead>
            <tbody>
              {filtered.map((mode) => (
                <tr key={mode.mode} className="border-t border-slate-100">
                  <td className="p-2 font-mono">{mode.mode}</td>
                  <td className="p-2 font-semibold">{mode.name}<div className="mt-1 text-xs font-normal text-slate-500">{mode.notes}</div></td>
                  <td className="p-2">{mode.family}</td>
                  <td className="max-w-xl break-all p-2 font-mono text-xs">{mode.example}</td>
                  <td className="p-2"><StatusPill tone={mode.demoSupported ? "success" : "warning"}>{mode.demoSupported ? "local demo" : "catalog only"}</StatusPill></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card title="Boundary">
        <WarningBadge>This app intentionally does not implement high-speed kernels, GPU cracking, credential capture formats, handshake cracking, or large rule/mask attacks.</WarningBadge>
      </Card>
    </div>
  );
}
