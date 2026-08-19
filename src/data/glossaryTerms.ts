import { extendedGlossaryTermCount, extendedGlossaryTerms } from "./extendedGlossaryTerms";

export interface GlossaryTermDefinition {
  term: string;
  aliases: string[];
  shortDefinition: string;
  details: string;
  example: string;
}

const coreGlossaryTerms: GlossaryTermDefinition[] = [
  {
    term: "nonce",
    aliases: ["nonces"],
    shortDefinition: "A value used once with a key.",
    details: "A nonce is not usually secret, but it must be unique in the place where the algorithm requires uniqueness. In stream ciphers, CTR, and GCM-style authenticated encryption, repeating a nonce with the same key can reveal relationships between messages or even allow forgeries.",
    example: "AES-GCM commonly uses a unique 96-bit nonce for each encryption under the same key.",
  },
  {
    term: "IV",
    aliases: ["initialization vector", "IVs"],
    shortDefinition: "A starting value for a block cipher mode.",
    details: "An IV helps ensure that encrypting similar plaintext does not always begin the same way. Different modes have different IV rules: CBC needs an unpredictable IV, while CTR-like modes need unique counter inputs. An IV is not the same as a key and is often stored with the ciphertext.",
    example: "CBC encryption uses an IV for the first block before chaining later blocks.",
  },
  {
    term: "MAC",
    aliases: ["message authentication code", "message authentication codes"],
    shortDefinition: "A secret-key tag for integrity and authenticity.",
    details: "A MAC lets someone with the shared secret verify that a message has not changed and came from a party that knows the key. It does not hide the message. HMAC, CMAC, GMAC, and Poly1305 are examples with different underlying designs.",
    example: "A webhook can include an HMAC so the receiver can reject tampered requests.",
  },
  {
    term: "AEAD",
    aliases: ["authenticated encryption", "authenticated encryption with associated data"],
    shortDefinition: "Encryption that also authenticates data.",
    details: "AEAD constructions provide confidentiality for plaintext and integrity/authentication for ciphertext plus optional associated data. The associated data is not encrypted, but it is protected against tampering. AEAD is usually preferred over combining encryption and a separate MAC by hand.",
    example: "AES-GCM and ChaCha20-Poly1305 are common AEAD choices.",
  },
  {
    term: "salt",
    aliases: ["salts"],
    shortDefinition: "A public random value mixed into password hashing or derivation.",
    details: "A salt makes identical passwords produce different stored verifiers and prevents one precomputed table from working for every user. A salt does not need to be secret, but it should be unique and generated with a secure random source.",
    example: "PBKDF2 stores the salt and iteration count alongside the derived password verifier.",
  },
  {
    term: "tag",
    aliases: ["authentication tag", "tags"],
    shortDefinition: "A verification value produced by a MAC or AEAD mode.",
    details: "A tag is checked before accepting data as authentic. If the tag verification fails, the message should be rejected without releasing decrypted plaintext. Shorter tags are easier to guess, so protocols specify acceptable tag lengths.",
    example: "AES-GCM outputs ciphertext plus an authentication tag.",
  },
  {
    term: "preimage",
    aliases: ["preimages", "preimage resistance"],
    shortDefinition: "An original input that hashes to a given digest.",
    details: "For a secure hash, finding a preimage for a chosen digest should be infeasible. This is why hashes are called one-way. Preimage resistance is different from collision resistance, where the attacker looks for any two inputs with the same digest.",
    example: "Given a SHA-256 digest, you should not be able to work backward to the original message.",
  },
  {
    term: "certificate",
    aliases: ["certificates", "digital certificate", "digital certificates", "X.509 certificate", "X.509 certificates"],
    shortDefinition: "A signed statement binding an identity to a public key.",
    details: "A certificate is useful only when its signature chain, name, validity time, policies, and revocation status are checked by the relying application. Parsing a certificate's fields is not the same as trusting it.",
    example: "HTTPS uses certificates so a browser can authenticate the server's public key.",
  },
];

export const originalGlossaryTermCount = coreGlossaryTerms.length;
export const addedGlossaryTermCount = extendedGlossaryTermCount;
export const glossaryTerms: GlossaryTermDefinition[] = [...coreGlossaryTerms, ...extendedGlossaryTerms];

export const glossaryTermByName = Object.fromEntries(
  glossaryTerms.flatMap((definition) => [definition.term, ...definition.aliases].map((name) => [name.toLowerCase(), definition])),
);

export function getGlossaryDefinition(term: string) {
  return glossaryTermByName[term.toLowerCase()];
}

export function glossaryWordCount() {
  return glossaryTerms
    .map((definition) => `${definition.shortDefinition} ${definition.details} ${definition.example}`)
    .join(" ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;
}
