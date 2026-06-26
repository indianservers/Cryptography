# Phase 3 Educational Clarity Audit

## Scope

Audited and upgraded the educational surface for priority modules listed in the Phase 3 prompt. This audit focuses on learner clarity, not new cryptographic exactness.

## Coverage

- P1 routes covered:
  - ECB Pattern Leakage
  - Atbash
  - ROT13
  - MD5
  - SHA-1
  - DES Workbench
  - DES Full Step
  - Caesar Brute Force
- Selected P0 exact/hybrid routes covered:
  - Affine, Columnar, Rail Fence, Substitution, Playfair, Hill
  - AES MixColumns, AES Key Expansion, HKDF
  - Bitcoin Hashing, PEM/DER, RSA Padding, OAEP, PSS
  - ECDSA Nonce Reuse, Padding Oracle Concept
- Strong P3 routes covered:
  - Diffie-Hellman and RSA family pages
  - Vigenere
  - Base64, Binary, Hex
  - HMAC, PBKDF2, SHA-2, SHA-3
  - Modular Arithmetic, Euclidean Algorithm, Finite Fields, GF(2^8), CRT, Discrete Logarithm, Elliptic Curve Points

## Checks Added

- Every required route has a learning entry.
- Every learning entry has objective, formula/rule, variables, constraints, observation prompts, expected patterns, misconceptions, real-world use, and checkpoint questions.
- Exact Phase 2 P0 routes selected for Phase 3 have formulas and misconception cards.
- Conceptual or hybrid P0 routes selected for Phase 3 include boundaries.
- Checkpoint answer indexes are valid.
- Conceptual/hybrid learning copy avoids unsafe overclaims.

## Risk Notes

- The shared panels explain concepts but do not replace page-specific animations or visualizer internals.
- Phase 3 intentionally avoids claiming new standards compliance.
- Current-step highlighting inside algorithm-specific visualizers remains future work where it requires local state changes.
