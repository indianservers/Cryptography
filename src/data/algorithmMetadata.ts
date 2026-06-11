import type { AlgorithmMetadata } from "../types";

export const algorithmMetadata: AlgorithmMetadata[] = [
  {
    "page": "PrimeNumbersPage",
    "route": "/algorithms/math/primes",
    "label": "Prime Numbers",
    "category": "Applied Mathematics",
    "icon": "Calculator",
    "securityStatus": "Educational",
    "intro": "Explore primality, factorization, Euler's phi function, and prime lists used throughout public-key cryptography.",
    "inputs": [
      "Integer n",
      "Prime list limit"
    ],
    "outputs": [
      "Primality result",
      "Factorization",
      "Euler phi(n)",
      "Sieve primes"
    ],
    "visualizers": [
      "Trial division witness",
      "Sieve of Eratosthenes",
      "Crypto usage notes"
    ],
    "notes": [
      "Real cryptographic primes are much larger than trial-division examples."
    ]
  },
  {
    "page": "ModularMathPage",
    "route": "/algorithms/math/modular-arithmetic",
    "label": "Modular Mathematics",
    "category": "Applied Mathematics",
    "icon": "Calculator",
    "securityStatus": "Educational",
    "intro": "Practice reduction, modular addition, multiplication, inverses, and fast exponentiation.",
    "inputs": [
      "a",
      "b",
      "modulus m",
      "exponent e"
    ],
    "outputs": [
      "Reduced values",
      "Modular sum",
      "Modular product",
      "Inverse",
      "Power"
    ],
    "visualizers": [
      "Clock arithmetic",
      "Square-and-multiply trace",
      "Inverse check"
    ],
    "notes": [
      "Modulo arithmetic is the basic language of RSA, Diffie-Hellman, DSA, ECC, and affine ciphers."
    ]
  },
  {
    "page": "EuclideanAlgorithmPage",
    "route": "/algorithms/math/euclidean-algorithm",
    "label": "Euclidean Algorithm",
    "category": "Applied Mathematics",
    "icon": "Calculator",
    "securityStatus": "Educational",
    "intro": "Compute gcd values, Bezout coefficients, and modular inverses with the extended Euclidean algorithm.",
    "inputs": [
      "a",
      "b / modulus"
    ],
    "outputs": [
      "gcd(a, b)",
      "Bezout identity",
      "Modular inverse"
    ],
    "visualizers": [
      "Euclidean division table",
      "Extended coefficient table",
      "Coprime status"
    ],
    "notes": [
      "The extended Euclidean algorithm is used to derive RSA private exponents and many modular inverses."
    ]
  },
  {
    "page": "FiniteFieldsPage",
    "route": "/algorithms/math/finite-fields",
    "label": "Finite Fields GF(p)",
    "category": "Applied Mathematics",
    "icon": "Grid3X3",
    "securityStatus": "Educational",
    "intro": "Perform arithmetic in prime fields where nonzero elements have inverses.",
    "inputs": [
      "prime p",
      "a",
      "b",
      "exponent e"
    ],
    "outputs": [
      "Field addition",
      "Field multiplication",
      "Field inverse",
      "Field division",
      "Field power"
    ],
    "visualizers": [
      "Addition table",
      "Multiplication table",
      "Prime-field status"
    ],
    "notes": [
      "Prime fields underpin many Diffie-Hellman, DSA, Schnorr, and elliptic curve constructions."
    ]
  },
  {
    "page": "ChineseRemainderPage",
    "route": "/algorithms/math/chinese-remainder",
    "label": "Chinese Remainder Theorem",
    "category": "Applied Mathematics",
    "icon": "Calculator",
    "securityStatus": "Educational",
    "intro": "Combine congruences into one solution modulo the product of coprime moduli.",
    "inputs": ["Congruence rows"],
    "outputs": ["CRT solution", "Combined modulus", "Construction terms"],
    "visualizers": ["CRT construction table", "Pairwise coprime status", "Term sum"],
    "notes": ["CRT is used to accelerate RSA private-key operations."]
  },
  {
    "page": "DiscreteLogPage",
    "route": "/algorithms/math/discrete-logarithm",
    "label": "Discrete Logarithm",
    "category": "Applied Mathematics",
    "icon": "Calculator",
    "securityStatus": "Educational",
    "intro": "Brute force tiny discrete logs to see why real groups must be large.",
    "inputs": ["Base g", "Target h", "Modulus p"],
    "outputs": ["Exponent x", "Power table"],
    "visualizers": ["Brute force trace", "Match row", "Hardness note"],
    "notes": ["Diffie-Hellman and DSA rely on discrete logs being infeasible at real sizes."]
  },
  {
    "page": "PrimitiveRootsPage",
    "route": "/algorithms/math/primitive-roots",
    "label": "Primitive Roots and Generators",
    "category": "Applied Mathematics",
    "icon": "Calculator",
    "securityStatus": "Educational",
    "intro": "Inspect multiplicative orders and find generators modulo n.",
    "inputs": ["Modulus n"],
    "outputs": ["Orders", "Primitive roots"],
    "visualizers": ["Order table", "Generator highlighter", "Phi comparison"],
    "notes": ["Generators define cyclic groups used in finite-field protocols."]
  },
  {
    "page": "GF256ArithmeticPage",
    "route": "/algorithms/math/gf256",
    "label": "GF(2^8) Arithmetic",
    "category": "Applied Mathematics",
    "icon": "Grid3X3",
    "securityStatus": "Educational",
    "intro": "Multiply bytes in the AES finite field with polynomial reduction.",
    "inputs": ["Byte a", "Byte b", "Polynomial"],
    "outputs": ["XOR result", "Field product", "Reduction trace"],
    "visualizers": ["Shift/XOR trace", "AES polynomial", "Byte result"],
    "notes": ["GF(2^8) arithmetic appears in AES MixColumns and S-box construction."]
  },
  {
    "page": "EllipticCurvePointMathPage",
    "route": "/algorithms/math/elliptic-curve-points",
    "label": "Elliptic Curve Point Arithmetic",
    "category": "Applied Mathematics",
    "icon": "Fingerprint",
    "securityStatus": "Educational",
    "intro": "Add, double, and scalar-multiply points on a small elliptic curve.",
    "inputs": ["Curve parameters", "Point P", "Point Q", "Scalar k"],
    "outputs": ["P + Q", "2P", "kP"],
    "visualizers": ["Slope calculation", "Double-and-add trace", "On-curve checks"],
    "notes": ["ECC public keys and signatures are built from scalar multiplication."]
  },
  {
    "page": "CaesarCipherPage",
    "route": "/algorithms/classical/caesar-cipher",
    "label": "Caesar Cipher",
    "category": "Classical Cryptography",
    "securityStatus": "Educational",
    "intro": "Rotate each alphabet letter by a fixed shift and inspect the mapping that makes the cipher easy to break.",
    "inputs": [
      "Plaintext",
      "Shift 0-25",
      "Alphabet"
    ],
    "outputs": [
      "Ciphertext",
      "All brute force shifts",
      "Frequency chart"
    ],
    "visualizers": [
      "Alphabet mapping table",
      "Character shift ledger",
      "Brute force ladder"
    ],
    "notes": [
      "Modulo arithmetic makes Caesar simple, while frequency analysis makes it fragile."
    ]
  },
  {
    "page": "ROT13Page",
    "route": "/algorithms/classical/rot13",
    "label": "ROT13",
    "category": "Classical Cryptography",
    "securityStatus": "Unsafe",
    "intro": "A fixed Caesar shift of 13 for lightweight text obfuscation, not security.",
    "inputs": [
      "Input text",
      "Preserve punctuation"
    ],
    "outputs": [
      "ROT13 output",
      "Round-trip check"
    ],
    "visualizers": [
      "A-to-N paired alphabet",
      "Self-inverse transform"
    ],
    "notes": [
      "Applying ROT13 twice returns the original text."
    ]
  },
  {
    "page": "AtbashCipherPage",
    "route": "/algorithms/classical/atbash",
    "label": "Atbash Cipher",
    "category": "Classical Cryptography",
    "securityStatus": "Unsafe",
    "intro": "Mirror the alphabet so A maps to Z, B maps to Y, and every substitution is fixed.",
    "inputs": [
      "Plaintext",
      "Alphabet variant"
    ],
    "outputs": [
      "Mirrored ciphertext",
      "Mapping table"
    ],
    "visualizers": [
      "Alphabet reflection strip",
      "Letter substitution trace"
    ],
    "notes": [
      "The mapping has no secret key, so secrecy depends only on obscurity."
    ]
  },
  {
    "page": "AffineCipherPage",
    "route": "/algorithms/classical/affine-cipher",
    "label": "Affine Cipher",
    "category": "Classical Cryptography",
    "securityStatus": "Educational",
    "intro": "Transform letters with E(x) = ax + b mod 26 and require a to be invertible.",
    "inputs": [
      "Plaintext",
      "Multiplier a",
      "Offset b"
    ],
    "outputs": [
      "Ciphertext",
      "Inverse key",
      "GCD validation"
    ],
    "visualizers": [
      "Modulo line",
      "Inverse calculation",
      "Per-letter formula table"
    ],
    "notes": [
      "Only multipliers coprime with 26 can decrypt every letter."
    ]
  },
  {
    "page": "VigenereCipherPage",
    "route": "/algorithms/classical/vigenere-cipher",
    "label": "Vigenere Cipher",
    "category": "Classical Cryptography",
    "securityStatus": "Educational",
    "intro": "Use a repeated keyword to apply a different Caesar shift to each character.",
    "inputs": [
      "Plaintext",
      "Keyword",
      "Alphabet"
    ],
    "outputs": [
      "Ciphertext",
      "Repeated key",
      "Character table"
    ],
    "visualizers": [
      "Repeated key grid",
      "Tabula recta sample",
      "Per-character transformation"
    ],
    "notes": [
      "Repeating keys leave periodic patterns that Kasiski-style analysis can exploit."
    ]
  },
  {
    "page": "PlayfairCipherPage",
    "route": "/algorithms/classical/playfair-cipher",
    "label": "Playfair Cipher",
    "category": "Classical Cryptography",
    "securityStatus": "Educational",
    "intro": "Encrypt digraphs using a 5x5 keyword square and row, column, or rectangle rules.",
    "inputs": [
      "Keyword",
      "Plaintext digraphs",
      "I/J merge"
    ],
    "outputs": [
      "Cipher digraphs",
      "Prepared pairs"
    ],
    "visualizers": [
      "5x5 matrix",
      "Digraph preparation",
      "Rule table"
    ],
    "notes": [
      "Inserted filler letters alter the message shape and must be handled consistently."
    ]
  },
  {
    "page": "HillCipherPage",
    "route": "/algorithms/classical/hill-cipher",
    "label": "Hill Cipher",
    "category": "Classical Cryptography",
    "securityStatus": "Educational",
    "intro": "Multiply letter vectors by an invertible key matrix modulo 26.",
    "inputs": [
      "Matrix size",
      "Key matrix",
      "Plaintext blocks"
    ],
    "outputs": [
      "Cipher vectors",
      "Determinant",
      "Inverse validation"
    ],
    "visualizers": [
      "Matrix multiplication board",
      "Determinant modulo 26",
      "Block vector trace"
    ],
    "notes": [
      "A non-invertible matrix loses information and cannot be used for decryption."
    ]
  },
  {
    "page": "RailFenceCipherPage",
    "route": "/algorithms/classical/rail-fence",
    "label": "Rail Fence Cipher",
    "category": "Classical Cryptography",
    "securityStatus": "Educational",
    "intro": "Write characters along a zig-zag rail pattern and read rows to transpose the message.",
    "inputs": [
      "Plaintext",
      "Rail count"
    ],
    "outputs": [
      "Ciphertext",
      "Rail rows"
    ],
    "visualizers": [
      "Zig-zag rail grid",
      "Readout order"
    ],
    "notes": [
      "Transposition hides positions but not the original letters."
    ]
  },
  {
    "page": "ColumnarTranspositionPage",
    "route": "/algorithms/classical/columnar-transposition",
    "label": "Columnar Transposition",
    "category": "Classical Cryptography",
    "securityStatus": "Educational",
    "intro": "Place text in columns under a keyword and read columns by sorted key order.",
    "inputs": [
      "Plaintext",
      "Keyword",
      "Padding character"
    ],
    "outputs": [
      "Ciphertext",
      "Column read order"
    ],
    "visualizers": [
      "Column grid",
      "Keyword ordering table"
    ],
    "notes": [
      "Repeated keyword letters need a stable tie-breaking rule."
    ]
  },
  {
    "page": "SubstitutionCipherPage",
    "route": "/algorithms/classical/substitution-cipher",
    "label": "Monoalphabetic Substitution",
    "category": "Classical Cryptography",
    "securityStatus": "Unsafe",
    "intro": "Replace every plaintext letter with a fixed shuffled alphabet.",
    "inputs": [
      "Plaintext",
      "Substitution alphabet"
    ],
    "outputs": [
      "Ciphertext",
      "Letter frequency"
    ],
    "visualizers": [
      "Mapping strip",
      "Frequency comparison"
    ],
    "notes": [
      "Single-letter frequencies and common patterns reveal the substitution."
    ]
  },
  {
    "page": "AESPage",
    "route": "/algorithms/symmetric/aes",
    "label": "AES Workbench",
    "category": "Symmetric Cryptography",
    "securityStatus": "Modern",
    "intro": "Explore AES block encryption, Web Crypto backed modes, and a custom educational round visualizer.",
    "inputs": [
      "Plaintext",
      "Key",
      "IV or nonce",
      "Mode",
      "Padding",
      "Key size"
    ],
    "outputs": [
      "Ciphertext",
      "Input block in text, hex, binary, matrix",
      "Avalanche comparison"
    ],
    "visualizers": [
      "4x4 state matrix",
      "Key expansion preview",
      "AddRoundKey, SubBytes, ShiftRows, MixColumns timeline"
    ],
    "notes": [
      "AES is a modern block cipher; prefer AEAD modes such as GCM for authenticated encryption."
    ]
  },
  {
    "page": "AES128StepPage",
    "route": "/algorithms/symmetric/aes-128-step",
    "label": "AES-128 Step Visualizer",
    "category": "Block Ciphers",
    "securityStatus": "Educational",
    "intro": "Walk byte by byte through AES-128 from the initial state to the final round without MixColumns.",
    "inputs": [
      "16-byte plaintext block",
      "128-bit key",
      "Round selector",
      "Step selector"
    ],
    "outputs": [
      "Final ciphertext",
      "Round key",
      "Changed byte list"
    ],
    "visualizers": [
      "Initial AddRoundKey",
      "Rounds 1-9 four-step table",
      "Round 10 three-step table",
      "Changed-byte matrix"
    ],
    "notes": [
      "This visualizer is educational and exposes intermediate state that real software must protect."
    ]
  },
  {
    "page": "AES192StepPage",
    "route": "/algorithms/symmetric/aes-192-step",
    "label": "AES-192 Step Visualizer",
    "category": "Block Ciphers",
    "securityStatus": "Educational",
    "intro": "Study the 12-round AES variant with a 192-bit key schedule.",
    "inputs": [
      "16-byte block",
      "192-bit key",
      "Round selector"
    ],
    "outputs": [
      "State after selected round",
      "Expanded key words"
    ],
    "visualizers": [
      "Nk=6 key expansion",
      "12-round timeline"
    ],
    "notes": [
      "AES-192 is less common than AES-128 and AES-256 but remains modern."
    ]
  },
  {
    "page": "AES256StepPage",
    "route": "/algorithms/symmetric/aes-256-step",
    "label": "AES-256 Step Visualizer",
    "category": "Block Ciphers",
    "securityStatus": "Educational",
    "intro": "Inspect AES-256 with its 14 rounds and extra key schedule substitution step.",
    "inputs": [
      "16-byte block",
      "256-bit key",
      "Round selector"
    ],
    "outputs": [
      "State matrix",
      "Round key words"
    ],
    "visualizers": [
      "Nk=8 expansion",
      "14-round timeline",
      "Extra SubWord marker"
    ],
    "notes": [
      "More key bits do not remove the need for correct modes and nonce handling."
    ]
  },
  {
    "page": "AESSBoxExplorerPage",
    "route": "/algorithms/symmetric/aes-sbox",
    "label": "AES S-Box Explorer",
    "category": "Block Ciphers",
    "securityStatus": "Educational",
    "intro": "Use the real AES S-box and inverse S-box to inspect byte substitution by row and column.",
    "inputs": [
      "Hex byte",
      "Forward or inverse table"
    ],
    "outputs": [
      "Selected output byte",
      "Row nibble",
      "Column nibble"
    ],
    "visualizers": [
      "16x16 S-box grid",
      "Highlighted high/low nibble",
      "GF(2^8) inverse and affine transform panel"
    ],
    "notes": [
      "The S-box is public and fixed; security comes from the key and the round structure."
    ]
  },
  {
    "page": "AESKeyExpansionPage",
    "route": "/algorithms/symmetric/aes-key-expansion",
    "label": "AES Key Expansion",
    "category": "Block Ciphers",
    "securityStatus": "Educational",
    "intro": "Follow RotWord, SubWord, Rcon, and XOR operations that create AES round keys.",
    "inputs": [
      "AES key",
      "Key size"
    ],
    "outputs": [
      "Round keys",
      "Word table"
    ],
    "visualizers": [
      "Expansion word ledger",
      "Rcon timeline"
    ],
    "notes": [
      "Round keys are derived secrets and should not be logged in production."
    ]
  },
  {
    "page": "AESMixColumnsPage",
    "route": "/algorithms/symmetric/aes-mix-columns",
    "label": "AES MixColumns",
    "category": "Block Ciphers",
    "securityStatus": "Educational",
    "intro": "Multiply each AES state column by the Rijndael matrix in GF(2^8).",
    "inputs": [
      "State column bytes"
    ],
    "outputs": [
      "Mixed column",
      "GF products"
    ],
    "visualizers": [
      "Column matrix",
      "Finite-field multiplication table"
    ],
    "notes": [
      "MixColumns diffuses one byte change across a full column."
    ]
  },
  {
    "page": "AESModesPage",
    "route": "/algorithms/symmetric/aes-modes",
    "label": "AES Modes",
    "category": "Modes of Operation",
    "securityStatus": "Modern",
    "intro": "Compare how AES block encryption is wrapped by ECB, CBC, CFB, OFB, CTR, and GCM.",
    "inputs": [
      "Plaintext blocks",
      "Key",
      "IV or nonce",
      "Mode"
    ],
    "outputs": [
      "Block flow output",
      "Authentication tag when available"
    ],
    "visualizers": [
      "Mode flow diagram",
      "Nonce and IV rules",
      "Repeated block detector"
    ],
    "notes": [
      "Never reuse a nonce with GCM or CTR under the same key."
    ]
  },
  {
    "page": "DESPage",
    "route": "/algorithms/symmetric/des",
    "label": "DES Workbench",
    "category": "Symmetric Cryptography",
    "securityStatus": "Deprecated",
    "intro": "Inspect the 64-bit DES Feistel cipher and why its 56-bit effective key is obsolete.",
    "inputs": [
      "64-bit block",
      "64-bit key with parity",
      "Encrypt/decrypt"
    ],
    "outputs": [
      "Ciphertext",
      "L0/R0 split",
      "Round summaries"
    ],
    "visualizers": [
      "Initial permutation",
      "16 Feistel rounds",
      "Expansion, S-boxes, P permutation, final permutation"
    ],
    "notes": [
      "DES is deprecated because exhaustive search is practical against its small key space."
    ]
  },
  {
    "page": "DESFullStepPage",
    "route": "/algorithms/symmetric/des-full-step",
    "label": "DES Full Step Visualizer",
    "category": "Block Ciphers",
    "securityStatus": "Deprecated",
    "intro": "Step through DES from IP to FP with every Feistel round expanded.",
    "inputs": [
      "64-bit plaintext",
      "64-bit DES key",
      "Round selector"
    ],
    "outputs": [
      "Round L/R values",
      "Feistel function output",
      "Cipher block"
    ],
    "visualizers": [
      "IP table",
      "E expansion",
      "XOR with subkey",
      "S1-S8 outputs",
      "P permutation",
      "Swap"
    ],
    "notes": [
      "The Feistel structure decrypts by applying round keys in reverse order."
    ]
  },
  {
    "page": "DESSBoxExplorerPage",
    "route": "/algorithms/symmetric/des-sbox",
    "label": "DES S-Box Explorer",
    "category": "Block Ciphers",
    "securityStatus": "Educational",
    "intro": "Select a DES S-box and map a 6-bit input to a 4-bit output using real DES tables.",
    "inputs": [
      "S-box S1-S8",
      "6-bit input"
    ],
    "outputs": [
      "4-bit output",
      "Row from outer bits",
      "Column from inner bits"
    ],
    "visualizers": [
      "4x16 S-box grid",
      "Row/column highlighter",
      "Binary output panel"
    ],
    "notes": [
      "DES S-boxes are fixed nonlinear components that compress 48 Feistel bits to 32 bits."
    ]
  },
  {
    "page": "DESKeySchedulePage",
    "route": "/algorithms/symmetric/des-key-schedule",
    "label": "DES Key Schedule",
    "category": "Block Ciphers",
    "securityStatus": "Deprecated",
    "intro": "Generate the 16 DES round keys with PC-1, left shifts, and PC-2.",
    "inputs": [
      "64-bit key",
      "Round selector"
    ],
    "outputs": [
      "C and D halves",
      "48-bit round keys"
    ],
    "visualizers": [
      "PC-1 permutation",
      "Shift schedule",
      "PC-2 table"
    ],
    "notes": [
      "Parity bits are dropped; the effective DES key length is 56 bits."
    ]
  },
  {
    "page": "TripleDESPage",
    "route": "/algorithms/symmetric/triple-des",
    "label": "Triple DES",
    "category": "Symmetric Cryptography",
    "securityStatus": "Legacy",
    "intro": "Chain DES encrypt-decrypt-encrypt stages to extend practical key length.",
    "inputs": [
      "Plaintext block",
      "Keying option",
      "K1/K2/K3"
    ],
    "outputs": [
      "EDE output",
      "Stage trace"
    ],
    "visualizers": [
      "DES stage pipeline",
      "Meet-in-the-middle note"
    ],
    "notes": [
      "3DES is legacy and should be replaced by AES where possible."
    ]
  },
  {
    "page": "BlowfishPage",
    "route": "/algorithms/symmetric/blowfish",
    "label": "Blowfish",
    "category": "Symmetric Cryptography",
    "securityStatus": "Legacy",
    "intro": "Explore a 64-bit block cipher with expensive key setup and variable-length keys.",
    "inputs": [
      "Plaintext block",
      "Variable key"
    ],
    "outputs": [
      "Cipher block",
      "P-array summary"
    ],
    "visualizers": [
      "Feistel diagram",
      "Key setup outline"
    ],
    "notes": [
      "The 64-bit block size is too small for large modern data volumes."
    ]
  },
  {
    "page": "TwofishPage",
    "route": "/algorithms/symmetric/twofish",
    "label": "Twofish",
    "category": "Symmetric Cryptography",
    "securityStatus": "Modern",
    "intro": "Inspect the AES finalist with key-dependent S-boxes and an MDS matrix.",
    "inputs": [
      "Plaintext block",
      "128/192/256-bit key"
    ],
    "outputs": [
      "Cipher block",
      "Round trace"
    ],
    "visualizers": [
      "Whitening keys",
      "g function",
      "Feistel-like rounds"
    ],
    "notes": [
      "Twofish is sound but less commonly available in browser-native APIs."
    ]
  },
  {
    "page": "SerpentPage",
    "route": "/algorithms/symmetric/serpent",
    "label": "Serpent",
    "category": "Symmetric Cryptography",
    "securityStatus": "Modern",
    "intro": "Visualize the conservative AES finalist with 32 S-box based rounds.",
    "inputs": [
      "Plaintext block",
      "Key size"
    ],
    "outputs": [
      "Cipher block",
      "Round state"
    ],
    "visualizers": [
      "Bitslice S-box lane",
      "Linear transform"
    ],
    "notes": [
      "Serpent favors a high security margin over raw speed."
    ]
  },
  {
    "page": "IDEAPage",
    "route": "/algorithms/symmetric/idea",
    "label": "IDEA",
    "category": "Symmetric Cryptography",
    "securityStatus": "Legacy",
    "intro": "Combine XOR, modular addition, and modular multiplication in IDEA rounds.",
    "inputs": [
      "64-bit block",
      "128-bit key"
    ],
    "outputs": [
      "Cipher block",
      "Subkey list"
    ],
    "visualizers": [
      "Mixed operation round",
      "Modulo 65537 multiplication"
    ],
    "notes": [
      "IDEA is historically important but uncommon in new systems."
    ]
  },
  {
    "page": "RC5Page",
    "route": "/algorithms/symmetric/rc5",
    "label": "RC5",
    "category": "Symmetric Cryptography",
    "securityStatus": "Legacy",
    "intro": "Study a parameterized cipher built from data-dependent rotations.",
    "inputs": [
      "Word size",
      "Rounds",
      "Key"
    ],
    "outputs": [
      "Cipher words",
      "Rotation trace"
    ],
    "visualizers": [
      "ARX operation panel",
      "Round word table"
    ],
    "notes": [
      "Parameter choices matter; small round counts are educational only."
    ]
  },
  {
    "page": "RC6Page",
    "route": "/algorithms/symmetric/rc6",
    "label": "RC6",
    "category": "Symmetric Cryptography",
    "securityStatus": "Legacy",
    "intro": "Extend RC5 into four registers with multiplication-driven rotations.",
    "inputs": [
      "128-bit block",
      "Key",
      "Round count"
    ],
    "outputs": [
      "Cipher block",
      "Register trace"
    ],
    "visualizers": [
      "A/B/C/D lane view",
      "Rotation schedule"
    ],
    "notes": [
      "RC6 was an AES finalist but is rarely a default choice today."
    ]
  },
  {
    "page": "CamelliaPage",
    "route": "/algorithms/symmetric/camellia",
    "label": "Camellia",
    "category": "Symmetric Cryptography",
    "securityStatus": "Modern",
    "intro": "Visualize Camellia's Feistel network, FL layers, and S-box substitutions.",
    "inputs": [
      "Plaintext block",
      "Key size"
    ],
    "outputs": [
      "Cipher block",
      "Subkey layers"
    ],
    "visualizers": [
      "Feistel rounds",
      "FL/FL-inverse markers"
    ],
    "notes": [
      "Camellia remains standardized and useful where supported."
    ]
  },
  {
    "page": "RC4Page",
    "route": "/algorithms/stream/rc4",
    "label": "RC4",
    "category": "Stream Ciphers",
    "securityStatus": "Deprecated",
    "intro": "Inspect RC4's KSA and PRGA and the biases that made it unsafe.",
    "inputs": [
      "Key",
      "Plaintext"
    ],
    "outputs": [
      "Keystream",
      "Ciphertext"
    ],
    "visualizers": [
      "S array shuffle",
      "i/j PRGA trace"
    ],
    "notes": [
      "RC4 must not be used for modern confidentiality."
    ]
  },
  {
    "page": "ChaCha20Page",
    "route": "/algorithms/stream/chacha20",
    "label": "ChaCha20",
    "category": "Stream Ciphers",
    "securityStatus": "Modern",
    "intro": "Visualize the 4x4 ChaCha state, quarter rounds, and plaintext XOR.",
    "inputs": [
      "256-bit key",
      "96-bit nonce",
      "Counter",
      "Plaintext"
    ],
    "outputs": [
      "Keystream block",
      "Ciphertext"
    ],
    "visualizers": [
      "4x4 state matrix",
      "Column rounds",
      "Diagonal rounds",
      "Quarter round detail"
    ],
    "notes": [
      "Nonce reuse with the same key reveals relationships between plaintexts."
    ]
  },
  {
    "page": "Salsa20Page",
    "route": "/algorithms/stream/salsa20",
    "label": "Salsa20",
    "category": "Stream Ciphers",
    "securityStatus": "Modern",
    "intro": "Study the ARX stream cipher family that inspired ChaCha.",
    "inputs": [
      "Key",
      "Nonce",
      "Counter"
    ],
    "outputs": [
      "Keystream",
      "XOR output"
    ],
    "visualizers": [
      "State matrix",
      "Double-round flow"
    ],
    "notes": [
      "Salsa20 uses addition, rotation, and XOR, avoiding S-box tables."
    ]
  },
  {
    "page": "OneTimePadPage",
    "route": "/algorithms/stream/one-time-pad",
    "label": "One-Time Pad",
    "category": "Stream Ciphers",
    "securityStatus": "Educational",
    "intro": "XOR a message with truly random key material of equal length.",
    "inputs": [
      "Plaintext",
      "Pad bytes"
    ],
    "outputs": [
      "Ciphertext",
      "Recovered plaintext"
    ],
    "visualizers": [
      "XOR byte table",
      "Pad length checker"
    ],
    "notes": [
      "The pad must be random, secret, as long as the message, and never reused."
    ]
  },
  {
    "page": "LFSRPage",
    "route": "/algorithms/stream/lfsr",
    "label": "LFSR",
    "category": "Stream Ciphers",
    "securityStatus": "Educational",
    "intro": "Generate toy keystream bits from a linear feedback shift register.",
    "inputs": [
      "Seed bits",
      "Tap positions",
      "Clock count"
    ],
    "outputs": [
      "Generated bits",
      "Period estimate"
    ],
    "visualizers": [
      "Shift register cells",
      "Feedback XOR trace"
    ],
    "notes": [
      "Plain LFSRs are linear and need nonlinear combining for real ciphers."
    ]
  },
  {
    "page": "RSAOverviewPage",
    "route": "/algorithms/asymmetric/rsa",
    "label": "RSA Overview",
    "category": "Public Key Cryptography",
    "securityStatus": "Modern",
    "intro": "Connect RSA's trapdoor arithmetic to encryption, signatures, padding, and key sizes.",
    "inputs": [
      "Message integer",
      "Public exponent",
      "Modulus"
    ],
    "outputs": [
      "Operation summary",
      "Key relationship"
    ],
    "visualizers": [
      "m^e mod n flow",
      "Key pair diagram",
      "Padding boundary"
    ],
    "notes": [
      "Raw RSA is unsafe; practical RSA needs OAEP for encryption or PSS for signatures."
    ]
  },
  {
    "page": "RSAKeyGenerationPage",
    "route": "/algorithms/asymmetric/rsa-key-generation",
    "label": "RSA Key Generation",
    "category": "Public Key Cryptography",
    "securityStatus": "Educational",
    "intro": "Use small educational primes to compute n, phi(n), e, and d.",
    "inputs": [
      "p prime",
      "q prime",
      "public exponent e"
    ],
    "outputs": [
      "n = p*q",
      "phi(n)",
      "gcd(e, phi)",
      "d inverse",
      "public/private keys"
    ],
    "visualizers": [
      "Prime checks",
      "Totient formula",
      "Extended Euclid table"
    ],
    "notes": [
      "Toy primes are for visualization only and are catastrophically small for real keys."
    ]
  },
  {
    "page": "RSAEncryptionPage",
    "route": "/algorithms/asymmetric/rsa-encryption",
    "label": "RSA Encryption",
    "category": "Public Key Cryptography",
    "securityStatus": "Educational",
    "intro": "Raise a message integer to e modulo n and inspect square-and-multiply.",
    "inputs": [
      "Message",
      "e",
      "n"
    ],
    "outputs": [
      "Cipher integer",
      "Modular exponent table"
    ],
    "visualizers": [
      "Binary exponent ladder",
      "m^e mod n trace"
    ],
    "notes": [
      "Messages must be padded and smaller than n before real RSA encryption."
    ]
  },
  {
    "page": "RSADecryptionPage",
    "route": "/algorithms/asymmetric/rsa-decryption",
    "label": "RSA Decryption",
    "category": "Public Key Cryptography",
    "securityStatus": "Educational",
    "intro": "Recover m = c^d mod n and compare direct and CRT-style thinking.",
    "inputs": [
      "Cipher integer",
      "private exponent d",
      "modulus n"
    ],
    "outputs": [
      "Recovered message integer",
      "Exponentiation table"
    ],
    "visualizers": [
      "Square-and-multiply trace",
      "CRT concept panel"
    ],
    "notes": [
      "Private exponent operations must be protected against timing leaks."
    ]
  },
  {
    "page": "RSASignaturePage",
    "route": "/algorithms/asymmetric/rsa-signature",
    "label": "RSA Signature",
    "category": "Public Key Cryptography",
    "securityStatus": "Modern",
    "intro": "Hash a message and sign it with RSA-PSS or compare legacy PKCS#1 v1.5 structure.",
    "inputs": [
      "Message",
      "Hash selector",
      "Private key fields",
      "Padding mode"
    ],
    "outputs": [
      "Signature integer",
      "Verify result"
    ],
    "visualizers": [
      "Hash-to-encoded-message",
      "PSS salt panel",
      "Verification exponentiation"
    ],
    "notes": [
      "Never sign raw messages; sign a well-defined encoded hash."
    ]
  },
  {
    "page": "RSAPaddingPage",
    "route": "/algorithms/asymmetric/rsa-padding",
    "label": "RSA Padding",
    "category": "Public Key Cryptography",
    "securityStatus": "Modern",
    "intro": "Compare OAEP and PSS encodings that make RSA safe in practice.",
    "inputs": [
      "Message",
      "Label",
      "Salt or seed"
    ],
    "outputs": [
      "Encoded block",
      "Masking components"
    ],
    "visualizers": [
      "MGF1 flow",
      "masked DB",
      "masked seed"
    ],
    "notes": [
      "Padding validation errors must avoid oracle behavior."
    ]
  },
  {
    "page": "ElGamalPage",
    "route": "/algorithms/asymmetric/elgamal",
    "label": "ElGamal",
    "category": "Public Key Cryptography",
    "securityStatus": "Educational",
    "intro": "Use a fresh random k to encrypt through discrete logarithm arithmetic.",
    "inputs": [
      "p",
      "g",
      "public key y",
      "message",
      "ephemeral k"
    ],
    "outputs": [
      "c1",
      "c2",
      "shared secret"
    ],
    "visualizers": [
      "Exponentiation flow",
      "Ephemeral key warning"
    ],
    "notes": [
      "Reusing k breaks ElGamal confidentiality."
    ]
  },
  {
    "page": "RabinPage",
    "route": "/algorithms/asymmetric/rabin",
    "label": "Rabin Cryptosystem",
    "category": "Public Key Cryptography",
    "securityStatus": "Educational",
    "intro": "Square a message modulo n and recover four square roots during decryption.",
    "inputs": [
      "p",
      "q",
      "message"
    ],
    "outputs": [
      "Cipher square",
      "Candidate roots"
    ],
    "visualizers": [
      "Modulo square map",
      "CRT recombination"
    ],
    "notes": [
      "Rabin needs redundancy or padding to identify the correct plaintext."
    ]
  },
  {
    "page": "DiffieHellmanPage",
    "route": "/algorithms/asymmetric/diffie-hellman",
    "label": "Diffie-Hellman Key Exchange",
    "category": "Public Key Cryptography",
    "securityStatus": "Educational",
    "intro": "Let Alice and Bob derive the same secret over a finite-field group while an observer sees only public values.",
    "inputs": [
      "p prime",
      "g generator",
      "Alice private a",
      "Bob private b"
    ],
    "outputs": [
      "A = g^a mod p",
      "B = g^b mod p",
      "shared secret"
    ],
    "visualizers": [
      "Two-party exchange diagram",
      "Modular exponentiation tables",
      "MITM warning panel"
    ],
    "notes": [
      "Unauthenticated Diffie-Hellman is vulnerable to man-in-the-middle substitution."
    ]
  },
  {
    "page": "ECCOverviewPage",
    "route": "/algorithms/ecc",
    "label": "ECC Overview",
    "category": "Elliptic Curve Cryptography",
    "securityStatus": "Modern",
    "intro": "Explore finite-field curves, point addition, doubling, scalar multiplication, and why ECC keys are compact.",
    "inputs": [
      "Curve equation",
      "Field prime",
      "Base point"
    ],
    "outputs": [
      "Point multiples",
      "Key pair concept"
    ],
    "visualizers": [
      "Curve equation panel",
      "Point addition formulas",
      "RSA comparison table"
    ],
    "notes": [
      "Curve and parameter validation are essential; do not invent production curves."
    ]
  },
  {
    "page": "ECCCurveExplorerPage",
    "route": "/algorithms/ecc/curve-explorer",
    "label": "ECC Curve Explorer",
    "category": "Elliptic Curve Cryptography",
    "securityStatus": "Educational",
    "intro": "Plot toy elliptic curve points over a finite field and perform group operations.",
    "inputs": [
      "a",
      "b",
      "p",
      "Point P",
      "Point Q",
      "Scalar k"
    ],
    "outputs": [
      "P+Q",
      "2P",
      "kP"
    ],
    "visualizers": [
      "Finite-field point plot",
      "Slope formula table"
    ],
    "notes": [
      "Small fields make patterns visible but are not secure."
    ]
  },
  {
    "page": "ECDHPage",
    "route": "/algorithms/ecc/ecdh",
    "label": "ECDH",
    "category": "Elliptic Curve Cryptography",
    "securityStatus": "Modern",
    "intro": "Derive a shared point by multiplying public keys by private scalars.",
    "inputs": [
      "Curve",
      "Alice scalar",
      "Bob scalar"
    ],
    "outputs": [
      "Public points",
      "Shared point",
      "Derived key"
    ],
    "visualizers": [
      "Scalar multiplication ladder",
      "Exchange diagram"
    ],
    "notes": [
      "Validate peer public keys before deriving secrets."
    ]
  },
  {
    "page": "ECDSAPage",
    "route": "/algorithms/ecc/ecdsa",
    "label": "ECDSA",
    "category": "Elliptic Curve Cryptography",
    "securityStatus": "Modern",
    "intro": "Sign a message with elliptic-curve arithmetic and inspect r, s, and verification.",
    "inputs": [
      "Private key",
      "Public key",
      "Message",
      "Hash",
      "Nonce k"
    ],
    "outputs": [
      "r value",
      "s value",
      "Verify result"
    ],
    "visualizers": [
      "Nonce-to-point step",
      "Signature formula table",
      "Nonce reuse warning panel"
    ],
    "notes": [
      "Reusing or biasing nonce k can reveal the private key."
    ]
  },
  {
    "page": "Ed25519Page",
    "route": "/algorithms/ecc/ed25519",
    "label": "Ed25519",
    "category": "Elliptic Curve Cryptography",
    "securityStatus": "Modern",
    "intro": "Study deterministic Edwards-curve signatures with compact keys and signatures.",
    "inputs": [
      "Seed",
      "Message"
    ],
    "outputs": [
      "Public key",
      "Signature",
      "Verify result"
    ],
    "visualizers": [
      "Hash-derived nonce",
      "Edwards point operation outline"
    ],
    "notes": [
      "Use vetted libraries or Web Crypto support where available."
    ]
  },
  {
    "page": "X25519Page",
    "route": "/algorithms/ecc/x25519",
    "label": "X25519",
    "category": "Elliptic Curve Cryptography",
    "securityStatus": "Modern",
    "intro": "Visualize Montgomery-ladder key agreement over Curve25519.",
    "inputs": [
      "Private scalar",
      "Peer public key"
    ],
    "outputs": [
      "Shared secret",
      "Clamped scalar"
    ],
    "visualizers": [
      "Montgomery ladder sketch",
      "Scalar clamping panel"
    ],
    "notes": [
      "X25519 is for key agreement, not signatures."
    ]
  },
  {
    "page": "MD5Page",
    "route": "/algorithms/hash/md5",
    "label": "MD5",
    "category": "Hash Functions",
    "securityStatus": "Deprecated",
    "intro": "Compute and visualize MD5's Merkle-Damgard style rounds while flagging its broken collision resistance.",
    "inputs": [
      "Message",
      "Output format"
    ],
    "outputs": [
      "MD5 digest",
      "Round words"
    ],
    "visualizers": [
      "Four round functions",
      "512-bit block split"
    ],
    "notes": [
      "MD5 is broken for signatures, certificates, and integrity against attackers."
    ]
  },
  {
    "page": "SHA1Page",
    "route": "/algorithms/hash/sha1",
    "label": "SHA-1",
    "category": "Hash Functions",
    "securityStatus": "Deprecated",
    "intro": "Inspect SHA-1's compression structure and its collision-risk warning.",
    "inputs": [
      "Message",
      "Output format"
    ],
    "outputs": [
      "SHA-1 digest",
      "Word schedule"
    ],
    "visualizers": [
      "80-round timeline",
      "Collision warning panel"
    ],
    "notes": [
      "SHA-1 should be replaced by SHA-256 or SHA-3 families."
    ]
  },
  {
    "page": "SHA2Page",
    "route": "/algorithms/hash/sha2",
    "label": "SHA-2 Family",
    "category": "Hash Functions",
    "securityStatus": "Modern",
    "intro": "Compare SHA-224, SHA-256, SHA-384, and SHA-512 digest variants.",
    "inputs": [
      "Message",
      "Variant selector"
    ],
    "outputs": [
      "Digest",
      "Block size",
      "Word size"
    ],
    "visualizers": [
      "Family comparison table",
      "Compression function overview"
    ],
    "notes": [
      "Choose digest length based on security target and protocol requirements."
    ]
  },
  {
    "page": "SHA256StepPage",
    "route": "/algorithms/hash/sha-256-step",
    "label": "SHA-256 Step Visualizer",
    "category": "Hash Functions",
    "securityStatus": "Modern",
    "intro": "Follow UTF-8 bytes through padding, message schedule, 64 constants, and compression rounds.",
    "inputs": [
      "Message",
      "Avalanche toggle"
    ],
    "outputs": [
      "Final digest",
      "Message schedule",
      "Working variables a-h"
    ],
    "visualizers": [
      "Padding block",
      "K[0..63] table",
      "Ch/Maj/Sigma panels",
      "64-round compression timeline"
    ],
    "notes": [
      "A tiny input change should flip roughly half the digest bits."
    ]
  },
  {
    "page": "SHA3Page",
    "route": "/algorithms/hash/sha3",
    "label": "SHA-3",
    "category": "Hash Functions",
    "securityStatus": "Modern",
    "intro": "Visualize the sponge construction that absorbs, permutes, and squeezes output.",
    "inputs": [
      "Message",
      "Digest size"
    ],
    "outputs": [
      "SHA-3 digest",
      "Rate/capacity"
    ],
    "visualizers": [
      "Absorb phase",
      "Keccak-f permutation",
      "Squeeze phase"
    ],
    "notes": [
      "SHA-3 is structurally different from SHA-2 and useful for algorithm diversity."
    ]
  },
  {
    "page": "KeccakSpongePage",
    "route": "/algorithms/hash/keccak-sponge",
    "label": "Keccak Sponge",
    "category": "Hash Functions",
    "securityStatus": "Educational",
    "intro": "Explore rate, capacity, padding, and lane permutations in the Keccak sponge.",
    "inputs": [
      "Input bytes",
      "Rate",
      "Capacity"
    ],
    "outputs": [
      "Sponge state",
      "Output bytes"
    ],
    "visualizers": [
      "5x5 lane view",
      "Theta/Rho/Pi/Chi/Iota outline"
    ],
    "notes": [
      "Changing rate and capacity changes performance and security margin."
    ]
  },
  {
    "page": "BLAKE2Page",
    "route": "/algorithms/hash/blake2",
    "label": "BLAKE2",
    "category": "Hash Functions",
    "securityStatus": "Modern",
    "intro": "Use keyed or unkeyed BLAKE2 style hashing with digest-size choices.",
    "inputs": [
      "Message",
      "Optional key",
      "Digest size"
    ],
    "outputs": [
      "Digest",
      "Parameter block"
    ],
    "visualizers": [
      "G mixing function",
      "Keyed hashing panel"
    ],
    "notes": [
      "Keyed hashing can act like a MAC when protocol requirements match."
    ]
  },
  {
    "page": "BLAKE3Page",
    "route": "/algorithms/hash/blake3",
    "label": "BLAKE3",
    "category": "Hash Functions",
    "securityStatus": "Modern",
    "intro": "Inspect BLAKE3's tree hashing model and extendable output mode.",
    "inputs": [
      "Message",
      "Digest size",
      "Keyed mode"
    ],
    "outputs": [
      "Digest",
      "Chunk tree"
    ],
    "visualizers": [
      "Chunk compression",
      "Parent node tree",
      "Performance panel"
    ],
    "notes": [
      "BLAKE3 is fast and parallel, but browser support may rely on WASM libraries."
    ]
  },
  {
    "page": "RIPEMD160Page",
    "route": "/algorithms/hash/ripemd160",
    "label": "RIPEMD-160",
    "category": "Hash Functions",
    "securityStatus": "Legacy",
    "intro": "Show RIPEMD-160's dual-line compression used historically in blockchain addresses.",
    "inputs": [
      "Message"
    ],
    "outputs": [
      "160-bit digest",
      "Parallel lane state"
    ],
    "visualizers": [
      "Left/right line table",
      "Round constants"
    ],
    "notes": [
      "RIPEMD-160 is legacy; choose modern hashes for new designs."
    ]
  },
  {
    "page": "HMACPage",
    "route": "/algorithms/mac/hmac",
    "label": "HMAC",
    "category": "MAC Algorithms",
    "securityStatus": "Modern",
    "intro": "Build a message authentication code from a hash function, ipad, and opad.",
    "inputs": [
      "Message",
      "Secret key",
      "Hash selector"
    ],
    "outputs": [
      "Inner hash",
      "Outer hash",
      "Final tag"
    ],
    "visualizers": [
      "ipad/opad block",
      "Inner hash flow",
      "Outer hash flow"
    ],
    "notes": [
      "HMAC remains robust even when the underlying hash has some collision weaknesses."
    ]
  },
  {
    "page": "CMACPage",
    "route": "/algorithms/mac/cmac",
    "label": "CMAC",
    "category": "MAC Algorithms",
    "securityStatus": "Modern",
    "intro": "Authenticate blocks using AES-CMAC subkeys and final-block processing.",
    "inputs": [
      "AES key",
      "Message"
    ],
    "outputs": [
      "K1/K2 subkeys",
      "CMAC tag"
    ],
    "visualizers": [
      "Subkey generation",
      "Block chaining",
      "Final block rule"
    ],
    "notes": [
      "CMAC requires a block cipher key used for authentication only."
    ]
  },
  {
    "page": "Poly1305Page",
    "route": "/algorithms/mac/poly1305",
    "label": "Poly1305",
    "category": "MAC Algorithms",
    "securityStatus": "Modern",
    "intro": "Evaluate a polynomial modulo 2^130-5 using a one-time key.",
    "inputs": [
      "One-time key",
      "Message"
    ],
    "outputs": [
      "Tag",
      "Accumulator trace"
    ],
    "visualizers": [
      "Block clamping",
      "Polynomial accumulator"
    ],
    "notes": [
      "Never reuse a Poly1305 one-time key for two messages."
    ]
  },
  {
    "page": "GMACPage",
    "route": "/algorithms/mac/gmac",
    "label": "GMAC",
    "category": "MAC Algorithms",
    "securityStatus": "Modern",
    "intro": "Use the GCM authentication function without encrypting plaintext.",
    "inputs": [
      "AES key",
      "IV",
      "AAD"
    ],
    "outputs": [
      "Authentication tag",
      "GHASH state"
    ],
    "visualizers": [
      "GHASH multiplication",
      "Counter tag mask"
    ],
    "notes": [
      "IV uniqueness under a key remains required."
    ]
  },
  {
    "page": "PBKDF2Page",
    "route": "/algorithms/kdf/pbkdf2",
    "label": "PBKDF2",
    "category": "Key Derivation Functions",
    "securityStatus": "Modern",
    "intro": "Derive key material from a password using salt, iterations, and Web Crypto PBKDF2.",
    "inputs": [
      "Password",
      "Salt",
      "Iteration count",
      "Hash",
      "Derived key length"
    ],
    "outputs": [
      "Derived key",
      "Timing sample"
    ],
    "visualizers": [
      "Iteration loop",
      "HMAC block chain",
      "Timing chart"
    ],
    "notes": [
      "Use high iteration counts and unique salts; tune cost for your users' devices."
    ]
  },
  {
    "page": "ScryptPage",
    "route": "/algorithms/kdf/scrypt",
    "label": "Scrypt",
    "category": "Key Derivation Functions",
    "securityStatus": "Modern",
    "intro": "Estimate memory-hard password derivation parameters N, r, and p.",
    "inputs": [
      "Password",
      "Salt",
      "N",
      "r",
      "p"
    ],
    "outputs": [
      "Derived key preview",
      "Memory estimate"
    ],
    "visualizers": [
      "ROMix memory grid",
      "Cost calculator"
    ],
    "notes": [
      "Browser-native Web Crypto does not include scrypt, so production use needs vetted WASM."
    ]
  },
  {
    "page": "Argon2Page",
    "route": "/algorithms/kdf/argon2",
    "label": "Argon2",
    "category": "Key Derivation Functions",
    "securityStatus": "Modern",
    "intro": "Compare Argon2d, Argon2i, and Argon2id memory and time costs.",
    "inputs": [
      "Password",
      "Salt",
      "Variant",
      "Memory cost",
      "Time cost",
      "Parallelism"
    ],
    "outputs": [
      "Derived key preview",
      "Cost estimate"
    ],
    "visualizers": [
      "Memory lane diagram",
      "Pass schedule"
    ],
    "notes": [
      "A browser implementation normally needs a vetted WASM module."
    ]
  },
  {
    "page": "HKDFPage",
    "route": "/algorithms/kdf/hkdf",
    "label": "HKDF",
    "category": "Key Derivation Functions",
    "securityStatus": "Modern",
    "intro": "Separate extraction from expansion to derive context-bound keys.",
    "inputs": [
      "Input key material",
      "Salt",
      "Info",
      "Hash"
    ],
    "outputs": [
      "PRK",
      "OKM"
    ],
    "visualizers": [
      "Extract step",
      "Expand blocks",
      "Info label panel"
    ],
    "notes": [
      "HKDF is not a password hash; use it with high-entropy input key material."
    ]
  },
  {
    "page": "BcryptPage",
    "route": "/algorithms/kdf/bcrypt",
    "label": "bcrypt",
    "category": "Key Derivation Functions",
    "securityStatus": "Legacy",
    "intro": "Inspect bcrypt's cost parameter and salt-bearing password hash format.",
    "inputs": [
      "Password",
      "Cost",
      "Salt"
    ],
    "outputs": [
      "Hash format",
      "Work factor estimate"
    ],
    "visualizers": [
      "EksBlowfish setup",
      "Cost doubling chart"
    ],
    "notes": [
      "bcrypt is still common, but Argon2id is preferred for new password storage."
    ]
  },
  {
    "page": "ECBModePage",
    "route": "/algorithms/modes/ecb",
    "label": "ECB Mode",
    "category": "Modes of Operation",
    "securityStatus": "Unsafe",
    "intro": "Show independent block encryption and repeated-block pattern leakage.",
    "inputs": [
      "Plaintext blocks",
      "Block cipher label"
    ],
    "outputs": [
      "Cipher blocks",
      "Repeated block warnings"
    ],
    "visualizers": [
      "Parallel block boxes",
      "Repeated color highlighting",
      "Pattern leakage demo"
    ],
    "notes": [
      "ECB should not be used for confidential structured data."
    ]
  },
  {
    "page": "CBCModePage",
    "route": "/algorithms/modes/cbc",
    "label": "CBC Mode",
    "category": "Modes of Operation",
    "securityStatus": "Legacy",
    "intro": "XOR each plaintext block with the previous ciphertext block before encryption.",
    "inputs": [
      "Plaintext blocks",
      "IV",
      "Key label"
    ],
    "outputs": [
      "Cipher blocks",
      "Chaining trace"
    ],
    "visualizers": [
      "IV block",
      "XOR arrows",
      "Chained encryption diagram"
    ],
    "notes": [
      "CBC needs unpredictable IVs and separate authentication."
    ]
  },
  {
    "page": "CFBModePage",
    "route": "/algorithms/modes/cfb",
    "label": "CFB Mode",
    "category": "Modes of Operation",
    "securityStatus": "Legacy",
    "intro": "Turn a block cipher into a self-synchronizing stream-like mode.",
    "inputs": [
      "Plaintext",
      "IV",
      "Segment size"
    ],
    "outputs": [
      "Ciphertext",
      "Feedback register"
    ],
    "visualizers": [
      "Encrypted feedback block",
      "Segment shift"
    ],
    "notes": [
      "CFB provides confidentiality only; add authentication."
    ]
  },
  {
    "page": "OFBModePage",
    "route": "/algorithms/modes/ofb",
    "label": "OFB Mode",
    "category": "Modes of Operation",
    "securityStatus": "Legacy",
    "intro": "Generate a keystream by repeatedly encrypting feedback state.",
    "inputs": [
      "Plaintext",
      "IV"
    ],
    "outputs": [
      "Keystream",
      "Ciphertext"
    ],
    "visualizers": [
      "Feedback loop",
      "XOR stream panel"
    ],
    "notes": [
      "IV reuse repeats keystream and is dangerous."
    ]
  },
  {
    "page": "CTRModePage",
    "route": "/algorithms/modes/ctr",
    "label": "CTR Mode",
    "category": "Modes of Operation",
    "securityStatus": "Modern",
    "intro": "Encrypt nonce-counter blocks to create a parallelizable keystream.",
    "inputs": [
      "Plaintext",
      "Nonce",
      "Initial counter"
    ],
    "outputs": [
      "Keystream blocks",
      "Ciphertext"
    ],
    "visualizers": [
      "Nonce+counter table",
      "Parallel block encryption",
      "XOR lane"
    ],
    "notes": [
      "Never repeat nonce/counter pairs under the same key."
    ]
  },
  {
    "page": "GCMModePage",
    "route": "/algorithms/modes/gcm",
    "label": "GCM Mode",
    "category": "Modes of Operation",
    "securityStatus": "Modern",
    "intro": "Combine CTR encryption with GHASH authentication over ciphertext and AAD.",
    "inputs": [
      "Plaintext",
      "Nonce",
      "AAD"
    ],
    "outputs": [
      "Ciphertext",
      "Authentication tag"
    ],
    "visualizers": [
      "CTR lane",
      "GHASH lane",
      "Tag generation"
    ],
    "notes": [
      "Nonce reuse can reveal plaintext relationships and break authentication."
    ]
  },
  {
    "page": "XTSModePage",
    "route": "/algorithms/modes/xts",
    "label": "XTS Mode",
    "category": "Modes of Operation",
    "securityStatus": "Modern",
    "intro": "Apply tweakable block encryption for disk sectors.",
    "inputs": [
      "Sector data",
      "Tweak",
      "Key pair"
    ],
    "outputs": [
      "Ciphertext sector",
      "Tweak sequence"
    ],
    "visualizers": [
      "Tweak multiplication",
      "Block mask flow"
    ],
    "notes": [
      "XTS is for storage encryption, not general message encryption."
    ]
  },
  {
    "page": "PKCS7PaddingPage",
    "route": "/algorithms/padding/pkcs7",
    "label": "PKCS#7 Padding",
    "category": "Padding Schemes",
    "securityStatus": "Educational",
    "intro": "Append N bytes each equal to N so input aligns to the block size.",
    "inputs": [
      "Input bytes",
      "Block size"
    ],
    "outputs": [
      "Padded bytes",
      "Padding length"
    ],
    "visualizers": [
      "Block grid",
      "Padding byte highlighter"
    ],
    "notes": [
      "Even an already aligned input receives a full padding block."
    ]
  },
  {
    "page": "ANSIX923PaddingPage",
    "route": "/algorithms/padding/ansi-x923",
    "label": "ANSI X9.23 Padding",
    "category": "Padding Schemes",
    "securityStatus": "Educational",
    "intro": "Pad with zero bytes followed by a final length byte.",
    "inputs": [
      "Input bytes",
      "Block size"
    ],
    "outputs": [
      "Padded bytes",
      "Length byte"
    ],
    "visualizers": [
      "Block grid",
      "Zero padding region"
    ],
    "notes": [
      "The last byte tells how many padding bytes were added."
    ]
  },
  {
    "page": "ISO7816PaddingPage",
    "route": "/algorithms/padding/iso-7816",
    "label": "ISO/IEC 7816-4 Padding",
    "category": "Padding Schemes",
    "securityStatus": "Educational",
    "intro": "Append 0x80 followed by zero bytes until the block is full.",
    "inputs": [
      "Input bytes",
      "Block size"
    ],
    "outputs": [
      "Padded bytes",
      "0x80 marker"
    ],
    "visualizers": [
      "Marker byte grid",
      "Zero fill section"
    ],
    "notes": [
      "The first 0x80 from the end marks the padding boundary."
    ]
  },
  {
    "page": "ZeroPaddingPage",
    "route": "/algorithms/padding/zero-padding",
    "label": "Zero Padding",
    "category": "Padding Schemes",
    "securityStatus": "Unsafe",
    "intro": "Fill the final block with zeros and inspect ambiguity for binary data.",
    "inputs": [
      "Input bytes",
      "Block size"
    ],
    "outputs": [
      "Padded bytes",
      "Ambiguity warning"
    ],
    "visualizers": [
      "Block grid",
      "Trailing zero detector"
    ],
    "notes": [
      "Zero padding cannot distinguish real trailing zeros from padding."
    ]
  },
  {
    "page": "OAEPPage",
    "route": "/algorithms/padding/oaep",
    "label": "RSA-OAEP",
    "category": "Padding Schemes",
    "securityStatus": "Modern",
    "intro": "Encode RSA encryption messages using label hash, seed, MGF1, masked DB, and masked seed.",
    "inputs": [
      "Message",
      "Label",
      "Seed"
    ],
    "outputs": [
      "Encoded message",
      "maskedDB",
      "maskedSeed"
    ],
    "visualizers": [
      "MGF1 diagram",
      "DB construction",
      "Masking table"
    ],
    "notes": [
      "OAEP must be checked carefully to avoid oracle leaks."
    ]
  },
  {
    "page": "PSSPage",
    "route": "/algorithms/padding/pss",
    "label": "RSA-PSS",
    "category": "Padding Schemes",
    "securityStatus": "Modern",
    "intro": "Prepare RSA signatures with randomized salt and MGF1 masking.",
    "inputs": [
      "Message hash",
      "Salt",
      "Modulus length"
    ],
    "outputs": [
      "Encoded message",
      "PSS fields"
    ],
    "visualizers": [
      "Salted hash",
      "MGF1 mask",
      "Trailer byte"
    ],
    "notes": [
      "PSS is preferred over legacy PKCS#1 v1.5 signatures."
    ]
  },
  {
    "page": "Base64ToolPage",
    "route": "/algorithms/encoding/base64",
    "label": "Base64 Tool",
    "category": "Encoding Tools",
    "securityStatus": "Educational",
    "intro": "Encode bytes into printable Base64 and decode them back locally.",
    "inputs": [
      "Text or Base64 input",
      "URL-safe option",
      "Padding toggle"
    ],
    "outputs": [
      "Encoded text",
      "Decoded bytes"
    ],
    "visualizers": [
      "24-bit chunk table",
      "6-bit alphabet indexes",
      "Padding marker"
    ],
    "notes": [
      "Base64 is encoding, not encryption."
    ]
  },
  {
    "page": "HexToolPage",
    "route": "/algorithms/encoding/hex",
    "label": "Hex Tool",
    "category": "Encoding Tools",
    "securityStatus": "Educational",
    "intro": "Convert text and bytes to hexadecimal with grouping controls.",
    "inputs": [
      "Text input",
      "Hex input",
      "Byte grouping"
    ],
    "outputs": [
      "Hex output",
      "Decoded text"
    ],
    "visualizers": [
      "Nibble table",
      "Byte grouping view"
    ],
    "notes": [
      "Hex doubles display length because each byte becomes two symbols."
    ]
  },
  {
    "page": "BinaryToolPage",
    "route": "/algorithms/encoding/binary",
    "label": "Binary Tool",
    "category": "Encoding Tools",
    "securityStatus": "Educational",
    "intro": "Show text as bits and decode grouped binary back to bytes.",
    "inputs": [
      "Text input",
      "Binary input",
      "Bit grouping"
    ],
    "outputs": [
      "Binary output",
      "Decoded text"
    ],
    "visualizers": [
      "8-bit byte rows",
      "Grouping ruler"
    ],
    "notes": [
      "Binary views are useful for bit-level cryptographic transformations."
    ]
  },
  {
    "page": "ASCIIUnicodePage",
    "route": "/algorithms/encoding/ascii-unicode",
    "label": "ASCII and Unicode",
    "category": "Encoding Tools",
    "securityStatus": "Educational",
    "intro": "Inspect code points, UTF-8 bytes, and how text becomes input bytes.",
    "inputs": [
      "Text",
      "Normalization form"
    ],
    "outputs": [
      "Code points",
      "UTF-8 bytes"
    ],
    "visualizers": [
      "Character table",
      "UTF-8 byte sequence"
    ],
    "notes": [
      "Cryptography operates on bytes; text encoding must be explicit."
    ]
  },
  {
    "page": "PEMDERViewerPage",
    "route": "/algorithms/encoding/pem-der",
    "label": "PEM/DER Viewer",
    "category": "Encoding Tools",
    "securityStatus": "Educational",
    "intro": "Paste PEM blocks and inspect headers, Base64 body, DER bytes, and a basic ASN.1 outline.",
    "inputs": [
      "PEM text"
    ],
    "outputs": [
      "Detected block type",
      "DER byte count",
      "ASN.1 tree"
    ],
    "visualizers": [
      "PEM sections",
      "Base64 body viewer",
      "TLV rows"
    ],
    "notes": [
      "Parsing is local and educational; malformed inputs may not match strict certificate parsers."
    ]
  },
  {
    "page": "BigIntegerConverterPage",
    "route": "/algorithms/encoding/big-integer",
    "label": "Big Integer Converter",
    "category": "Encoding Tools",
    "securityStatus": "Educational",
    "intro": "Convert large integers among decimal, hex, binary, and Base64 byte forms.",
    "inputs": [
      "Integer input",
      "Input base",
      "Endian option"
    ],
    "outputs": [
      "Converted values",
      "Byte length"
    ],
    "visualizers": [
      "Base conversion table",
      "Endian byte viewer"
    ],
    "notes": [
      "Leading zeros matter when integers represent fixed-width keys."
    ]
  },
  {
    "page": "X509CertificateViewerPage",
    "route": "/algorithms/pki/x509-certificate-viewer",
    "label": "X.509 Certificate Viewer",
    "category": "Certificates and PKI",
    "securityStatus": "Educational",
    "intro": "Paste a certificate and inspect subject, issuer, validity, public key, signature, and extensions.",
    "inputs": [
      "Certificate PEM"
    ],
    "outputs": [
      "Subject",
      "Issuer",
      "Validity",
      "Extensions"
    ],
    "visualizers": [
      "Certificate field table",
      "Validity timeline"
    ],
    "notes": [
      "Expired or mismatched certificates should not be trusted."
    ]
  },
  {
    "page": "CertificateChainVisualizerPage",
    "route": "/algorithms/pki/certificate-chain",
    "label": "Certificate Chain Visualizer",
    "category": "Certificates and PKI",
    "securityStatus": "Educational",
    "intro": "Connect leaf, intermediate, and root certificates in a trust chain diagram.",
    "inputs": [
      "Leaf certificate",
      "Intermediate certificate",
      "Root certificate"
    ],
    "outputs": [
      "Chain order",
      "Conceptual verification"
    ],
    "visualizers": [
      "Chain graph",
      "Issuer/subject matching table"
    ],
    "notes": [
      "Trust depends on root stores, policies, names, and revocation, not just signatures."
    ]
  },
  {
    "page": "CSRViewerPage",
    "route": "/algorithms/pki/csr-viewer",
    "label": "CSR Viewer",
    "category": "Certificates and PKI",
    "securityStatus": "Educational",
    "intro": "Inspect a certificate signing request's subject, public key, and requested extensions.",
    "inputs": [
      "CSR PEM"
    ],
    "outputs": [
      "Subject",
      "Public key",
      "Attributes"
    ],
    "visualizers": [
      "CSR field table",
      "Signature concept"
    ],
    "notes": [
      "A CSR proves possession of the private key but does not grant trust."
    ]
  },
  {
    "page": "DigitalSignatureWorkbenchPage",
    "route": "/algorithms/pki/digital-signatures",
    "label": "Digital Signature Workbench",
    "category": "Certificates and PKI",
    "icon": "FileKey",
    "securityStatus": "Modern",
    "intro": "Generate a browser-local signing key, create a self-signed identity envelope, sign a message, and verify tamper detection.",
    "inputs": [
      "Message",
      "Signature algorithm",
      "Self-signed subject",
      "Validity days"
    ],
    "outputs": [
      "Signature",
      "Public key JWK",
      "Self-signed envelope",
      "Verification result"
    ],
    "visualizers": [
      "Signing identity fields",
      "Tamper verification",
      "Self-signed trust flow"
    ],
    "notes": [
      "The self-signed envelope is educational and not a standards-compliant X.509 certificate."
    ]
  },
  {
    "page": "SelfSignedCertificateDemoPage",
    "route": "/algorithms/pki/self-signed-demo",
    "label": "Self-Signed Certificate Demo",
    "category": "Certificates and PKI",
    "securityStatus": "Educational",
    "intro": "Show why a certificate signed by its own key needs explicit trust.",
    "inputs": [
      "Subject",
      "Key type",
      "Validity days"
    ],
    "outputs": [
      "Certificate concept",
      "Trust warning"
    ],
    "visualizers": [
      "Self-signing diagram",
      "Trust anchor comparison"
    ],
    "notes": [
      "Self-signed certificates can be useful internally but are not automatically trusted."
    ]
  },
  {
    "page": "FrequencyAnalysisPage",
    "route": "/algorithms/attacks/frequency-analysis",
    "label": "Frequency Analysis",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Educational",
    "intro": "Count letters and compare them to English frequencies for substitution-style ciphers.",
    "inputs": [
      "Ciphertext"
    ],
    "outputs": [
      "Letter counts",
      "Frequency chart",
      "English comparison"
    ],
    "visualizers": [
      "Histogram",
      "Top letters table"
    ],
    "notes": [
      "This demo analyzes local text only and does not target systems."
    ]
  },
  {
    "page": "CaesarBruteForcePage",
    "route": "/algorithms/attacks/caesar-brute-force",
    "label": "Caesar Brute Force",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Educational",
    "intro": "Try all 26 Caesar shifts and rank likely plaintexts.",
    "inputs": [
      "Ciphertext"
    ],
    "outputs": [
      "All candidate shifts",
      "Likely words"
    ],
    "visualizers": [
      "Shift table",
      "Scoring panel"
    ],
    "notes": [
      "Small keyspaces can be exhausted instantly."
    ]
  },
  {
    "page": "VigenereAttackPage",
    "route": "/algorithms/attacks/vigenere-attack",
    "label": "Vigenere Attack Concepts",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Educational",
    "intro": "Estimate key length and examine repeated-key leakage in Vigenere ciphertext.",
    "inputs": [
      "Ciphertext",
      "Max key length"
    ],
    "outputs": [
      "Index of coincidence",
      "Repeated sequence candidates"
    ],
    "visualizers": [
      "IC chart",
      "Key length table"
    ],
    "notes": [
      "This is an educational text analysis demo."
    ]
  },
  {
    "page": "ECBPatternLeakagePage",
    "route": "/algorithms/attacks/ecb-pattern-leakage",
    "label": "ECB Pattern Leakage",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Unsafe",
    "intro": "Detect repeated ciphertext blocks and visualize why ECB leaks structure.",
    "inputs": [
      "Hex ciphertext blocks",
      "Block size"
    ],
    "outputs": [
      "Repeated block groups",
      "Pattern warning"
    ],
    "visualizers": [
      "Colored block grid",
      "Duplicate table"
    ],
    "notes": [
      "ECB leaks equality of plaintext blocks."
    ]
  },
  {
    "page": "PaddingOracleConceptPage",
    "route": "/algorithms/attacks/padding-oracle-concept",
    "label": "Padding Oracle Concept",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Educational",
    "intro": "Explain how different padding errors can leak plaintext in CBC systems.",
    "inputs": [
      "Toy block",
      "Oracle response mode"
    ],
    "outputs": [
      "Conceptual leak",
      "Mitigation checklist"
    ],
    "visualizers": [
      "CBC block diagram",
      "Error channel panel"
    ],
    "notes": [
      "Do not expose distinguishable padding failures."
    ]
  },
  {
    "page": "RSASmallExponentPage",
    "route": "/algorithms/attacks/rsa-small-exponent",
    "label": "RSA Small Exponent Demo",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Educational",
    "intro": "Show why raw low-exponent RSA without padding can be dangerous.",
    "inputs": [
      "Message integer",
      "e",
      "n"
    ],
    "outputs": [
      "Cipher integer",
      "Root check"
    ],
    "visualizers": [
      "m^e size comparison",
      "Padding warning"
    ],
    "notes": [
      "OAEP prevents this class of raw RSA mistake."
    ]
  },
  {
    "page": "RSAFactorizationDemoPage",
    "route": "/algorithms/attacks/rsa-factorization-demo",
    "label": "RSA Factorization Demo",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Educational",
    "intro": "Factor only small educational n values with trial division.",
    "inputs": [
      "Small n",
      "Max divisor"
    ],
    "outputs": [
      "Factors",
      "Trial table"
    ],
    "visualizers": [
      "Division timeline",
      "Infeasibility explanation"
    ],
    "notes": [
      "Real RSA moduli are far beyond trial division."
    ]
  },
  {
    "page": "HashCollisionDemoPage",
    "route": "/algorithms/attacks/hash-collision-demo",
    "label": "Hash Collision Demo",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Educational",
    "intro": "Use tiny toy hashes to show how collisions arise in small output spaces.",
    "inputs": [
      "Message samples",
      "Toy digest bits"
    ],
    "outputs": [
      "Collision pairs",
      "Birthday estimate"
    ],
    "visualizers": [
      "Bucket chart",
      "Birthday bound panel"
    ],
    "notes": [
      "This does not generate real MD5 or SHA collisions."
    ]
  },
  {
    "page": "ReverseHashLabPage",
    "route": "/algorithms/attacks/reserve-hash",
    "label": "Reverse Hash Lab",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Educational",
    "intro": "Run local hash recovery demos with wordlists, bounded brute force, salted hashes, HMAC, PBKDF2, and progress estimates.",
    "inputs": [
      "Target hash",
      "Hash algorithm",
      "Wordlist",
      "Brute force settings",
      "Salt or key"
    ],
    "outputs": [
      "Recovered candidate",
      "Progress",
      "Approximate ETA",
      "Search status"
    ],
    "visualizers": [
      "Progress bar",
      "Keyspace estimate",
      "Hash type catalog"
    ],
    "notes": [
      "Use only for local learning or hashes you are authorized to test."
    ]
  },
  {
    "page": "NonceReuseAttackPage",
    "route": "/algorithms/attacks/nonce-reuse",
    "label": "Nonce Reuse Attack Demo",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Educational",
    "intro": "Show how stream cipher nonce reuse makes C1 XOR C2 equal P1 XOR P2 on local sample data.",
    "inputs": [
      "Plaintext 1",
      "Plaintext 2",
      "Shared keystream"
    ],
    "outputs": [
      "C1 XOR C2",
      "P1 XOR P2"
    ],
    "visualizers": [
      "XOR comparison table",
      "Reuse warning diagram"
    ],
    "notes": [
      "Never reuse stream-cipher nonces with the same key."
    ]
  },
  {
    "page": "XorKnownPlaintextPage",
    "route": "/algorithms/attacks/xor-known-plaintext",
    "label": "XOR Known-Plaintext Attack",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Educational",
    "intro": "Recover a reused XOR keystream prefix from a known plaintext/ciphertext pair and apply it to another ciphertext.",
    "inputs": [
      "Known ciphertext hex",
      "Known plaintext prefix",
      "Target ciphertext hex"
    ],
    "outputs": [
      "Recovered keystream prefix",
      "Target plaintext prefix"
    ],
    "visualizers": [
      "XOR recovery equation",
      "Known plaintext comparison",
      "Target recovery panel"
    ],
    "notes": [
      "Known protocol text or file headers can expose reused stream cipher keystream bytes."
    ]
  },
  {
    "page": "ECDSANonceReuseDemoPage",
    "route": "/algorithms/attacks/ecdsa-nonce-reuse",
    "label": "ECDSA Nonce Reuse Demo",
    "category": "Cryptanalysis and Attacks",
    "securityStatus": "Educational",
    "intro": "Use small toy arithmetic to explain how repeated ECDSA nonce k leaks private keys.",
    "inputs": [
      "Toy q",
      "r",
      "s1",
      "s2",
      "hashes"
    ],
    "outputs": [
      "Recovered k concept",
      "Private key concept"
    ],
    "visualizers": [
      "Formula derivation panel",
      "Two-signature table"
    ],
    "notes": [
      "Do not apply this to real signatures; use deterministic or high-quality nonce generation."
    ]
  },
  {
    "page": "BitcoinHashingPage",
    "route": "/algorithms/blockchain/bitcoin-hashing",
    "label": "Bitcoin Hashing",
    "category": "Blockchain Cryptography",
    "securityStatus": "Educational",
    "intro": "Inspect double SHA-256 style block hashing and target comparison.",
    "inputs": [
      "Header fields",
      "Nonce"
    ],
    "outputs": [
      "Header hash",
      "Target comparison"
    ],
    "visualizers": [
      "Header byte order view",
      "Double-hash flow"
    ],
    "notes": [
      "Mining security depends on network consensus, not just one hash."
    ]
  },
  {
    "page": "MerkleTreePage",
    "route": "/algorithms/blockchain/merkle-tree",
    "label": "Merkle Tree",
    "category": "Blockchain Cryptography",
    "securityStatus": "Educational",
    "intro": "Hash transactions pairwise into a Merkle root and inspect inclusion paths.",
    "inputs": [
      "Leaf values",
      "Hash selector"
    ],
    "outputs": [
      "Merkle root",
      "Proof path"
    ],
    "visualizers": [
      "Tree diagram",
      "Pair hashing table"
    ],
    "notes": [
      "Changing one leaf changes the root path upward."
    ]
  },
  {
    "page": "EthereumSignaturePage",
    "route": "/algorithms/blockchain/ethereum-signature",
    "label": "Ethereum Signature",
    "category": "Blockchain Cryptography",
    "securityStatus": "Educational",
    "intro": "Visualize message hashing and ECDSA-style signature fields used by Ethereum.",
    "inputs": [
      "Message",
      "Private key input",
      "Chain context"
    ],
    "outputs": [
      "r/s/v fields",
      "Recovered address concept"
    ],
    "visualizers": [
      "Keccak hash panel",
      "Signature field table"
    ],
    "notes": [
      "Signing arbitrary messages can authorize unintended actions."
    ]
  },
  {
    "page": "WalletKeyPairPage",
    "route": "/algorithms/blockchain/wallet-key-pair",
    "label": "Wallet Key Pair",
    "category": "Blockchain Cryptography",
    "securityStatus": "Educational",
    "intro": "Show how private keys, public keys, and addresses relate conceptually.",
    "inputs": [
      "Private key hex",
      "Curve choice"
    ],
    "outputs": [
      "Public key",
      "Address concept"
    ],
    "visualizers": [
      "Key derivation flow",
      "Address hashing steps"
    ],
    "notes": [
      "Never paste real wallet private keys into educational tools."
    ]
  },
  {
    "page": "RandomBytesGeneratorPage",
    "route": "/algorithms/tools/random-bytes",
    "label": "Random Bytes Generator",
    "category": "Randomness and Entropy",
    "securityStatus": "Modern",
    "intro": "Generate local random bytes with Web Crypto getRandomValues.",
    "inputs": [
      "Byte count",
      "Output format"
    ],
    "outputs": [
      "Random bytes",
      "Entropy estimate"
    ],
    "visualizers": [
      "Byte grid",
      "Distribution chart"
    ],
    "notes": [
      "Browser CSPRNG output should be kept secret when used as key material."
    ]
  },
  {
    "page": "EntropyAnalyzerPage",
    "route": "/algorithms/tools/entropy-analyzer",
    "label": "Entropy Analyzer",
    "category": "Randomness and Entropy",
    "securityStatus": "Educational",
    "intro": "Estimate symbol distribution and rough Shannon entropy for local input.",
    "inputs": [
      "Sample text or hex"
    ],
    "outputs": [
      "Entropy estimate",
      "Symbol table"
    ],
    "visualizers": [
      "Frequency table",
      "Entropy bar"
    ],
    "notes": [
      "Entropy estimates from small samples are unreliable."
    ]
  },
  {
    "page": "KeyFormatConverterPage",
    "route": "/algorithms/tools/key-format-converter",
    "label": "Key Format Converter",
    "category": "Encoding Tools",
    "securityStatus": "Educational",
    "intro": "Convert keys among raw hex, Base64, PEM-like wrapping, and JWK-style fields.",
    "inputs": [
      "Key bytes",
      "Source format",
      "Target format"
    ],
    "outputs": [
      "Converted key",
      "Length"
    ],
    "visualizers": [
      "Format table",
      "Header/footer viewer"
    ],
    "notes": [
      "Changing format does not change the underlying key security."
    ]
  },
  {
    "page": "AlgorithmComparisonPage",
    "route": "/algorithms/tools/algorithm-comparison",
    "label": "Algorithm Comparison",
    "category": "Benchmark and Comparison",
    "securityStatus": "Educational",
    "intro": "Compare algorithms by purpose, key sizes, status, and browser support.",
    "inputs": [
      "Algorithm filters",
      "Use case"
    ],
    "outputs": [
      "Comparison table",
      "Recommendation notes"
    ],
    "visualizers": [
      "Status matrix",
      "Use-case tabs"
    ],
    "notes": [
      "Protocol context matters more than picking a famous primitive."
    ]
  },
  {
    "page": "BenchmarkPage",
    "route": "/algorithms/tools/benchmark",
    "label": "Browser Benchmark",
    "category": "Benchmark and Comparison",
    "securityStatus": "Educational",
    "intro": "Run local browser-only timing tests and chart throughput by input size.",
    "inputs": [
      "Algorithm selector",
      "Input size",
      "Iterations"
    ],
    "outputs": [
      "Time taken",
      "Throughput",
      "Chart"
    ],
    "visualizers": [
      "Timing bars",
      "Device variability warning"
    ],
    "notes": [
      "Browser benchmarks vary by device, tab state, and power settings."
    ]
  },
  {
    "page": "SavedExperimentsPage",
    "route": "/algorithms/tools/saved-experiments",
    "label": "Saved Experiments",
    "category": "Saved Experiments",
    "securityStatus": "Educational",
    "intro": "Browse experiments saved locally in IndexedDB and export or delete them.",
    "inputs": [
      "Algorithm filter",
      "Search saved title"
    ],
    "outputs": [
      "Experiment list",
      "Selected JSON"
    ],
    "visualizers": [
      "IndexedDB table",
      "Export controls"
    ],
    "notes": [
      "Saved data stays in this browser profile unless exported."
    ]
  },
  {
    "page": "ExportCenterPage",
    "route": "/algorithms/tools/export-center",
    "label": "Export Center",
    "category": "Export Center",
    "securityStatus": "Educational",
    "intro": "Export current outputs, saved experiments, Markdown explanations, JSON state, and CSV step tables.",
    "inputs": [
      "Export type",
      "Scope",
      "Filename"
    ],
    "outputs": [
      "Download payload",
      "Preview"
    ],
    "visualizers": [
      "Export format tabs",
      "Saved experiment selector"
    ],
    "notes": [
      "Review exports before sharing because they may contain keys or plaintext."
    ]
  }
];

export const findAlgorithm = (route: string) => algorithmMetadata.find((item) => item.route === route);
