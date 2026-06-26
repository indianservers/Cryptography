# Phase 02 P0 Correctness Report

## Files Changed

- `src/data/moduleAuditRegistry.ts`
- `src/pages/algorithms/classical/AffineCipherPage.tsx`
- `src/pages/algorithms/classical/ColumnarTranspositionPage.tsx`
- `src/pages/algorithms/classical/HillCipherPage.tsx`
- `src/pages/algorithms/classical/PlayfairCipherPage.tsx`
- `src/pages/algorithms/classical/RailFenceCipherPage.tsx`
- `src/pages/algorithms/classical/SubstitutionCipherPage.tsx`
- P0 copy updates in KDF, ECC, blockchain, RSA padding, PKI, encoding, export, attack, AES modes, XTS, and DES key schedule pages
- `tests/algorithm-vectors.test.ts`
- `tests/route-smoke.spec.ts`

## New Files Added

- `src/lib/classicalExact.ts`
- `src/lib/phase2CryptoExact.ts`
- `src/components/common/ClassicalCipherWorkbench.tsx`
- `PHASE_02_P0_CORRECTNESS_REPORT.md`
- `PHASE_02_P0_CORRECTNESS_AUDIT.md`

## P0 Modules Reviewed

All 32 Phase 1 P0 routes now have an explicit `phase2Decision`.

## P0 Decision Table

| Route | Title | Decision | Status Before | Status After | Tests Added | Remaining Limitation |
|---|---|---|---|---|---|---|
| `/algorithms/classical/affine-cipher` | Affine Cipher | exact-educational | Needs expert review | Exact educational / basic tests | Affine known-answer, invalid `a`, round-trip | A-Z classroom cipher only |
| `/algorithms/classical/columnar-transposition` | Columnar Transposition | exact-educational | Needs expert review | Exact educational / basic tests | Stable duplicate-key order, round-trip grid | Normalized A-Z with documented padding |
| `/algorithms/classical/rail-fence` | Rail Fence Cipher | exact-educational | Needs expert review | Exact educational / basic tests | Standard 3-rail sample, invalid rail count, round-trip | Standard zig-zag convention only |
| `/algorithms/classical/substitution-cipher` | Monoalphabetic Substitution | exact-educational | Needs expert review | Exact educational / basic tests | Mapping validation, duplicate rejection, round-trip | Simple 26-letter alphabet only |
| `/algorithms/classical/playfair-cipher` | Playfair Cipher | exact-educational | Needs expert review | Exact educational / basic tests | Known sample, repeated-letter filler, odd length | I/J merge and X filler convention |
| `/algorithms/classical/hill-cipher` | Hill Cipher | exact-educational | Needs expert review | Exact educational / basic tests | 2x2 sample, invalid determinant | 2x2 encryption only |
| `/algorithms/symmetric/aes-mix-columns` | AES MixColumns | exact-educational | Needs expert review | Exact educational / official vector | FIPS MixColumns column sample | Column arithmetic only |
| `/algorithms/symmetric/aes-key-expansion` | AES Key Expansion | exact-educational | Needs expert review | Exact educational / official vector | AES-128 round-key vector | AES-192/256 need expanded vectors |
| `/algorithms/kdf/hkdf` | HKDF | exact-educational | Needs expert review | Exact educational / official vector | RFC 5869 HKDF-SHA256 case 1 | Helper is tested; page remains educational |
| `/algorithms/blockchain/bitcoin-hashing` | Bitcoin Hashing | hybrid-exact-core | Needs expert review | Exact double-SHA helper / conceptual block UI | Double SHA-256 helper | Full block serialization/mining not claimed |
| `/algorithms/encoding/pem-der` | PEM/DER Viewer | hybrid-exact-core | Not P0 registry item, prompt requested | Basic extraction tested / conceptual DER | PEM block extraction | Strict ASN.1/X.509 not implemented |
| `/algorithms/asymmetric/rsa-padding` | RSA Padding | hybrid-exact-core | Needs expert review | Conceptual preview / vector required | Smoke decision checks | OAEP/PSS exact encoding pending |
| `/algorithms/padding/oaep` | RSA-OAEP | hybrid-exact-core | Needs expert review | Conceptual preview / vector required | Smoke decision checks | MGF1/label/length vectors pending |
| `/algorithms/padding/pss` | RSA-PSS | hybrid-exact-core | Needs expert review | Conceptual preview / vector required | Smoke decision checks | PSS salt/MGF/trailer vectors pending |
| `/algorithms/attacks/ecdsa-nonce-reuse` | ECDSA Nonce Reuse Demo | hybrid-exact-core | Needs expert review | Conceptual toy / manual QA | Smoke defensive-boundary checks | Toy arithmetic only |
| `/algorithms/ecc/curve-explorer` | ECC Curve Explorer | hybrid-exact-core | Needs expert review | Conceptual toy / manual QA | Smoke decision checks | Small finite-field toy only |
| `/algorithms/ecc/ecdh` | ECDH | hybrid-exact-core | Needs expert review | Conceptual toy / manual QA | Secret-warning smoke check | Not P-256 or X25519 |
| `/algorithms/symmetric/aes-modes` | AES Modes | hybrid-exact-core | Needs expert review | Conceptual mode overview | Smoke decision checks | Exact encryption only on separate Web Crypto pages |
| `/algorithms/symmetric/des-key-schedule` | DES Key Schedule | hybrid-exact-core | Needs expert review | Conceptual / vector required | Smoke decision checks | Exact subkey vectors pending |
| `/algorithms/attacks/padding-oracle-concept` | Padding Oracle Concept | conceptual-only | Needs expert review | Conceptual preview / manual QA | Smoke defensive-boundary checks | No exploit workflow |
| `/algorithms/pki/x509-certificate-viewer` | X.509 Certificate Viewer | conceptual-only | Needs expert review | Conceptual preview / vector required | Secret-warning smoke check | No trust/hostname/revocation validation |
| `/algorithms/pki/certificate-chain` | Certificate Chain Visualizer | conceptual-only | Needs expert review | Conceptual preview / manual QA | Secret-warning smoke check | No chain validation |
| `/algorithms/pki/csr-viewer` | CSR Viewer | conceptual-only | Needs expert review | Conceptual preview / vector required | Secret-warning smoke check | No formal CSR parser |
| `/algorithms/tools/key-format-converter` | Key Format Converter | conceptual-only | Needs expert review | Conceptual preview / manual QA | Secret-warning smoke check | Not a safe private-key converter |
| `/algorithms/tools/export-center` | Export Center | conceptual-only | Needs expert review | Conceptual preview / manual QA | Secret-warning smoke check | Redaction workflow still future work |
| `/algorithms/ecc/ed25519` | Ed25519 | deferred-needs-library | Needs expert review | Conceptual preview / vector required | Secret-warning smoke check | Needs vetted library/Web Crypto and vectors |
| `/algorithms/ecc/x25519` | X25519 | deferred-needs-library | Needs expert review | Conceptual preview / vector required | Secret-warning smoke check | Needs vetted library/Web Crypto and vectors |
| `/algorithms/kdf/argon2` | Argon2 | deferred-needs-library | Needs expert review | Conceptual preview / vector required | Secret-warning smoke check | Needs vetted WASM/library |
| `/algorithms/kdf/bcrypt` | bcrypt | deferred-needs-library | Needs expert review | Conceptual preview / vector required | Secret-warning smoke check | Needs vetted implementation |
| `/algorithms/kdf/scrypt` | Scrypt | deferred-needs-library | Needs expert review | Conceptual preview / vector required | Secret-warning smoke check | Needs vetted implementation |
| `/algorithms/modes/xts` | XTS Mode | deferred-needs-library | Needs expert review | Conceptual preview / vector required | Secret-warning smoke check | Needs tested AES-XTS |
| `/algorithms/blockchain/ethereum-signature` | Ethereum Signature | deferred-needs-library | Needs expert review | Conceptual preview / vector required | Secret-warning smoke check | Needs secp256k1 + Keccak + recovery stack |
| `/algorithms/blockchain/wallet-key-pair` | Wallet Key Pair | deferred-needs-library | Needs expert review | Conceptual preview / vector required | Secret-warning smoke check | Needs vetted wallet derivation/address libraries |

