import { useCallback, useEffect, useMemo, useState } from "react";
import { KeyRound, RotateCcw, ShieldCheck, Signature } from "lucide-react";
import { PageHeader } from "../../../components/common/PageHeader";
import { Card, Field, StatusPill, ValueRow } from "../../../components/common/Field";
import { WarningBadge } from "../../../components/common/WarningBadge";
import { ExportReportButton } from "../../../components/common/ExportReportButton";

type SignatureMode = "ECDSA-P256" | "RSA-PSS-2048";

interface SelfSignedEnvelope {
  version: string;
  subject: string;
  issuer: string;
  serial: string;
  validFrom: string;
  validTo: string;
  algorithm: SignatureMode;
  publicKeyJwk: JsonWebKey;
  signature: string;
}

const encoder = new TextEncoder();

const modeLabels: Record<SignatureMode, string> = {
  "ECDSA-P256": "ECDSA P-256 / SHA-256",
  "RSA-PSS-2048": "RSA-PSS 2048 / SHA-256",
};

const bytesToBase64Url = (buffer: ArrayBuffer) => {
  const bytes = new Uint8Array(buffer);
  let binary = "";
  bytes.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
};

const randomHex = (byteLength: number) => {
  const bytes = crypto.getRandomValues(new Uint8Array(byteLength));
  return Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
};

const canonicalJson = (value: unknown): string => {
  if (value === null || typeof value !== "object") return JSON.stringify(value);
  if (Array.isArray(value)) return `[${value.map(canonicalJson).join(",")}]`;
  const record = value as Record<string, unknown>;
  return `{${Object.keys(record).sort().map((key) => `${JSON.stringify(key)}:${canonicalJson(record[key])}`).join(",")}}`;
};

const generateKeyPair = (mode: SignatureMode) => {
  if (mode === "ECDSA-P256") {
    return crypto.subtle.generateKey({ name: "ECDSA", namedCurve: "P-256" }, true, ["sign", "verify"]) as Promise<CryptoKeyPair>;
  }
  return crypto.subtle.generateKey({
    name: "RSA-PSS",
    modulusLength: 2048,
    publicExponent: new Uint8Array([1, 0, 1]),
    hash: "SHA-256",
  }, true, ["sign", "verify"]) as Promise<CryptoKeyPair>;
};

const signBytes = (mode: SignatureMode, privateKey: CryptoKey, bytes: BufferSource) => crypto.subtle.sign(
  mode === "ECDSA-P256" ? { name: "ECDSA", hash: "SHA-256" } : { name: "RSA-PSS", saltLength: 32 },
  privateKey,
  bytes,
);

const verifyBytes = (mode: SignatureMode, publicKey: CryptoKey, signature: string, bytes: BufferSource) => {
  const padded = signature.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(signature.length / 4) * 4, "=");
  const raw = Uint8Array.from(atob(padded), (char) => char.charCodeAt(0));
  const signatureBytes = raw.buffer.slice(raw.byteOffset, raw.byteOffset + raw.byteLength);
  return crypto.subtle.verify(
    mode === "ECDSA-P256" ? { name: "ECDSA", hash: "SHA-256" } : { name: "RSA-PSS", saltLength: 32 },
    publicKey,
    signatureBytes,
    bytes,
  );
};

const importPublicKey = (mode: SignatureMode, publicKeyJwk: JsonWebKey) => crypto.subtle.importKey(
  "jwk",
  publicKeyJwk,
  mode === "ECDSA-P256" ? { name: "ECDSA", namedCurve: "P-256" } : { name: "RSA-PSS", hash: "SHA-256" },
  true,
  ["verify"],
);

const envelopePayload = (envelope: Omit<SelfSignedEnvelope, "signature">) => canonicalJson(envelope);

