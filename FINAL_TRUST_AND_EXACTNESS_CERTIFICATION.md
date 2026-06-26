# Final Trust And Exactness Certification

## Exact Educational Modules Backed By Tests

- Affine Cipher
- Columnar Transposition
- Rail Fence Cipher
- Monoalphabetic Substitution
- Playfair Cipher
- Hill 2x2 Cipher
- AES MixColumns
- AES-128 Key Expansion
- HKDF-SHA256 helper

## Web Crypto-Backed Modules

Selected browser-native hash, HMAC, PBKDF2, AES, and random-byte pages use Web Crypto where available and remain marked by registry status.

## Conceptual-Only Modules

Conceptual modules explain structure and safety boundaries without claiming standards-compliant output. Examples include PKI trust-chain pages, certificate/CSR viewers, padding oracle concepts, and export/key-format tools.

## Hybrid Toy-Exact Modules

Hybrid modules may have exact helper coverage for a narrow core while the full standard remains conceptual. Examples include Bitcoin double SHA-256 helper coverage, PEM block extraction, RSA padding structures, ECDSA nonce reuse toy arithmetic, AES modes overview, DES key schedule, and ECC toy pages.

## Deferred Modules Needing Vetted Libraries

Argon2, bcrypt, scrypt, Ed25519, X25519, XTS, Ethereum signatures, and wallet derivation/address pages remain deferred until vetted library support and official vectors exist.

## Deprecated Or Unsafe Modules

MD5, SHA-1, DES, RC4, ECB, and classical ciphers are retained for study, migration awareness, or exam learning. They must not be marketed as secure choices.

## Secret-Risk Modules

KDFs, HMAC, RSA key generation/decryption/signature, ECC key/signature pages, PKI/key conversion/export pages, wallet pages, and private-key adjacent pages require secret-input warnings and conservative copy/export behavior.

## Attack-Concept Modules

Attack pages are bounded local defensive lessons. They must not target external systems or provide operational misuse workflows.

## Known Limitations

- Browser render smoke is scaffolded, not full Playwright pixel QA.
- Exactness claims are intentionally narrow.
- Production-grade PKI, wallet, password-hashing, and signature stacks require vetted dependencies.

## Must Not Be Claimed

- Production wallet.
- Real certificate validator.
- Production Argon2/bcrypt/scrypt without a vetted library.
- Real Ethereum signature stack without a vetted library.
- Production encryption tool.
- Official compliance suite.
