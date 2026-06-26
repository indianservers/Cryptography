# Upgrade Roadmap

## Phase 1 - Accuracy Foundation

Create the status taxonomy, route audit registry, safety boundaries, route smoke list, vector-test foundation, and documentation. Success means the app is honest and auditable even before every algorithm is exact.

Acceptance criteria:

- Every navigation route has an audit entry.
- Status and safety boundaries are visible near the top of pages.
- Generic-shell pages are marked as conceptual unless verified.
- Basic vector tests and data-level route smoke tests exist.
- Build and tests pass.

## Phase 2 - P0 Correctness Fixes

Upgrade or re-scope high-risk standards-heavy pages.

P0 modules include RSA padding, OAEP, PSS, ECDSA nonce reuse, padding oracle, Ethereum signature, Bitcoin hashing, ECC curve explorer, ECDH, Ed25519, X25519, Argon2, bcrypt, HKDF, scrypt, XTS, PKI viewers, wallet key pair, PEM/DER, key format converter, export center, AES key expansion, AES MixColumns, AES modes, DES key schedule, Hill, Playfair, Columnar, Affine, Rail Fence, and Monoalphabetic Substitution.

Acceptance criteria:

- P0 pages either use vetted exact logic with vectors or explicitly narrow their learning goal.
- No P0 page implies standards-compliant output without proof.
- Secret-input warnings are manually checked.

## Phase 3 - Educational Clarity Panels

Improve P1 pages and strong custom pages with formulas, guided walkthroughs, current-step highlighting, common mistakes, and final summaries.

P1 modules include ECB Pattern Leakage, Atbash, ROT13, MD5, SHA-1, DES Workbench, DES Full Step, and Caesar brute-force/demo flows.

Status: implemented as the shared `ModuleLearningSection` plus route-specific learning content for P1, selected Phase 2 P0 exact/hybrid modules, and strong P3 custom pages.

Acceptance criteria:

- Each page explains the key formula or rule in one sentence.
- Intermediate and final outputs are visually separated.
- Deprecated pages explain why they are unsafe.
- Conceptual and hybrid routes show explicit boundaries.
- Learning content has regression tests for coverage, quiz validity, and unsafe overclaims.

## Phase 4 - UI/UX Archetypes

Standardize page archetypes for hash, cipher, mode, KDF, MAC, PKI, attack, encoding, and math pages.

P2 modules include BLAKE2, BLAKE3, Keccak, RIPEMD-160, CMAC, GMAC, Poly1305, Merkle Tree, Camellia, IDEA, RC6, Serpent, Twofish, and Salsa20.

Status: implemented as typed module archetypes, shared layout/output/input/mobile components, responsive data formatting utilities, and archetype coverage tests.

Acceptance criteria:

- Mobile controls remain reachable.
- Output panels use consistent final/intermediate formatting.
- Accessibility labels and keyboard flows are checked.
- P2 routes have explicit archetype coverage.
- Secret-risk and conceptual/deferred routes preserve warning and boundary preferences.
- Long values use mobile-safe wrapping or panel-level scrolling.

## Phase 5 - Visual Educational Animations

Add focused animations where motion explains the algorithm: shifting letters, AES rounds, RC5 rotation, Diffie-Hellman exchange, curve operations, hash compression, and random byte distribution.

P3 modules include good custom pages such as Diffie-Hellman, RSA overview/encryption/decryption/key generation/signature, Caesar, Vigenere, Base64, Binary, Hex, HMAC, PBKDF2, SHA-2, SHA-3, math modules, AES workbench, AES step visualizers, DES S-box, random bytes, test vectors, benchmark, and entropy analyzer.

Acceptance criteria:

- Animations have replay controls.
- Current step is highlighted without relying only on color.
- Reduced-motion users still get the same information.

## Phase 6 - Guided Mode and Final QA

Add guided mode, challenge mode, quizzes, export/share polish, full route smoke checks, official vector expansion, and manual browser QA.

Acceptance criteria:

- All exact claims are backed by tests or Web Crypto.
- All routes render in desktop and mobile viewports.
- Known limitations are documented per module.