export default function DigitalSignatureWorkbenchPage() {
  const [mode, setMode] = useState<SignatureMode>("ECDSA-P256");
  const [subject, setSubject] = useState("CN=Local Demo Signer, O=Mega Cryptography Suite");
  const [validDays, setValidDays] = useState("365");
  const [message, setMessage] = useState("Approve release build 2026.06.11");
  const [tamperedMessage, setTamperedMessage] = useState("Approve release build 2026.06.12");
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [publicKeyJwk, setPublicKeyJwk] = useState<JsonWebKey | null>(null);
  const [envelope, setEnvelope] = useState<SelfSignedEnvelope | null>(null);
  const [messageSignature, setMessageSignature] = useState("");
  const [messageValid, setMessageValid] = useState<boolean | null>(null);
  const [tamperedValid, setTamperedValid] = useState<boolean | null>(null);
  const [envelopeValid, setEnvelopeValid] = useState<boolean | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const validity = useMemo(() => {
    const days = Math.max(1, Number.parseInt(validDays, 10) || 1);
    const start = new Date();
    const end = new Date(start.getTime() + days * 24 * 60 * 60 * 1000);
    return { start: start.toISOString(), end: end.toISOString(), days };
  }, [validDays]);

  const createIdentity = useCallback(async () => {
    setBusy(true);
    setError("");
    try {
      const pair = await generateKeyPair(mode);
      const jwk = await crypto.subtle.exportKey("jwk", pair.publicKey);
      const unsigned = {
        version: "self-signed-demo-v1",
        subject,
        issuer: subject,
        serial: randomHex(12),
        validFrom: validity.start,
        validTo: validity.end,
        algorithm: mode,
        publicKeyJwk: jwk,
      };
      const certSignature = await signBytes(mode, pair.privateKey, encoder.encode(envelopePayload(unsigned)));
      setKeyPair(pair);
      setPublicKeyJwk(jwk);
      setEnvelope({ ...unsigned, signature: bytesToBase64Url(certSignature) });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to create a signing identity.");
    } finally {
      setBusy(false);
    }
  }, [mode, subject, validity.end, validity.start]);

  const signMessage = useCallback(async () => {
    if (!keyPair) return;
    setBusy(true);
    setError("");
    try {
      const signature = await signBytes(mode, keyPair.privateKey, encoder.encode(message));
      setMessageSignature(bytesToBase64Url(signature));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Unable to sign the message.");
    } finally {
      setBusy(false);
    }
  }, [keyPair, message, mode]);

  useEffect(() => {
    void createIdentity();
  }, [createIdentity]);

  useEffect(() => {
    if (!keyPair) return;
    void signMessage();
  }, [keyPair, signMessage]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!keyPair || !messageSignature) {
        setMessageValid(null);
        setTamperedValid(null);
        return;
      }
      const [validOriginal, validTampered] = await Promise.all([
        verifyBytes(mode, keyPair.publicKey, messageSignature, encoder.encode(message)),
        verifyBytes(mode, keyPair.publicKey, messageSignature, encoder.encode(tamperedMessage)),
      ]);
      if (active) {
        setMessageValid(validOriginal);
        setTamperedValid(validTampered);
      }
    };
    void run().catch((caught) => {
      if (active) setError(caught instanceof Error ? caught.message : "Unable to verify the signature.");
    });
    return () => { active = false; };
  }, [keyPair, message, messageSignature, mode, tamperedMessage]);

  useEffect(() => {
    let active = true;
    const run = async () => {
      if (!envelope) {
        setEnvelopeValid(null);
        return;
      }
      const { signature, ...unsigned } = envelope;
      const publicKey = await importPublicKey(envelope.algorithm, envelope.publicKeyJwk);
      const valid = await verifyBytes(envelope.algorithm, publicKey, signature, encoder.encode(envelopePayload(unsigned)));
      if (active) setEnvelopeValid(valid);
    };
    void run().catch((caught) => {
      if (active) setError(caught instanceof Error ? caught.message : "Unable to verify the self-signed envelope.");
    });
    return () => { active = false; };
  }, [envelope]);

  const envelopePreview = envelope ? JSON.stringify(envelope, null, 2) : "";
  const report = { mode, subject, validDays: validity.days, publicKeyJwk, envelope, message, tamperedMessage, messageSignature, messageValid, tamperedValid, envelopeValid };

  return (
    <div className="space-y-6">
      <PageHeader title="Digital Signature Workbench" category="Certificates and PKI" status="Modern">
        Generate a browser-local signing key, create a self-signed identity envelope, sign a message, and verify that changing the message breaks the signature.
      </PageHeader>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <Card title="Signing identity" action={<button type="button" className="btn btn-primary" onClick={createIdentity} disabled={busy}><KeyRound className="h-4 w-4" /> Generate</button>}>
          <div className="grid gap-4">
            <Field label="Signature algorithm">
              <select className="field" value={mode} onChange={(event) => setMode(event.target.value as SignatureMode)}>
                <option value="ECDSA-P256">ECDSA P-256 / SHA-256</option>
                <option value="RSA-PSS-2048">RSA-PSS 2048 / SHA-256</option>
              </select>
            </Field>
            <Field label="Self-signed subject">
              <input className="field" value={subject} onChange={(event) => setSubject(event.target.value)} />
            </Field>
            <Field label="Validity days">
              <input className="field font-mono" inputMode="numeric" value={validDays} onChange={(event) => setValidDays(event.target.value)} />
            </Field>
            <div className="grid gap-3 md:grid-cols-2">
              <ValueRow label="Issuer" value={envelope?.issuer ?? "Generate an identity"} />
              <ValueRow label="Serial" value={envelope?.serial ?? "n/a"} />
              <ValueRow label="Valid from" value={envelope?.validFrom ?? "n/a"} />
              <ValueRow label="Valid to" value={envelope?.validTo ?? "n/a"} />
            </div>
          </div>
        </Card>

        <Card title="Self-signed envelope">
          <div className="mb-3 flex flex-wrap gap-2">
            <StatusPill tone={envelopeValid ? "success" : "warning"}>{envelopeValid ? "Envelope signature valid" : "Waiting for valid envelope"}</StatusPill>
            <StatusPill>{modeLabels[mode]}</StatusPill>
          </div>
          <textarea className="field min-h-80 font-mono text-xs" value={envelopePreview} readOnly />
        </Card>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_1fr]">
        <Card title="Message to sign" action={<button type="button" className="btn btn-primary" onClick={signMessage} disabled={busy || !keyPair}><Signature className="h-4 w-4" /> Sign</button>}>
          <div className="grid gap-4">
            <Field label="Original message" value={message}>
              <textarea className="field min-h-28" value={message} onChange={(event) => setMessage(event.target.value)} />
            </Field>
            <Field label="Tampered comparison" value={tamperedMessage}>
              <textarea className="field min-h-28" value={tamperedMessage} onChange={(event) => setTamperedMessage(event.target.value)} />
            </Field>
          </div>
        </Card>

        <Card title="Verify result">
          <div className="grid gap-3">
            <div className="flex flex-wrap gap-2">
              <StatusPill tone={messageValid ? "success" : "error"}>{messageValid ? "Original verifies" : "Original does not verify"}</StatusPill>
              <StatusPill tone={tamperedValid === false ? "success" : "warning"}>{tamperedValid === false ? "Tamper rejected" : "Tamper not rejected"}</StatusPill>
            </div>
            <ValueRow label="Signature" value={messageSignature || "Sign a message to produce a signature"} />
            <ValueRow label="Public key thumbprint material" value={publicKeyJwk ? canonicalJson(publicKeyJwk) : "Generate an identity"} />
          </div>
        </Card>
      </div>

      <Card title="Verification flow" action={<button type="button" className="btn" onClick={signMessage} disabled={busy || !keyPair}><RotateCcw className="h-4 w-4" /> Refresh signature</button>}>
        <div className="grid gap-3 md:grid-cols-3">
          <div className="panel-muted">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900"><KeyRound className="h-4 w-4" /> Key pair</div>
            <p className="text-sm text-slate-600">The private key signs locally in the browser. The public key is embedded in the self-signed envelope.</p>
          </div>
          <div className="panel-muted">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900"><Signature className="h-4 w-4" /> Signature</div>
            <p className="text-sm text-slate-600">The message bytes are signed with SHA-256 based ECDSA or RSA-PSS parameters.</p>
          </div>
          <div className="panel-muted">
            <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-900"><ShieldCheck className="h-4 w-4" /> Verify</div>
            <p className="text-sm text-slate-600">Verification succeeds only for the same bytes and the matching public key.</p>
          </div>
        </div>
      </Card>

      {error && <WarningBadge>{error}</WarningBadge>}
      <WarningBadge>This self-signed envelope is an educational local object, not a standards-compliant X.509 certificate. A real certificate also needs CA policy, names, extensions, revocation handling, and trust-store validation.</WarningBadge>
      <ExportReportButton title="Digital signature workbench" data={report} />
    </div>
  );
}