## Exact Educational Modules Completed

Affine, Columnar Transposition, Rail Fence, Monoalphabetic Substitution, Playfair, Hill 2x2, AES MixColumns, AES-128 Key Expansion vector coverage, and HKDF-SHA256 RFC 5869 helper coverage.

## Conceptual-Only Modules Intentionally Retained

Padding Oracle Concept, X.509 Viewer, Certificate Chain Visualizer, CSR Viewer, Key Format Converter, and Export Center.

## Hybrid Toy-Exact Modules

RSA Padding, RSA-OAEP, RSA-PSS, ECDSA Nonce Reuse, Bitcoin Hashing, ECC Curve Explorer, ECDH, AES Modes, DES Key Schedule, and PEM/DER Viewer.

## Deferred Modules Needing Vetted Libraries

Argon2, bcrypt, scrypt, Ed25519, X25519, XTS, Ethereum Signature, and Wallet Key Pair.

## Test Results

- `npm run typecheck`: passed
- `npm run test:vectors`: passed, 21 tests
- `npm run test:smoke`: passed, 7 tests
- `npm test`: passed, 28 tests

## Build Result

- `npm run build`: passed

## Known Limitations

- Browser-render smoke testing is still not automated.
- `algorithmMetadata.ts` still contains older descriptive metadata in places; visible page copy and registry are now the source of trust status.
- Some standards-heavy pages remain conceptual by design until vetted libraries or official vectors are added.
- Dependency audit findings from Phase 1 remain unmodified.

## Recommendation for Phase 3

Begin educational clarity work only after keeping these Phase 2 trust boundaries intact. Start with P1/P0 conceptual pages that need better formula panels, “what is not exact” explanations, and step-by-step learner guidance.
