import { useMemo, useState } from "react";
import { PageHeader } from "../../../../components/common/PageHeader";
import { Card, Field, ValueRow } from "../../../../components/common/Field";
import { WarningBadge } from "../../../../components/common/WarningBadge";
import { CopyButton } from "../../../../components/common/CopyButton";
import { DownloadButton } from "../../../../components/common/DownloadButton";
import { ExportReportButton } from "../../../../components/common/ExportReportButton";
import { gcd, modInv } from "../../../../lib/cryptoDemos";

const bytesToBase64 = (bytes: ArrayBuffer) => {
  const view = new Uint8Array(bytes);
  let binary = "";
  view.forEach((byte) => { binary += String.fromCharCode(byte); });
  return btoa(binary);
};

const wrapPem = (label: string, bytes: ArrayBuffer) => {
  const base64 = bytesToBase64(bytes);
  const lines = base64.match(/.{1,64}/g)?.join("\n") ?? base64;
  return `-----BEGIN ${label}-----\n${lines}\n-----END ${label}-----`;
};

export default function RSAKeyGenerationPage() {
  const [modulusLength, setModulusLength] = useState(2048);
  const [hash, setHash] = useState("SHA-256");
  const [usage, setUsage] = useState<"RSA-OAEP" | "RSASSA-PKCS1-v1_5" | "RSA-PSS">("RSA-OAEP");
  const [publicPem, setPublicPem] = useState("");
  const [privatePem, setPrivatePem] = useState("");
  const [publicJwk, setPublicJwk] = useState("");
  const [privateJwk, setPrivateJwk] = useState("");
  const [message, setMessage] = useState("Ready to generate an RSA key pair.");
  const [p, setP] = useState("61");
  const [q, setQ] = useState("53");
  const [e, setE] = useState("17");
  const values = useMemo(() => {
    const primeP = BigInt(p || "0");
    const primeQ = BigInt(q || "0");
    const exponent = BigInt(e || "0");
    const n = primeP * primeQ;
    const phi = (primeP - 1n) * (primeQ - 1n);
    const g = gcd(exponent, phi);
    const d = g === 1n ? modInv(exponent, phi) : null;
    return { primeP, primeQ, exponent, n, phi, g, d };
  }, [e, p, q]);
  const keyUsages: KeyUsage[] = usage === "RSA-OAEP" ? ["encrypt", "decrypt"] : ["sign", "verify"];
  const keySummary = publicJwk ? JSON.parse(publicJwk) as JsonWebKey : null;
  const generateRealKeyPair = async () => {
    setMessage("Generating RSA key pair locally...");
    setPublicPem("");
    setPrivatePem("");
    setPublicJwk("");
    setPrivateJwk("");
    try {
      const pair = await crypto.subtle.generateKey({
        name: usage,
        modulusLength,
        publicExponent: new Uint8Array([1, 0, 1]),
        hash,
      }, true, keyUsages) as CryptoKeyPair;
      const [spki, pkcs8, pubJwk, privJwk] = await Promise.all([
        crypto.subtle.exportKey("spki", pair.publicKey),
        crypto.subtle.exportKey("pkcs8", pair.privateKey),
        crypto.subtle.exportKey("jwk", pair.publicKey),
        crypto.subtle.exportKey("jwk", pair.privateKey),
      ]);
      const nextPublicPem = wrapPem("PUBLIC KEY", spki);
      const nextPrivatePem = wrapPem("PRIVATE KEY", pkcs8);
      setPublicPem(nextPublicPem);
      setPrivatePem(nextPrivatePem);
      setPublicJwk(JSON.stringify(pubJwk, null, 2));
      setPrivateJwk(JSON.stringify(privJwk, null, 2));
      setMessage(`Generated ${modulusLength}-bit ${usage} key pair with ${hash}.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "RSA key generation failed.");
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title="RSA Key Generator" category="Public Key Cryptography" status="Modern">Generate real browser-local RSA public and private keys, then export PEM or JWK formats.</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <Card title="Real RSA key settings" eyebrow="Web Crypto">
          <div className="grid gap-4">
            <div className="grid gap-3 md:grid-cols-3">
              <Field label="Key purpose"><select className="field" value={usage} onChange={(event) => setUsage(event.target.value as typeof usage)}><option value="RSA-OAEP">RSA-OAEP encryption</option><option value="RSA-PSS">RSA-PSS signatures</option><option value="RSASSA-PKCS1-v1_5">RSASSA-PKCS1-v1_5 signatures</option></select></Field>
              <Field label="Modulus length"><select className="field" value={modulusLength} onChange={(event) => setModulusLength(Number(event.target.value))}><option value={2048}>2048 bits</option><option value={3072}>3072 bits</option><option value={4096}>4096 bits</option></select></Field>
              <Field label="Hash"><select className="field" value={hash} onChange={(event) => setHash(event.target.value)}><option>SHA-256</option><option>SHA-384</option><option>SHA-512</option></select></Field>
            </div>
            <button className="btn btn-primary" onClick={generateRealKeyPair}>Generate public/private keys</button>
            <div className="rounded-md border border-teal-200 bg-teal-50 p-3 text-sm font-semibold text-teal-800">{message}</div>
          </div>
        </Card>
        <Card title="Generated key summary">
          <div className="grid gap-3 md:grid-cols-2">
            <ValueRow label="Algorithm" value={keySummary?.alg ?? "not generated yet"} />
            <ValueRow label="Key type" value={keySummary?.kty ?? "not generated yet"} />
            <ValueRow label="Public exponent" value={keySummary?.e ?? "not generated yet"} />
            <ValueRow label="Modulus length" value={keySummary?.n ? `${Math.ceil((keySummary.n.length * 6) / 8) * 8} bits approx` : "not generated yet"} />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Public key PEM">
          <pre className="max-h-96 overflow-auto rounded-md bg-slate-950 p-4 font-mono text-xs text-lime-100">{publicPem || "Generate a key pair to show the public key."}</pre>
          <div className="mt-3 flex flex-wrap gap-2"><CopyButton value={publicPem} label="Copy public PEM" /><DownloadButton filename="rsa-public-key.pem" value={publicPem} /></div>
        </Card>
        <Card title="Private key PEM">
          <pre className="max-h-96 overflow-auto rounded-md bg-slate-950 p-4 font-mono text-xs text-lime-100">{privatePem || "Generate a key pair to show the private key."}</pre>
          <div className="mt-3 flex flex-wrap gap-2"><CopyButton value={privatePem} label="Copy private PEM" /><DownloadButton filename="rsa-private-key.pem" value={privatePem} /></div>
        </Card>
      </div>
      <Card title="JWK export">
        <div className="grid gap-6 xl:grid-cols-2">
          <div><h3 className="mb-2 font-semibold">Public JWK</h3><pre className="max-h-80 overflow-auto rounded-md bg-slate-950 p-4 font-mono text-xs text-lime-100">{publicJwk || "{}"}</pre></div>
          <div><h3 className="mb-2 font-semibold">Private JWK</h3><pre className="max-h-80 overflow-auto rounded-md bg-slate-950 p-4 font-mono text-xs text-lime-100">{privateJwk || "{}"}</pre></div>
        </div>
        <div className="mt-4"><ExportReportButton title="RSA key pair" data={{ usage, modulusLength, hash, publicPem, privatePem, publicJwk: publicJwk ? JSON.parse(publicJwk) : null, privateJwk: privateJwk ? JSON.parse(privateJwk) : null }} /></div>
      </Card>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <Card title="Educational toy prime inputs" eyebrow="Small-number math" defaultOpen={false}>
          <div className="grid gap-3 md:grid-cols-3">
            <Field label="p"><input className="field font-mono" value={p} onChange={(event) => setP(event.target.value)} /></Field>
            <Field label="q"><input className="field font-mono" value={q} onChange={(event) => setQ(event.target.value)} /></Field>
            <Field label="e"><input className="field font-mono" value={e} onChange={(event) => setE(event.target.value)} /></Field>
          </div>
        </Card>
        <Card title="Computed toy key material" defaultOpen={false}>
          <div className="space-y-3">
            <ValueRow label="n = p * q" value={values.n.toString()} />
            <ValueRow label="phi(n) = (p - 1)(q - 1)" value={values.phi.toString()} />
            <ValueRow label="gcd(e, phi)" value={values.g.toString()} />
            <ValueRow label="d = e^-1 mod phi" value={values.d?.toString() ?? "No inverse: choose e coprime to phi"} />
          </div>
        </Card>
      </div>
      <div className="grid gap-6 xl:grid-cols-2">
        <Card title="Toy public key" defaultOpen={false}><ValueRow label="(n, e)" value={`(${values.n}, ${values.exponent})`} /></Card>
        <Card title="Toy private key" defaultOpen={false}><ValueRow label="(n, d)" value={values.d ? `(${values.n}, ${values.d})` : "invalid until gcd(e, phi) = 1"} /></Card>
      </div>
      <WarningBadge>Private keys are sensitive. This tool generates keys locally in your browser; do not share private PEM or private JWK values.</WarningBadge>
    </div>
  );
}
