# Phase 02 P0 Correctness Audit

## P0 Registry Completeness

Status: pass.

Every P0 route in `moduleAuditRegistry` has a non-default `phase2Decision`, a required fix, notes, priority, verification status, and browser-support status.

## P0 Status Honesty

Status: pass.

P0 routes are now one of:

- `exact-educational`
- `hybrid-exact-core`
- `conceptual-only`
- `deferred-needs-library`

No deferred or conceptual-only P0 route is marked as an exact implementation.

## Exact Claims Backed By Tests

Status: pass.

Exact P0 claims are backed by tests for:

- Affine Cipher
- Columnar Transposition
- Rail Fence Cipher
- Monoalphabetic Substitution
- Playfair Cipher
- Hill 2x2 Cipher
- AES MixColumns
- AES-128 Key Expansion
- HKDF-SHA256

Additional tested helper coverage:

- PEM block extraction
- Double SHA-256 over controlled bytes

## Conceptual Pages Visibly Labelled

Status: pass.

P0 conceptual/deferred pages now use copy such as conceptual preview, toy arithmetic, structure visualizer, verification pending, and not a production implementation. `SafetyBoundaryCard` also appears near the top through `PageHeader`.

## Secret-Risk Warnings

Status: pass.

Smoke tests verify secret-risk P0 entries trigger `shouldShowSecretInputWarning`. This includes wallet, private-key, signature, KDF/password, PKI, PEM/DER, key-conversion, export, RSA, ECDH, Ed25519, X25519, and Ethereum-related routes.

## Deprecated / Unsafe Warnings

Status: pass.

Classical ciphers remain unsafe/educational even when their classroom algorithms are exact. DES Key Schedule remains deprecated and vector-required.

## Attack-Demo Defensive Framing

Status: pass.

ECDSA Nonce Reuse and Padding Oracle Concept are bounded to toy/defensive explanations. Copy now explicitly says authorized learning, no exploit workflow, deterministic/high-quality ECDSA nonces, authenticated encryption, and uniform error handling.

## Standards-Heavy Modules Not Faked

Status: pass.

Argon2, bcrypt, scrypt, Ed25519, X25519, XTS, Ethereum Signature, Wallet Key Pair, PKI validation, CSR validation, RSA-OAEP, and RSA-PSS remain conceptual/deferred or vector-required. No production output is claimed for them.

## Vector Coverage Summary

New Phase 2 vector/helper tests cover:

- 10 Phase 2 exact/helper checks in addition to the 11 Phase 1 checks
- 21 vector/helper tests total
- 7 route/audit smoke tests
- 28 total Vitest tests

## Unresolved Risks

- Full browser-render smoke testing is still future work.
- AES-192/AES-256 key expansion should receive separate official vectors before broader exact claims.
- DES Key Schedule needs exact subkey vectors before promotion.
- ECC toy arithmetic pages need targeted math tests before any stronger status.
- PKI and wallet pages need vetted libraries before exact output.
- Metadata copy can be further normalized in Phase 3, though visible page copy and registry are now honest.

## Can Phase 3 Begin?

Yes. Phase 2 makes the P0 layer trustworthy: exact where tests exist, conceptual where standards coverage is incomplete, and deferred where vetted libraries are required.
