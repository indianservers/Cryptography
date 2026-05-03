import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const write = (file, content) => {
  const target = path.join(root, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, `${content.trimStart()}\n`);
};

const pagePath = (key) => {
  const map = {
    HomePage: "src/pages/HomePage.tsx",
    NotFoundPage: "src/pages/NotFoundPage.tsx",
    CaesarCipherPage: "src/pages/algorithms/classical/CaesarCipherPage.tsx",
    ROT13Page: "src/pages/algorithms/classical/ROT13Page.tsx",
    AtbashCipherPage: "src/pages/algorithms/classical/AtbashCipherPage.tsx",
    AffineCipherPage: "src/pages/algorithms/classical/AffineCipherPage.tsx",
    VigenereCipherPage: "src/pages/algorithms/classical/VigenereCipherPage.tsx",
    PlayfairCipherPage: "src/pages/algorithms/classical/PlayfairCipherPage.tsx",
    HillCipherPage: "src/pages/algorithms/classical/HillCipherPage.tsx",
    RailFenceCipherPage: "src/pages/algorithms/classical/RailFenceCipherPage.tsx",
    ColumnarTranspositionPage: "src/pages/algorithms/classical/ColumnarTranspositionPage.tsx",
    SubstitutionCipherPage: "src/pages/algorithms/classical/SubstitutionCipherPage.tsx",
    AESPage: "src/pages/algorithms/symmetric/aes/AESPage.tsx",
    AES128StepPage: "src/pages/algorithms/symmetric/aes/AES128StepPage.tsx",
    AES192StepPage: "src/pages/algorithms/symmetric/aes/AES192StepPage.tsx",
    AES256StepPage: "src/pages/algorithms/symmetric/aes/AES256StepPage.tsx",
    AESSBoxExplorerPage: "src/pages/algorithms/symmetric/aes/AESSBoxExplorerPage.tsx",
    AESKeyExpansionPage: "src/pages/algorithms/symmetric/aes/AESKeyExpansionPage.tsx",
    AESMixColumnsPage: "src/pages/algorithms/symmetric/aes/AESMixColumnsPage.tsx",
    AESModesPage: "src/pages/algorithms/symmetric/aes/AESModesPage.tsx",
    DESPage: "src/pages/algorithms/symmetric/des/DESPage.tsx",
    DESFullStepPage: "src/pages/algorithms/symmetric/des/DESFullStepPage.tsx",
    DESSBoxExplorerPage: "src/pages/algorithms/symmetric/des/DESSBoxExplorerPage.tsx",
    DESKeySchedulePage: "src/pages/algorithms/symmetric/des/DESKeySchedulePage.tsx",
    TripleDESPage: "src/pages/algorithms/symmetric/des/TripleDESPage.tsx",
    BlowfishPage: "src/pages/algorithms/symmetric/BlowfishPage.tsx",
    TwofishPage: "src/pages/algorithms/symmetric/TwofishPage.tsx",
    SerpentPage: "src/pages/algorithms/symmetric/SerpentPage.tsx",
    IDEAPage: "src/pages/algorithms/symmetric/IDEAPage.tsx",
    RC5Page: "src/pages/algorithms/symmetric/RC5Page.tsx",
    RC6Page: "src/pages/algorithms/symmetric/RC6Page.tsx",
    CamelliaPage: "src/pages/algorithms/symmetric/CamelliaPage.tsx",
    RC4Page: "src/pages/algorithms/stream/RC4Page.tsx",
    ChaCha20Page: "src/pages/algorithms/stream/ChaCha20Page.tsx",
    Salsa20Page: "src/pages/algorithms/stream/Salsa20Page.tsx",
    OneTimePadPage: "src/pages/algorithms/stream/OneTimePadPage.tsx",
    LFSRPage: "src/pages/algorithms/stream/LFSRPage.tsx",
    RSAOverviewPage: "src/pages/algorithms/asymmetric/rsa/RSAOverviewPage.tsx",
    RSAKeyGenerationPage: "src/pages/algorithms/asymmetric/rsa/RSAKeyGenerationPage.tsx",
    RSAEncryptionPage: "src/pages/algorithms/asymmetric/rsa/RSAEncryptionPage.tsx",
    RSADecryptionPage: "src/pages/algorithms/asymmetric/rsa/RSADecryptionPage.tsx",
    RSASignaturePage: "src/pages/algorithms/asymmetric/rsa/RSASignaturePage.tsx",
    RSAPaddingPage: "src/pages/algorithms/asymmetric/rsa/RSAPaddingPage.tsx",
    ElGamalPage: "src/pages/algorithms/asymmetric/ElGamalPage.tsx",
    RabinPage: "src/pages/algorithms/asymmetric/RabinPage.tsx",
    DiffieHellmanPage: "src/pages/algorithms/asymmetric/DiffieHellmanPage.tsx",
    ECCOverviewPage: "src/pages/algorithms/ecc/ECCOverviewPage.tsx",
    ECCCurveExplorerPage: "src/pages/algorithms/ecc/ECCCurveExplorerPage.tsx",
    ECDHPage: "src/pages/algorithms/ecc/ECDHPage.tsx",
    ECDSAPage: "src/pages/algorithms/ecc/ECDSAPage.tsx",
    Ed25519Page: "src/pages/algorithms/ecc/Ed25519Page.tsx",
    X25519Page: "src/pages/algorithms/ecc/X25519Page.tsx",
    MD5Page: "src/pages/algorithms/hash/MD5Page.tsx",
    SHA1Page: "src/pages/algorithms/hash/SHA1Page.tsx",
    SHA2Page: "src/pages/algorithms/hash/SHA2Page.tsx",
    SHA256StepPage: "src/pages/algorithms/hash/SHA256StepPage.tsx",
    SHA3Page: "src/pages/algorithms/hash/SHA3Page.tsx",
    KeccakSpongePage: "src/pages/algorithms/hash/KeccakSpongePage.tsx",
    BLAKE2Page: "src/pages/algorithms/hash/BLAKE2Page.tsx",
    BLAKE3Page: "src/pages/algorithms/hash/BLAKE3Page.tsx",
    RIPEMD160Page: "src/pages/algorithms/hash/RIPEMD160Page.tsx",
    HMACPage: "src/pages/algorithms/mac/HMACPage.tsx",
    CMACPage: "src/pages/algorithms/mac/CMACPage.tsx",
    Poly1305Page: "src/pages/algorithms/mac/Poly1305Page.tsx",
    GMACPage: "src/pages/algorithms/mac/GMACPage.tsx",
    PBKDF2Page: "src/pages/algorithms/kdf/PBKDF2Page.tsx",
    ScryptPage: "src/pages/algorithms/kdf/ScryptPage.tsx",
    Argon2Page: "src/pages/algorithms/kdf/Argon2Page.tsx",
    HKDFPage: "src/pages/algorithms/kdf/HKDFPage.tsx",
    BcryptPage: "src/pages/algorithms/kdf/BcryptPage.tsx",
    ECBModePage: "src/pages/algorithms/modes/ECBModePage.tsx",
    CBCModePage: "src/pages/algorithms/modes/CBCModePage.tsx",
    CFBModePage: "src/pages/algorithms/modes/CFBModePage.tsx",
    OFBModePage: "src/pages/algorithms/modes/OFBModePage.tsx",
    CTRModePage: "src/pages/algorithms/modes/CTRModePage.tsx",
    GCMModePage: "src/pages/algorithms/modes/GCMModePage.tsx",
    XTSModePage: "src/pages/algorithms/modes/XTSModePage.tsx",
    PKCS7PaddingPage: "src/pages/algorithms/padding/PKCS7PaddingPage.tsx",
    ANSIX923PaddingPage: "src/pages/algorithms/padding/ANSIX923PaddingPage.tsx",
    ISO7816PaddingPage: "src/pages/algorithms/padding/ISO7816PaddingPage.tsx",
    ZeroPaddingPage: "src/pages/algorithms/padding/ZeroPaddingPage.tsx",
    OAEPPage: "src/pages/algorithms/padding/OAEPPage.tsx",
    PSSPage: "src/pages/algorithms/padding/PSSPage.tsx",
    Base64ToolPage: "src/pages/algorithms/encoding/Base64ToolPage.tsx",
    HexToolPage: "src/pages/algorithms/encoding/HexToolPage.tsx",
    BinaryToolPage: "src/pages/algorithms/encoding/BinaryToolPage.tsx",
    ASCIIUnicodePage: "src/pages/algorithms/encoding/ASCIIUnicodePage.tsx",
    PEMDERViewerPage: "src/pages/algorithms/encoding/PEMDERViewerPage.tsx",
    BigIntegerConverterPage: "src/pages/algorithms/encoding/BigIntegerConverterPage.tsx",
    X509CertificateViewerPage: "src/pages/algorithms/pki/X509CertificateViewerPage.tsx",
    CertificateChainVisualizerPage: "src/pages/algorithms/pki/CertificateChainVisualizerPage.tsx",
    CSRViewerPage: "src/pages/algorithms/pki/CSRViewerPage.tsx",
    SelfSignedCertificateDemoPage: "src/pages/algorithms/pki/SelfSignedCertificateDemoPage.tsx",
    FrequencyAnalysisPage: "src/pages/algorithms/attacks/FrequencyAnalysisPage.tsx",
    CaesarBruteForcePage: "src/pages/algorithms/attacks/CaesarBruteForcePage.tsx",
    VigenereAttackPage: "src/pages/algorithms/attacks/VigenereAttackPage.tsx",
    ECBPatternLeakagePage: "src/pages/algorithms/attacks/ECBPatternLeakagePage.tsx",
    PaddingOracleConceptPage: "src/pages/algorithms/attacks/PaddingOracleConceptPage.tsx",
    RSASmallExponentPage: "src/pages/algorithms/attacks/RSASmallExponentPage.tsx",
    RSAFactorizationDemoPage: "src/pages/algorithms/attacks/RSAFactorizationDemoPage.tsx",
    HashCollisionDemoPage: "src/pages/algorithms/attacks/HashCollisionDemoPage.tsx",
    NonceReuseAttackPage: "src/pages/algorithms/attacks/NonceReuseAttackPage.tsx",
    ECDSANonceReuseDemoPage: "src/pages/algorithms/attacks/ECDSANonceReuseDemoPage.tsx",
    BitcoinHashingPage: "src/pages/algorithms/blockchain/BitcoinHashingPage.tsx",
    MerkleTreePage: "src/pages/algorithms/blockchain/MerkleTreePage.tsx",
    EthereumSignaturePage: "src/pages/algorithms/blockchain/EthereumSignaturePage.tsx",
    WalletKeyPairPage: "src/pages/algorithms/blockchain/WalletKeyPairPage.tsx",
    RandomBytesGeneratorPage: "src/pages/algorithms/tools/RandomBytesGeneratorPage.tsx",
    EntropyAnalyzerPage: "src/pages/algorithms/tools/EntropyAnalyzerPage.tsx",
    KeyFormatConverterPage: "src/pages/algorithms/tools/KeyFormatConverterPage.tsx",
    AlgorithmComparisonPage: "src/pages/algorithms/tools/AlgorithmComparisonPage.tsx",
    BenchmarkPage: "src/pages/algorithms/tools/BenchmarkPage.tsx",
    SavedExperimentsPage: "src/pages/algorithms/tools/SavedExperimentsPage.tsx",
    ExportCenterPage: "src/pages/algorithms/tools/ExportCenterPage.tsx",
  };
  return map[key];
};

const pages = [
  ["CaesarCipherPage", "/algorithms/classical/caesar-cipher", "Caesar Cipher", "Classical Cryptography", "Educational", "Rotate each alphabet letter by a fixed shift and inspect the mapping that makes the cipher easy to break.", ["Plaintext", "Shift 0-25", "Alphabet"], ["Ciphertext", "All brute force shifts", "Frequency chart"], ["Alphabet mapping table", "Character shift ledger", "Brute force ladder"], ["Modulo arithmetic makes Caesar simple, while frequency analysis makes it fragile."]],
  ["ROT13Page", "/algorithms/classical/rot13", "ROT13", "Classical Cryptography", "Unsafe", "A fixed Caesar shift of 13 for lightweight text obfuscation, not security.", ["Input text", "Preserve punctuation"], ["ROT13 output", "Round-trip check"], ["A-to-N paired alphabet", "Self-inverse transform"], ["Applying ROT13 twice returns the original text."]],
  ["AtbashCipherPage", "/algorithms/classical/atbash", "Atbash Cipher", "Classical Cryptography", "Unsafe", "Mirror the alphabet so A maps to Z, B maps to Y, and every substitution is fixed.", ["Plaintext", "Alphabet variant"], ["Mirrored ciphertext", "Mapping table"], ["Alphabet reflection strip", "Letter substitution trace"], ["The mapping has no secret key, so secrecy depends only on obscurity."]],
  ["AffineCipherPage", "/algorithms/classical/affine-cipher", "Affine Cipher", "Classical Cryptography", "Educational", "Transform letters with E(x) = ax + b mod 26 and require a to be invertible.", ["Plaintext", "Multiplier a", "Offset b"], ["Ciphertext", "Inverse key", "GCD validation"], ["Modulo line", "Inverse calculation", "Per-letter formula table"], ["Only multipliers coprime with 26 can decrypt every letter."]],
  ["VigenereCipherPage", "/algorithms/classical/vigenere-cipher", "Vigenere Cipher", "Classical Cryptography", "Educational", "Use a repeated keyword to apply a different Caesar shift to each character.", ["Plaintext", "Keyword", "Alphabet"], ["Ciphertext", "Repeated key", "Character table"], ["Repeated key grid", "Tabula recta sample", "Per-character transformation"], ["Repeating keys leave periodic patterns that Kasiski-style analysis can exploit."]],
  ["PlayfairCipherPage", "/algorithms/classical/playfair-cipher", "Playfair Cipher", "Classical Cryptography", "Educational", "Encrypt digraphs using a 5x5 keyword square and row, column, or rectangle rules.", ["Keyword", "Plaintext digraphs", "I/J merge"], ["Cipher digraphs", "Prepared pairs"], ["5x5 matrix", "Digraph preparation", "Rule table"], ["Inserted filler letters alter the message shape and must be handled consistently."]],
  ["HillCipherPage", "/algorithms/classical/hill-cipher", "Hill Cipher", "Classical Cryptography", "Educational", "Multiply letter vectors by an invertible key matrix modulo 26.", ["Matrix size", "Key matrix", "Plaintext blocks"], ["Cipher vectors", "Determinant", "Inverse validation"], ["Matrix multiplication board", "Determinant modulo 26", "Block vector trace"], ["A non-invertible matrix loses information and cannot be used for decryption."]],
  ["RailFenceCipherPage", "/algorithms/classical/rail-fence", "Rail Fence Cipher", "Classical Cryptography", "Educational", "Write characters along a zig-zag rail pattern and read rows to transpose the message.", ["Plaintext", "Rail count"], ["Ciphertext", "Rail rows"], ["Zig-zag rail grid", "Readout order"], ["Transposition hides positions but not the original letters."]],
  ["ColumnarTranspositionPage", "/algorithms/classical/columnar-transposition", "Columnar Transposition", "Classical Cryptography", "Educational", "Place text in columns under a keyword and read columns by sorted key order.", ["Plaintext", "Keyword", "Padding character"], ["Ciphertext", "Column read order"], ["Column grid", "Keyword ordering table"], ["Repeated keyword letters need a stable tie-breaking rule."]],
  ["SubstitutionCipherPage", "/algorithms/classical/substitution-cipher", "Monoalphabetic Substitution", "Classical Cryptography", "Unsafe", "Replace every plaintext letter with a fixed shuffled alphabet.", ["Plaintext", "Substitution alphabet"], ["Ciphertext", "Letter frequency"], ["Mapping strip", "Frequency comparison"], ["Single-letter frequencies and common patterns reveal the substitution."]],

  ["AESPage", "/algorithms/symmetric/aes", "AES Workbench", "Symmetric Cryptography", "Modern", "Explore AES block encryption, Web Crypto backed modes, and a custom educational round visualizer.", ["Plaintext", "Key", "IV or nonce", "Mode", "Padding", "Key size"], ["Ciphertext", "Input block in text, hex, binary, matrix", "Avalanche comparison"], ["4x4 state matrix", "Key expansion preview", "AddRoundKey, SubBytes, ShiftRows, MixColumns timeline"], ["AES is a modern block cipher; prefer AEAD modes such as GCM for authenticated encryption."]],
  ["AES128StepPage", "/algorithms/symmetric/aes-128-step", "AES-128 Step Visualizer", "Block Ciphers", "Educational", "Walk byte by byte through AES-128 from the initial state to the final round without MixColumns.", ["16-byte plaintext block", "128-bit key", "Round selector", "Step selector"], ["Final ciphertext", "Round key", "Changed byte list"], ["Initial AddRoundKey", "Rounds 1-9 four-step table", "Round 10 three-step table", "Changed-byte matrix"], ["This visualizer is educational and exposes intermediate state that real software must protect."]],
  ["AES192StepPage", "/algorithms/symmetric/aes-192-step", "AES-192 Step Visualizer", "Block Ciphers", "Educational", "Study the 12-round AES variant with a 192-bit key schedule.", ["16-byte block", "192-bit key", "Round selector"], ["State after selected round", "Expanded key words"], ["Nk=6 key expansion", "12-round timeline"], ["AES-192 is less common than AES-128 and AES-256 but remains modern."]],
  ["AES256StepPage", "/algorithms/symmetric/aes-256-step", "AES-256 Step Visualizer", "Block Ciphers", "Educational", "Inspect AES-256 with its 14 rounds and extra key schedule substitution step.", ["16-byte block", "256-bit key", "Round selector"], ["State matrix", "Round key words"], ["Nk=8 expansion", "14-round timeline", "Extra SubWord marker"], ["More key bits do not remove the need for correct modes and nonce handling."]],
  ["AESSBoxExplorerPage", "/algorithms/symmetric/aes-sbox", "AES S-Box Explorer", "Block Ciphers", "Educational", "Use the real AES S-box and inverse S-box to inspect byte substitution by row and column.", ["Hex byte", "Forward or inverse table"], ["Selected output byte", "Row nibble", "Column nibble"], ["16x16 S-box grid", "Highlighted high/low nibble", "GF(2^8) inverse and affine transform panel"], ["The S-box is public and fixed; security comes from the key and the round structure."]],
  ["AESKeyExpansionPage", "/algorithms/symmetric/aes-key-expansion", "AES Key Expansion", "Block Ciphers", "Educational", "Follow RotWord, SubWord, Rcon, and XOR operations that create AES round keys.", ["AES key", "Key size"], ["Round keys", "Word table"], ["Expansion word ledger", "Rcon timeline"], ["Round keys are derived secrets and should not be logged in production."]],
  ["AESMixColumnsPage", "/algorithms/symmetric/aes-mix-columns", "AES MixColumns", "Block Ciphers", "Educational", "Multiply each AES state column by the Rijndael matrix in GF(2^8).", ["State column bytes"], ["Mixed column", "GF products"], ["Column matrix", "Finite-field multiplication table"], ["MixColumns diffuses one byte change across a full column."]],
  ["AESModesPage", "/algorithms/symmetric/aes-modes", "AES Modes", "Modes of Operation", "Modern", "Compare how AES block encryption is wrapped by ECB, CBC, CFB, OFB, CTR, and GCM.", ["Plaintext blocks", "Key", "IV or nonce", "Mode"], ["Block flow output", "Authentication tag when available"], ["Mode flow diagram", "Nonce and IV rules", "Repeated block detector"], ["Never reuse a nonce with GCM or CTR under the same key."]],
  ["DESPage", "/algorithms/symmetric/des", "DES Workbench", "Symmetric Cryptography", "Deprecated", "Inspect the 64-bit DES Feistel cipher and why its 56-bit effective key is obsolete.", ["64-bit block", "64-bit key with parity", "Encrypt/decrypt"], ["Ciphertext", "L0/R0 split", "Round summaries"], ["Initial permutation", "16 Feistel rounds", "Expansion, S-boxes, P permutation, final permutation"], ["DES is deprecated because exhaustive search is practical against its small key space."]],
  ["DESFullStepPage", "/algorithms/symmetric/des-full-step", "DES Full Step Visualizer", "Block Ciphers", "Deprecated", "Step through DES from IP to FP with every Feistel round expanded.", ["64-bit plaintext", "64-bit DES key", "Round selector"], ["Round L/R values", "Feistel function output", "Cipher block"], ["IP table", "E expansion", "XOR with subkey", "S1-S8 outputs", "P permutation", "Swap"], ["The Feistel structure decrypts by applying round keys in reverse order."]],
  ["DESSBoxExplorerPage", "/algorithms/symmetric/des-sbox", "DES S-Box Explorer", "Block Ciphers", "Educational", "Select a DES S-box and map a 6-bit input to a 4-bit output using real DES tables.", ["S-box S1-S8", "6-bit input"], ["4-bit output", "Row from outer bits", "Column from inner bits"], ["4x16 S-box grid", "Row/column highlighter", "Binary output panel"], ["DES S-boxes are fixed nonlinear components that compress 48 Feistel bits to 32 bits."]],
  ["DESKeySchedulePage", "/algorithms/symmetric/des-key-schedule", "DES Key Schedule", "Block Ciphers", "Deprecated", "Generate the 16 DES round keys with PC-1, left shifts, and PC-2.", ["64-bit key", "Round selector"], ["C and D halves", "48-bit round keys"], ["PC-1 permutation", "Shift schedule", "PC-2 table"], ["Parity bits are dropped; the effective DES key length is 56 bits."]],
  ["TripleDESPage", "/algorithms/symmetric/triple-des", "Triple DES", "Symmetric Cryptography", "Legacy", "Chain DES encrypt-decrypt-encrypt stages to extend practical key length.", ["Plaintext block", "Keying option", "K1/K2/K3"], ["EDE output", "Stage trace"], ["DES stage pipeline", "Meet-in-the-middle note"], ["3DES is legacy and should be replaced by AES where possible."]],
  ["BlowfishPage", "/algorithms/symmetric/blowfish", "Blowfish", "Symmetric Cryptography", "Legacy", "Explore a 64-bit block cipher with expensive key setup and variable-length keys.", ["Plaintext block", "Variable key"], ["Cipher block", "P-array summary"], ["Feistel diagram", "Key setup outline"], ["The 64-bit block size is too small for large modern data volumes."]],
  ["TwofishPage", "/algorithms/symmetric/twofish", "Twofish", "Symmetric Cryptography", "Modern", "Inspect the AES finalist with key-dependent S-boxes and an MDS matrix.", ["Plaintext block", "128/192/256-bit key"], ["Cipher block", "Round trace"], ["Whitening keys", "g function", "Feistel-like rounds"], ["Twofish is sound but less commonly available in browser-native APIs."]],
  ["SerpentPage", "/algorithms/symmetric/serpent", "Serpent", "Symmetric Cryptography", "Modern", "Visualize the conservative AES finalist with 32 S-box based rounds.", ["Plaintext block", "Key size"], ["Cipher block", "Round state"], ["Bitslice S-box lane", "Linear transform"], ["Serpent favors a high security margin over raw speed."]],
  ["IDEAPage", "/algorithms/symmetric/idea", "IDEA", "Symmetric Cryptography", "Legacy", "Combine XOR, modular addition, and modular multiplication in IDEA rounds.", ["64-bit block", "128-bit key"], ["Cipher block", "Subkey list"], ["Mixed operation round", "Modulo 65537 multiplication"], ["IDEA is historically important but uncommon in new systems."]],
  ["RC5Page", "/algorithms/symmetric/rc5", "RC5", "Symmetric Cryptography", "Legacy", "Study a parameterized cipher built from data-dependent rotations.", ["Word size", "Rounds", "Key"], ["Cipher words", "Rotation trace"], ["ARX operation panel", "Round word table"], ["Parameter choices matter; small round counts are educational only."]],
  ["RC6Page", "/algorithms/symmetric/rc6", "RC6", "Symmetric Cryptography", "Legacy", "Extend RC5 into four registers with multiplication-driven rotations.", ["128-bit block", "Key", "Round count"], ["Cipher block", "Register trace"], ["A/B/C/D lane view", "Rotation schedule"], ["RC6 was an AES finalist but is rarely a default choice today."]],
  ["CamelliaPage", "/algorithms/symmetric/camellia", "Camellia", "Symmetric Cryptography", "Modern", "Visualize Camellia's Feistel network, FL layers, and S-box substitutions.", ["Plaintext block", "Key size"], ["Cipher block", "Subkey layers"], ["Feistel rounds", "FL/FL-inverse markers"], ["Camellia remains standardized and useful where supported."]],

  ["RC4Page", "/algorithms/stream/rc4", "RC4", "Stream Ciphers", "Deprecated", "Inspect RC4's KSA and PRGA and the biases that made it unsafe.", ["Key", "Plaintext"], ["Keystream", "Ciphertext"], ["S array shuffle", "i/j PRGA trace"], ["RC4 must not be used for modern confidentiality."]],
  ["ChaCha20Page", "/algorithms/stream/chacha20", "ChaCha20", "Stream Ciphers", "Modern", "Visualize the 4x4 ChaCha state, quarter rounds, and plaintext XOR.", ["256-bit key", "96-bit nonce", "Counter", "Plaintext"], ["Keystream block", "Ciphertext"], ["4x4 state matrix", "Column rounds", "Diagonal rounds", "Quarter round detail"], ["Nonce reuse with the same key reveals relationships between plaintexts."]],
  ["Salsa20Page", "/algorithms/stream/salsa20", "Salsa20", "Stream Ciphers", "Modern", "Study the ARX stream cipher family that inspired ChaCha.", ["Key", "Nonce", "Counter"], ["Keystream", "XOR output"], ["State matrix", "Double-round flow"], ["Salsa20 uses addition, rotation, and XOR, avoiding S-box tables."]],
  ["OneTimePadPage", "/algorithms/stream/one-time-pad", "One-Time Pad", "Stream Ciphers", "Educational", "XOR a message with truly random key material of equal length.", ["Plaintext", "Pad bytes"], ["Ciphertext", "Recovered plaintext"], ["XOR byte table", "Pad length checker"], ["The pad must be random, secret, as long as the message, and never reused."]],
  ["LFSRPage", "/algorithms/stream/lfsr", "LFSR", "Stream Ciphers", "Educational", "Generate toy keystream bits from a linear feedback shift register.", ["Seed bits", "Tap positions", "Clock count"], ["Generated bits", "Period estimate"], ["Shift register cells", "Feedback XOR trace"], ["Plain LFSRs are linear and need nonlinear combining for real ciphers."]],

  ["RSAOverviewPage", "/algorithms/asymmetric/rsa", "RSA Overview", "Public Key Cryptography", "Modern", "Connect RSA's trapdoor arithmetic to encryption, signatures, padding, and key sizes.", ["Message integer", "Public exponent", "Modulus"], ["Operation summary", "Key relationship"], ["m^e mod n flow", "Key pair diagram", "Padding boundary"], ["Raw RSA is unsafe; practical RSA needs OAEP for encryption or PSS for signatures."]],
  ["RSAKeyGenerationPage", "/algorithms/asymmetric/rsa-key-generation", "RSA Key Generation", "Public Key Cryptography", "Educational", "Use small educational primes to compute n, phi(n), e, and d.", ["p prime", "q prime", "public exponent e"], ["n = p*q", "phi(n)", "gcd(e, phi)", "d inverse", "public/private keys"], ["Prime checks", "Totient formula", "Extended Euclid table"], ["Toy primes are for visualization only and are catastrophically small for real keys."]],
  ["RSAEncryptionPage", "/algorithms/asymmetric/rsa-encryption", "RSA Encryption", "Public Key Cryptography", "Educational", "Raise a message integer to e modulo n and inspect square-and-multiply.", ["Message", "e", "n"], ["Cipher integer", "Modular exponent table"], ["Binary exponent ladder", "m^e mod n trace"], ["Messages must be padded and smaller than n before real RSA encryption."]],
  ["RSADecryptionPage", "/algorithms/asymmetric/rsa-decryption", "RSA Decryption", "Public Key Cryptography", "Educational", "Recover m = c^d mod n and compare direct and CRT-style thinking.", ["Cipher integer", "private exponent d", "modulus n"], ["Recovered message integer", "Exponentiation table"], ["Square-and-multiply trace", "CRT concept panel"], ["Private exponent operations must be protected against timing leaks."]],
  ["RSASignaturePage", "/algorithms/asymmetric/rsa-signature", "RSA Signature", "Public Key Cryptography", "Modern", "Hash a message and sign it with RSA-PSS or compare legacy PKCS#1 v1.5 structure.", ["Message", "Hash selector", "Private key fields", "Padding mode"], ["Signature integer", "Verify result"], ["Hash-to-encoded-message", "PSS salt panel", "Verification exponentiation"], ["Never sign raw messages; sign a well-defined encoded hash."]],
  ["RSAPaddingPage", "/algorithms/asymmetric/rsa-padding", "RSA Padding", "Public Key Cryptography", "Modern", "Compare OAEP and PSS encodings that make RSA safe in practice.", ["Message", "Label", "Salt or seed"], ["Encoded block", "Masking components"], ["MGF1 flow", "masked DB", "masked seed"], ["Padding validation errors must avoid oracle behavior."]],
  ["ElGamalPage", "/algorithms/asymmetric/elgamal", "ElGamal", "Public Key Cryptography", "Educational", "Use a fresh random k to encrypt through discrete logarithm arithmetic.", ["p", "g", "public key y", "message", "ephemeral k"], ["c1", "c2", "shared secret"], ["Exponentiation flow", "Ephemeral key warning"], ["Reusing k breaks ElGamal confidentiality."]],
  ["RabinPage", "/algorithms/asymmetric/rabin", "Rabin Cryptosystem", "Public Key Cryptography", "Educational", "Square a message modulo n and recover four square roots during decryption.", ["p", "q", "message"], ["Cipher square", "Candidate roots"], ["Modulo square map", "CRT recombination"], ["Rabin needs redundancy or padding to identify the correct plaintext."]],
  ["DiffieHellmanPage", "/algorithms/asymmetric/diffie-hellman", "Diffie-Hellman Key Exchange", "Public Key Cryptography", "Educational", "Let Alice and Bob derive the same secret over a finite-field group while an observer sees only public values.", ["p prime", "g generator", "Alice private a", "Bob private b"], ["A = g^a mod p", "B = g^b mod p", "shared secret"], ["Two-party exchange diagram", "Modular exponentiation tables", "MITM warning panel"], ["Unauthenticated Diffie-Hellman is vulnerable to man-in-the-middle substitution."]],

  ["ECCOverviewPage", "/algorithms/ecc", "ECC Overview", "Elliptic Curve Cryptography", "Modern", "Explore finite-field curves, point addition, doubling, scalar multiplication, and why ECC keys are compact.", ["Curve equation", "Field prime", "Base point"], ["Point multiples", "Key pair concept"], ["Curve equation panel", "Point addition formulas", "RSA comparison table"], ["Curve and parameter validation are essential; do not invent production curves."]],
  ["ECCCurveExplorerPage", "/algorithms/ecc/curve-explorer", "ECC Curve Explorer", "Elliptic Curve Cryptography", "Educational", "Plot toy elliptic curve points over a finite field and perform group operations.", ["a", "b", "p", "Point P", "Point Q", "Scalar k"], ["P+Q", "2P", "kP"], ["Finite-field point plot", "Slope formula table"], ["Small fields make patterns visible but are not secure."]],
  ["ECDHPage", "/algorithms/ecc/ecdh", "ECDH", "Elliptic Curve Cryptography", "Modern", "Derive a shared point by multiplying public keys by private scalars.", ["Curve", "Alice scalar", "Bob scalar"], ["Public points", "Shared point", "Derived key"], ["Scalar multiplication ladder", "Exchange diagram"], ["Validate peer public keys before deriving secrets."]],
  ["ECDSAPage", "/algorithms/ecc/ecdsa", "ECDSA", "Elliptic Curve Cryptography", "Modern", "Sign a message with elliptic-curve arithmetic and inspect r, s, and verification.", ["Private key", "Public key", "Message", "Hash", "Nonce k"], ["r value", "s value", "Verify result"], ["Nonce-to-point step", "Signature formula table", "Nonce reuse warning panel"], ["Reusing or biasing nonce k can reveal the private key."]],
  ["Ed25519Page", "/algorithms/ecc/ed25519", "Ed25519", "Elliptic Curve Cryptography", "Modern", "Study deterministic Edwards-curve signatures with compact keys and signatures.", ["Seed", "Message"], ["Public key", "Signature", "Verify result"], ["Hash-derived nonce", "Edwards point operation outline"], ["Use vetted libraries or Web Crypto support where available."]],
  ["X25519Page", "/algorithms/ecc/x25519", "X25519", "Elliptic Curve Cryptography", "Modern", "Visualize Montgomery-ladder key agreement over Curve25519.", ["Private scalar", "Peer public key"], ["Shared secret", "Clamped scalar"], ["Montgomery ladder sketch", "Scalar clamping panel"], ["X25519 is for key agreement, not signatures."]],

  ["MD5Page", "/algorithms/hash/md5", "MD5", "Hash Functions", "Deprecated", "Compute and visualize MD5's Merkle-Damgard style rounds while flagging its broken collision resistance.", ["Message", "Output format"], ["MD5 digest", "Round words"], ["Four round functions", "512-bit block split"], ["MD5 is broken for signatures, certificates, and integrity against attackers."]],
  ["SHA1Page", "/algorithms/hash/sha1", "SHA-1", "Hash Functions", "Deprecated", "Inspect SHA-1's compression structure and its collision-risk warning.", ["Message", "Output format"], ["SHA-1 digest", "Word schedule"], ["80-round timeline", "Collision warning panel"], ["SHA-1 should be replaced by SHA-256 or SHA-3 families."]],
  ["SHA2Page", "/algorithms/hash/sha2", "SHA-2 Family", "Hash Functions", "Modern", "Compare SHA-224, SHA-256, SHA-384, and SHA-512 digest variants.", ["Message", "Variant selector"], ["Digest", "Block size", "Word size"], ["Family comparison table", "Compression function overview"], ["Choose digest length based on security target and protocol requirements."]],
  ["SHA256StepPage", "/algorithms/hash/sha-256-step", "SHA-256 Step Visualizer", "Hash Functions", "Modern", "Follow UTF-8 bytes through padding, message schedule, 64 constants, and compression rounds.", ["Message", "Avalanche toggle"], ["Final digest", "Message schedule", "Working variables a-h"], ["Padding block", "K[0..63] table", "Ch/Maj/Sigma panels", "64-round compression timeline"], ["A tiny input change should flip roughly half the digest bits."]],
  ["SHA3Page", "/algorithms/hash/sha3", "SHA-3", "Hash Functions", "Modern", "Visualize the sponge construction that absorbs, permutes, and squeezes output.", ["Message", "Digest size"], ["SHA-3 digest", "Rate/capacity"], ["Absorb phase", "Keccak-f permutation", "Squeeze phase"], ["SHA-3 is structurally different from SHA-2 and useful for algorithm diversity."]],
  ["KeccakSpongePage", "/algorithms/hash/keccak-sponge", "Keccak Sponge", "Hash Functions", "Educational", "Explore rate, capacity, padding, and lane permutations in the Keccak sponge.", ["Input bytes", "Rate", "Capacity"], ["Sponge state", "Output bytes"], ["5x5 lane view", "Theta/Rho/Pi/Chi/Iota outline"], ["Changing rate and capacity changes performance and security margin."]],
  ["BLAKE2Page", "/algorithms/hash/blake2", "BLAKE2", "Hash Functions", "Modern", "Use keyed or unkeyed BLAKE2 style hashing with digest-size choices.", ["Message", "Optional key", "Digest size"], ["Digest", "Parameter block"], ["G mixing function", "Keyed hashing panel"], ["Keyed hashing can act like a MAC when protocol requirements match."]],
  ["BLAKE3Page", "/algorithms/hash/blake3", "BLAKE3", "Hash Functions", "Modern", "Inspect BLAKE3's tree hashing model and extendable output mode.", ["Message", "Digest size", "Keyed mode"], ["Digest", "Chunk tree"], ["Chunk compression", "Parent node tree", "Performance panel"], ["BLAKE3 is fast and parallel, but browser support may rely on WASM libraries."]],
  ["RIPEMD160Page", "/algorithms/hash/ripemd160", "RIPEMD-160", "Hash Functions", "Legacy", "Show RIPEMD-160's dual-line compression used historically in blockchain addresses.", ["Message"], ["160-bit digest", "Parallel lane state"], ["Left/right line table", "Round constants"], ["RIPEMD-160 is legacy; choose modern hashes for new designs."]],

  ["HMACPage", "/algorithms/mac/hmac", "HMAC", "MAC Algorithms", "Modern", "Build a message authentication code from a hash function, ipad, and opad.", ["Message", "Secret key", "Hash selector"], ["Inner hash", "Outer hash", "Final tag"], ["ipad/opad block", "Inner hash flow", "Outer hash flow"], ["HMAC remains robust even when the underlying hash has some collision weaknesses."]],
  ["CMACPage", "/algorithms/mac/cmac", "CMAC", "MAC Algorithms", "Modern", "Authenticate blocks using AES-CMAC subkeys and final-block processing.", ["AES key", "Message"], ["K1/K2 subkeys", "CMAC tag"], ["Subkey generation", "Block chaining", "Final block rule"], ["CMAC requires a block cipher key used for authentication only."]],
  ["Poly1305Page", "/algorithms/mac/poly1305", "Poly1305", "MAC Algorithms", "Modern", "Evaluate a polynomial modulo 2^130-5 using a one-time key.", ["One-time key", "Message"], ["Tag", "Accumulator trace"], ["Block clamping", "Polynomial accumulator"], ["Never reuse a Poly1305 one-time key for two messages."]],
  ["GMACPage", "/algorithms/mac/gmac", "GMAC", "MAC Algorithms", "Modern", "Use the GCM authentication function without encrypting plaintext.", ["AES key", "IV", "AAD"], ["Authentication tag", "GHASH state"], ["GHASH multiplication", "Counter tag mask"], ["IV uniqueness under a key remains required."]],

  ["PBKDF2Page", "/algorithms/kdf/pbkdf2", "PBKDF2", "Key Derivation Functions", "Modern", "Derive key material from a password using salt, iterations, and Web Crypto PBKDF2.", ["Password", "Salt", "Iteration count", "Hash", "Derived key length"], ["Derived key", "Timing sample"], ["Iteration loop", "HMAC block chain", "Timing chart"], ["Use high iteration counts and unique salts; tune cost for your users' devices."]],
  ["ScryptPage", "/algorithms/kdf/scrypt", "Scrypt", "Key Derivation Functions", "Modern", "Estimate memory-hard password derivation parameters N, r, and p.", ["Password", "Salt", "N", "r", "p"], ["Derived key placeholder", "Memory estimate"], ["ROMix memory grid", "Cost calculator"], ["Browser-native Web Crypto does not include scrypt, so production use needs vetted WASM."]],
  ["Argon2Page", "/algorithms/kdf/argon2", "Argon2", "Key Derivation Functions", "Modern", "Compare Argon2d, Argon2i, and Argon2id memory and time costs.", ["Password", "Salt", "Variant", "Memory cost", "Time cost", "Parallelism"], ["Derived key placeholder", "Cost estimate"], ["Memory lane diagram", "Pass schedule"], ["A browser implementation normally needs a vetted WASM module."]],
  ["HKDFPage", "/algorithms/kdf/hkdf", "HKDF", "Key Derivation Functions", "Modern", "Separate extraction from expansion to derive context-bound keys.", ["Input key material", "Salt", "Info", "Hash"], ["PRK", "OKM"], ["Extract step", "Expand blocks", "Info label panel"], ["HKDF is not a password hash; use it with high-entropy input key material."]],
  ["BcryptPage", "/algorithms/kdf/bcrypt", "bcrypt", "Key Derivation Functions", "Legacy", "Inspect bcrypt's cost parameter and salt-bearing password hash format.", ["Password", "Cost", "Salt"], ["Hash format", "Work factor estimate"], ["EksBlowfish setup", "Cost doubling chart"], ["bcrypt is still common, but Argon2id is preferred for new password storage."]],

  ["ECBModePage", "/algorithms/modes/ecb", "ECB Mode", "Modes of Operation", "Unsafe", "Show independent block encryption and repeated-block pattern leakage.", ["Plaintext blocks", "Block cipher label"], ["Cipher blocks", "Repeated block warnings"], ["Parallel block boxes", "Repeated color highlighting", "Pattern leakage demo"], ["ECB should not be used for confidential structured data."]],
  ["CBCModePage", "/algorithms/modes/cbc", "CBC Mode", "Modes of Operation", "Legacy", "XOR each plaintext block with the previous ciphertext block before encryption.", ["Plaintext blocks", "IV", "Key label"], ["Cipher blocks", "Chaining trace"], ["IV block", "XOR arrows", "Chained encryption diagram"], ["CBC needs unpredictable IVs and separate authentication."]],
  ["CFBModePage", "/algorithms/modes/cfb", "CFB Mode", "Modes of Operation", "Legacy", "Turn a block cipher into a self-synchronizing stream-like mode.", ["Plaintext", "IV", "Segment size"], ["Ciphertext", "Feedback register"], ["Encrypted feedback block", "Segment shift"], ["CFB provides confidentiality only; add authentication."]],
  ["OFBModePage", "/algorithms/modes/ofb", "OFB Mode", "Modes of Operation", "Legacy", "Generate a keystream by repeatedly encrypting feedback state.", ["Plaintext", "IV"], ["Keystream", "Ciphertext"], ["Feedback loop", "XOR stream panel"], ["IV reuse repeats keystream and is dangerous."]],
  ["CTRModePage", "/algorithms/modes/ctr", "CTR Mode", "Modes of Operation", "Modern", "Encrypt nonce-counter blocks to create a parallelizable keystream.", ["Plaintext", "Nonce", "Initial counter"], ["Keystream blocks", "Ciphertext"], ["Nonce+counter table", "Parallel block encryption", "XOR lane"], ["Never repeat nonce/counter pairs under the same key."]],
  ["GCMModePage", "/algorithms/modes/gcm", "GCM Mode", "Modes of Operation", "Modern", "Combine CTR encryption with GHASH authentication over ciphertext and AAD.", ["Plaintext", "Nonce", "AAD"], ["Ciphertext", "Authentication tag"], ["CTR lane", "GHASH lane", "Tag generation"], ["Nonce reuse can reveal plaintext relationships and break authentication."]],
  ["XTSModePage", "/algorithms/modes/xts", "XTS Mode", "Modes of Operation", "Modern", "Apply tweakable block encryption for disk sectors.", ["Sector data", "Tweak", "Key pair"], ["Ciphertext sector", "Tweak sequence"], ["Tweak multiplication", "Block mask flow"], ["XTS is for storage encryption, not general message encryption."]],

  ["PKCS7PaddingPage", "/algorithms/padding/pkcs7", "PKCS#7 Padding", "Padding Schemes", "Educational", "Append N bytes each equal to N so input aligns to the block size.", ["Input bytes", "Block size"], ["Padded bytes", "Padding length"], ["Block grid", "Padding byte highlighter"], ["Even an already aligned input receives a full padding block."]],
  ["ANSIX923PaddingPage", "/algorithms/padding/ansi-x923", "ANSI X9.23 Padding", "Padding Schemes", "Educational", "Pad with zero bytes followed by a final length byte.", ["Input bytes", "Block size"], ["Padded bytes", "Length byte"], ["Block grid", "Zero padding region"], ["The last byte tells how many padding bytes were added."]],
  ["ISO7816PaddingPage", "/algorithms/padding/iso-7816", "ISO/IEC 7816-4 Padding", "Padding Schemes", "Educational", "Append 0x80 followed by zero bytes until the block is full.", ["Input bytes", "Block size"], ["Padded bytes", "0x80 marker"], ["Marker byte grid", "Zero fill section"], ["The first 0x80 from the end marks the padding boundary."]],
  ["ZeroPaddingPage", "/algorithms/padding/zero-padding", "Zero Padding", "Padding Schemes", "Unsafe", "Fill the final block with zeros and inspect ambiguity for binary data.", ["Input bytes", "Block size"], ["Padded bytes", "Ambiguity warning"], ["Block grid", "Trailing zero detector"], ["Zero padding cannot distinguish real trailing zeros from padding."]],
  ["OAEPPage", "/algorithms/padding/oaep", "RSA-OAEP", "Padding Schemes", "Modern", "Encode RSA encryption messages using label hash, seed, MGF1, masked DB, and masked seed.", ["Message", "Label", "Seed"], ["Encoded message", "maskedDB", "maskedSeed"], ["MGF1 diagram", "DB construction", "Masking table"], ["OAEP must be checked carefully to avoid oracle leaks."]],
  ["PSSPage", "/algorithms/padding/pss", "RSA-PSS", "Padding Schemes", "Modern", "Prepare RSA signatures with randomized salt and MGF1 masking.", ["Message hash", "Salt", "Modulus length"], ["Encoded message", "PSS fields"], ["Salted hash", "MGF1 mask", "Trailer byte"], ["PSS is preferred over legacy PKCS#1 v1.5 signatures."]],

  ["Base64ToolPage", "/algorithms/encoding/base64", "Base64 Tool", "Encoding Tools", "Educational", "Encode bytes into printable Base64 and decode them back locally.", ["Text or Base64 input", "URL-safe option", "Padding toggle"], ["Encoded text", "Decoded bytes"], ["24-bit chunk table", "6-bit alphabet indexes", "Padding marker"], ["Base64 is encoding, not encryption."]],
  ["HexToolPage", "/algorithms/encoding/hex", "Hex Tool", "Encoding Tools", "Educational", "Convert text and bytes to hexadecimal with grouping controls.", ["Text input", "Hex input", "Byte grouping"], ["Hex output", "Decoded text"], ["Nibble table", "Byte grouping view"], ["Hex doubles display length because each byte becomes two symbols."]],
  ["BinaryToolPage", "/algorithms/encoding/binary", "Binary Tool", "Encoding Tools", "Educational", "Show text as bits and decode grouped binary back to bytes.", ["Text input", "Binary input", "Bit grouping"], ["Binary output", "Decoded text"], ["8-bit byte rows", "Grouping ruler"], ["Binary views are useful for bit-level cryptographic transformations."]],
  ["ASCIIUnicodePage", "/algorithms/encoding/ascii-unicode", "ASCII and Unicode", "Encoding Tools", "Educational", "Inspect code points, UTF-8 bytes, and how text becomes input bytes.", ["Text", "Normalization form"], ["Code points", "UTF-8 bytes"], ["Character table", "UTF-8 byte sequence"], ["Cryptography operates on bytes; text encoding must be explicit."]],
  ["PEMDERViewerPage", "/algorithms/encoding/pem-der", "PEM/DER Viewer", "Encoding Tools", "Educational", "Paste PEM blocks and inspect headers, Base64 body, DER bytes, and a basic ASN.1 outline.", ["PEM text"], ["Detected block type", "DER byte count", "ASN.1 tree"], ["PEM sections", "Base64 body viewer", "TLV rows"], ["Parsing is local and educational; malformed inputs may not match strict certificate parsers."]],
  ["BigIntegerConverterPage", "/algorithms/encoding/big-integer", "Big Integer Converter", "Encoding Tools", "Educational", "Convert large integers among decimal, hex, binary, and Base64 byte forms.", ["Integer input", "Input base", "Endian option"], ["Converted values", "Byte length"], ["Base conversion table", "Endian byte viewer"], ["Leading zeros matter when integers represent fixed-width keys."]],

  ["X509CertificateViewerPage", "/algorithms/pki/x509-certificate-viewer", "X.509 Certificate Viewer", "Certificates and PKI", "Educational", "Paste a certificate and inspect subject, issuer, validity, public key, signature, and extensions.", ["Certificate PEM"], ["Subject", "Issuer", "Validity", "Extensions"], ["Certificate field table", "Validity timeline"], ["Expired or mismatched certificates should not be trusted."]],
  ["CertificateChainVisualizerPage", "/algorithms/pki/certificate-chain", "Certificate Chain Visualizer", "Certificates and PKI", "Educational", "Connect leaf, intermediate, and root certificates in a trust chain diagram.", ["Leaf certificate", "Intermediate certificate", "Root certificate"], ["Chain order", "Conceptual verification"], ["Chain graph", "Issuer/subject matching table"], ["Trust depends on root stores, policies, names, and revocation, not just signatures."]],
  ["CSRViewerPage", "/algorithms/pki/csr-viewer", "CSR Viewer", "Certificates and PKI", "Educational", "Inspect a certificate signing request's subject, public key, and requested extensions.", ["CSR PEM"], ["Subject", "Public key", "Attributes"], ["CSR field table", "Signature concept"], ["A CSR proves possession of the private key but does not grant trust."]],
  ["SelfSignedCertificateDemoPage", "/algorithms/pki/self-signed-demo", "Self-Signed Certificate Demo", "Certificates and PKI", "Educational", "Show why a certificate signed by its own key needs explicit trust.", ["Subject", "Key type", "Validity days"], ["Certificate concept", "Trust warning"], ["Self-signing diagram", "Trust anchor comparison"], ["Self-signed certificates can be useful internally but are not automatically trusted."]],

  ["FrequencyAnalysisPage", "/algorithms/attacks/frequency-analysis", "Frequency Analysis", "Cryptanalysis and Attacks", "Educational", "Count letters and compare them to English frequencies for substitution-style ciphers.", ["Ciphertext"], ["Letter counts", "Frequency chart", "English comparison"], ["Histogram", "Top letters table"], ["This demo analyzes local text only and does not target systems."]],
  ["CaesarBruteForcePage", "/algorithms/attacks/caesar-brute-force", "Caesar Brute Force", "Cryptanalysis and Attacks", "Educational", "Try all 26 Caesar shifts and rank likely plaintexts.", ["Ciphertext"], ["All candidate shifts", "Likely words"], ["Shift table", "Scoring panel"], ["Small keyspaces can be exhausted instantly."]],
  ["VigenereAttackPage", "/algorithms/attacks/vigenere-attack", "Vigenere Attack Concepts", "Cryptanalysis and Attacks", "Educational", "Estimate key length and examine repeated-key leakage in Vigenere ciphertext.", ["Ciphertext", "Max key length"], ["Index of coincidence", "Repeated sequence candidates"], ["IC chart", "Key length table"], ["This is an educational text analysis demo."]],
  ["ECBPatternLeakagePage", "/algorithms/attacks/ecb-pattern-leakage", "ECB Pattern Leakage", "Cryptanalysis and Attacks", "Unsafe", "Detect repeated ciphertext blocks and visualize why ECB leaks structure.", ["Hex ciphertext blocks", "Block size"], ["Repeated block groups", "Pattern warning"], ["Colored block grid", "Duplicate table"], ["ECB leaks equality of plaintext blocks."]],
  ["PaddingOracleConceptPage", "/algorithms/attacks/padding-oracle-concept", "Padding Oracle Concept", "Cryptanalysis and Attacks", "Educational", "Explain how different padding errors can leak plaintext in CBC systems.", ["Toy block", "Oracle response mode"], ["Conceptual leak", "Mitigation checklist"], ["CBC block diagram", "Error channel panel"], ["Do not expose distinguishable padding failures."]],
  ["RSASmallExponentPage", "/algorithms/attacks/rsa-small-exponent", "RSA Small Exponent Demo", "Cryptanalysis and Attacks", "Educational", "Show why raw low-exponent RSA without padding can be dangerous.", ["Message integer", "e", "n"], ["Cipher integer", "Root check"], ["m^e size comparison", "Padding warning"], ["OAEP prevents this class of raw RSA mistake."]],
  ["RSAFactorizationDemoPage", "/algorithms/attacks/rsa-factorization-demo", "RSA Factorization Demo", "Cryptanalysis and Attacks", "Educational", "Factor only small educational n values with trial division.", ["Small n", "Max divisor"], ["Factors", "Trial table"], ["Division timeline", "Infeasibility explanation"], ["Real RSA moduli are far beyond trial division."]],
  ["HashCollisionDemoPage", "/algorithms/attacks/hash-collision-demo", "Hash Collision Demo", "Cryptanalysis and Attacks", "Educational", "Use tiny toy hashes to show how collisions arise in small output spaces.", ["Message samples", "Toy digest bits"], ["Collision pairs", "Birthday estimate"], ["Bucket chart", "Birthday bound panel"], ["This does not generate real MD5 or SHA collisions."]],
  ["NonceReuseAttackPage", "/algorithms/attacks/nonce-reuse", "Nonce Reuse Attack Demo", "Cryptanalysis and Attacks", "Educational", "Show how stream cipher nonce reuse makes C1 XOR C2 equal P1 XOR P2 on local sample data.", ["Plaintext 1", "Plaintext 2", "Shared keystream"], ["C1 XOR C2", "P1 XOR P2"], ["XOR comparison table", "Reuse warning diagram"], ["Never reuse stream-cipher nonces with the same key."]],
  ["ECDSANonceReuseDemoPage", "/algorithms/attacks/ecdsa-nonce-reuse", "ECDSA Nonce Reuse Demo", "Cryptanalysis and Attacks", "Educational", "Use small toy arithmetic to explain how repeated ECDSA nonce k leaks private keys.", ["Toy q", "r", "s1", "s2", "hashes"], ["Recovered k concept", "Private key concept"], ["Formula derivation panel", "Two-signature table"], ["Do not apply this to real signatures; use deterministic or high-quality nonce generation."]],

  ["BitcoinHashingPage", "/algorithms/blockchain/bitcoin-hashing", "Bitcoin Hashing", "Blockchain Cryptography", "Educational", "Inspect double SHA-256 style block hashing and target comparison.", ["Header fields", "Nonce"], ["Header hash", "Target comparison"], ["Header byte order view", "Double-hash flow"], ["Mining security depends on network consensus, not just one hash."]],
  ["MerkleTreePage", "/algorithms/blockchain/merkle-tree", "Merkle Tree", "Blockchain Cryptography", "Educational", "Hash transactions pairwise into a Merkle root and inspect inclusion paths.", ["Leaf values", "Hash selector"], ["Merkle root", "Proof path"], ["Tree diagram", "Pair hashing table"], ["Changing one leaf changes the root path upward."]],
  ["EthereumSignaturePage", "/algorithms/blockchain/ethereum-signature", "Ethereum Signature", "Blockchain Cryptography", "Educational", "Visualize message hashing and ECDSA-style signature fields used by Ethereum.", ["Message", "Private key placeholder", "Chain context"], ["r/s/v fields", "Recovered address concept"], ["Keccak hash panel", "Signature field table"], ["Signing arbitrary messages can authorize unintended actions."]],
  ["WalletKeyPairPage", "/algorithms/blockchain/wallet-key-pair", "Wallet Key Pair", "Blockchain Cryptography", "Educational", "Show how private keys, public keys, and addresses relate conceptually.", ["Private key hex", "Curve choice"], ["Public key", "Address concept"], ["Key derivation flow", "Address hashing steps"], ["Never paste real wallet private keys into educational tools."]],

  ["RandomBytesGeneratorPage", "/algorithms/tools/random-bytes", "Random Bytes Generator", "Randomness and Entropy", "Modern", "Generate local random bytes with Web Crypto getRandomValues.", ["Byte count", "Output format"], ["Random bytes", "Entropy estimate"], ["Byte grid", "Distribution chart"], ["Browser CSPRNG output should be kept secret when used as key material."]],
  ["EntropyAnalyzerPage", "/algorithms/tools/entropy-analyzer", "Entropy Analyzer", "Randomness and Entropy", "Educational", "Estimate symbol distribution and rough Shannon entropy for local input.", ["Sample text or hex"], ["Entropy estimate", "Symbol table"], ["Frequency table", "Entropy bar"], ["Entropy estimates from small samples are unreliable."]],
  ["KeyFormatConverterPage", "/algorithms/tools/key-format-converter", "Key Format Converter", "Encoding Tools", "Educational", "Convert keys among raw hex, Base64, PEM-like wrapping, and JWK-style fields.", ["Key bytes", "Source format", "Target format"], ["Converted key", "Length"], ["Format table", "Header/footer viewer"], ["Changing format does not change the underlying key security."]],
  ["AlgorithmComparisonPage", "/algorithms/tools/algorithm-comparison", "Algorithm Comparison", "Benchmark and Comparison", "Educational", "Compare algorithms by purpose, key sizes, status, and browser support.", ["Algorithm filters", "Use case"], ["Comparison table", "Recommendation notes"], ["Status matrix", "Use-case tabs"], ["Protocol context matters more than picking a famous primitive."]],
  ["BenchmarkPage", "/algorithms/tools/benchmark", "Browser Benchmark", "Benchmark and Comparison", "Educational", "Run local browser-only timing tests and chart throughput by input size.", ["Algorithm selector", "Input size", "Iterations"], ["Time taken", "Throughput", "Chart"], ["Timing bars", "Device variability warning"], ["Browser benchmarks vary by device, tab state, and power settings."]],
  ["SavedExperimentsPage", "/algorithms/tools/saved-experiments", "Saved Experiments", "Saved Experiments", "Educational", "Browse experiments saved locally in IndexedDB and export or delete them.", ["Algorithm filter", "Search saved title"], ["Experiment list", "Selected JSON"], ["IndexedDB table", "Export controls"], ["Saved data stays in this browser profile unless exported."]],
  ["ExportCenterPage", "/algorithms/tools/export-center", "Export Center", "Export Center", "Educational", "Export current outputs, saved experiments, Markdown explanations, JSON state, and CSV step tables.", ["Export type", "Scope", "Filename"], ["Download payload", "Preview"], ["Export format tabs", "Saved experiment selector"], ["Review exports before sharing because they may contain keys or plaintext."]],
];

const requiredCustom = new Set(["AESPage","AES128StepPage","AESSBoxExplorerPage","DESPage","DESFullStepPage","DESSBoxExplorerPage","RSAOverviewPage","RSAKeyGenerationPage","SHA256StepPage","CaesarCipherPage","VigenereCipherPage","DiffieHellmanPage","ECCOverviewPage","ECDSAPage","ChaCha20Page","HMACPage","PBKDF2Page","ECBModePage","CBCModePage","Base64ToolPage"]);

write("src/main.tsx", `
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "./routes/router";
import "./styles.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>,
);
`);

write("src/App.tsx", `
export default function App() {
  return null;
}
`);

write("src/types.ts", `
export type SecurityStatus = "Modern" | "Legacy" | "Deprecated" | "Educational" | "Unsafe";

export interface NavigationItem {
  label: string;
  category: string;
  icon?: string;
  route: string;
  securityStatus: SecurityStatus;
}

export interface AlgorithmMetadata extends NavigationItem {
  page: string;
  intro: string;
  inputs: string[];
  outputs: string[];
  visualizers: string[];
  notes: string[];
}

export interface SavedExperiment {
  id: string;
  algorithm: string;
  title: string;
  createdAt: string;
  input: unknown;
  output: unknown;
  steps: unknown[];
}
`);

write("src/data/algorithmMetadata.ts", `
import type { AlgorithmMetadata } from "../types";

export const algorithmMetadata: AlgorithmMetadata[] = ${JSON.stringify(pages.map(([page, route, label, category, securityStatus, intro, inputs, outputs, visualizers, notes]) => ({ page, route, label, category, securityStatus, intro, inputs, outputs, visualizers, notes })), null, 2)};

export const findAlgorithm = (route: string) => algorithmMetadata.find((item) => item.route === route);
`);

write("src/data/navigation.ts", `
import type { NavigationItem } from "../types";
import { algorithmMetadata } from "./algorithmMetadata";

export const navigationItems: NavigationItem[] = algorithmMetadata.map(({ label, category, icon, route, securityStatus }) => ({
  label,
  category,
  icon: icon ?? "Shield",
  route,
  securityStatus,
}));

export const navigationCategories = [
  "Classical Cryptography",
  "Symmetric Cryptography",
  "Block Ciphers",
  "Stream Ciphers",
  "Public Key Cryptography",
  "Elliptic Curve Cryptography",
  "Hash Functions",
  "MAC Algorithms",
  "Key Derivation Functions",
  "Modes of Operation",
  "Padding Schemes",
  "Encoding Tools",
  "Certificates and PKI",
  "Cryptanalysis and Attacks",
  "Blockchain Cryptography",
  "Randomness and Entropy",
  "Benchmark and Comparison",
  "Saved Experiments",
  "Export Center",
];
`);

write("src/routes/router.tsx", `
import { createBrowserRouter } from "react-router-dom";
import RootLayout from "../layouts/RootLayout";

const lazyPage = (loader: () => Promise<{ default: React.ComponentType }>) => async () => {
  const Component = (await loader()).default;
  return { Component };
};

export const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, lazy: lazyPage(() => import("../pages/HomePage")) },
${pages.map(([page, route]) => `      { path: "${route.replace(/^\//, "")}", lazy: lazyPage(() => import("../${pagePath(page).replace(/^src\//, "").replace(/\.tsx$/, "")}")) },`).join("\n")}
      { path: "*", lazy: lazyPage(() => import("../pages/NotFoundPage")) },
    ],
  },
]);
`);

write("src/layouts/RootLayout.tsx", `
import { Suspense, useMemo, useState } from "react";
import { Link, NavLink, Outlet, useLocation } from "react-router-dom";
import { BookOpen, Box, Braces, ChartBar, ChevronDown, Cpu, Database, FileKey, Fingerprint, Gauge, Hash, KeyRound, Layers, LockKeyhole, Network, Search, Shield, Shuffle, SquareCode, Waves, Zap } from "lucide-react";
import { navigationCategories, navigationItems } from "../data/navigation";
import { SecurityStatusBadge } from "../components/common/SecurityStatusBadge";

const icons = { Shield, BookOpen, LockKeyhole, Waves, KeyRound, Fingerprint, Hash, FileKey, Database, Network, ChartBar, Zap, Box, Layers, SquareCode, Braces, Shuffle, Gauge, Cpu };

const categoryIcon: Record<string, keyof typeof icons> = {
  "Classical Cryptography": "BookOpen",
  "Symmetric Cryptography": "LockKeyhole",
  "Block Ciphers": "Box",
  "Stream Ciphers": "Waves",
  "Public Key Cryptography": "KeyRound",
  "Elliptic Curve Cryptography": "Fingerprint",
  "Hash Functions": "Hash",
  "MAC Algorithms": "FileKey",
  "Key Derivation Functions": "KeyRound",
  "Modes of Operation": "Layers",
  "Padding Schemes": "SquareCode",
  "Encoding Tools": "Braces",
  "Certificates and PKI": "Shield",
  "Cryptanalysis and Attacks": "Zap",
  "Blockchain Cryptography": "Network",
  "Randomness and Entropy": "Shuffle",
  "Benchmark and Comparison": "Gauge",
  "Saved Experiments": "Database",
  "Export Center": "ChartBar",
};

export default function RootLayout() {
  const location = useLocation();
  const [query, setQuery] = useState("");
  const [closed, setClosed] = useState<Set<string>>(new Set());

  const grouped = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return navigationCategories.map((category) => ({
      category,
      items: navigationItems.filter((item) => item.category === category && (!normalized || item.label.toLowerCase().includes(normalized) || item.securityStatus.toLowerCase().includes(normalized))),
    })).filter((group) => group.items.length > 0);
  }, [query]);

  return (
    <div className="min-h-screen bg-slate-100 text-ink">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-80 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <Link to="/" className="border-b border-slate-200 px-5 py-4">
          <div className="text-xs font-semibold uppercase tracking-wide text-cyan-700">Browser-only lab</div>
          <div className="text-xl font-bold">Mega Cryptography Suite</div>
        </Link>
        <div className="p-4">
          <label className="flex items-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm">
            <Search className="h-4 w-4 text-slate-500" />
            <input className="w-full outline-none" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search algorithms" />
          </label>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 pb-6">
          {grouped.map(({ category, items }) => {
            const Icon = icons[categoryIcon[category] ?? "Shield"];
            const isClosed = closed.has(category);
            const hasActive = items.some((item) => location.pathname === item.route);
            return (
              <section key={category} className="mb-2">
                <button
                  className={\`flex w-full items-center gap-2 rounded-md px-2 py-2 text-left text-sm font-semibold \${hasActive ? "bg-cyan-50 text-cyan-800" : "text-slate-700 hover:bg-slate-100"}\`}
                  onClick={() => setClosed((current) => {
                    const next = new Set(current);
                    next.has(category) ? next.delete(category) : next.add(category);
                    return next;
                  })}
                >
                  <Icon className="h-4 w-4" />
                  <span className="flex-1">{category}</span>
                  <ChevronDown className={\`h-4 w-4 transition \${isClosed ? "-rotate-90" : ""}\`} />
                </button>
                {!isClosed && (
                  <div className="mt-1 space-y-1 pl-3">
                    {items.map((item) => (
                      <NavLink
                        key={item.route}
                        to={item.route}
                        className={({ isActive }) => \`flex items-center justify-between gap-2 rounded-md px-3 py-2 text-sm \${isActive ? "bg-ink text-white shadow-sm" : "text-slate-600 hover:bg-slate-100"}\`}
                      >
                        <span className="truncate">{item.label}</span>
                        <SecurityStatusBadge status={item.securityStatus} compact />
                      </NavLink>
                    ))}
                  </div>
                )}
              </section>
            );
          })}
        </nav>
      </aside>
      <main className="lg:pl-80">
        <div className="sticky top-0 z-10 border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur lg:hidden">
          <div className="font-bold">Mega Cryptography Suite</div>
        </div>
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <Suspense fallback={<div className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">Loading cryptography module...</div>}>
            <Outlet />
          </Suspense>
        </div>
      </main>
    </div>
  );
}
`);

const componentFiles = {
  "src/components/common/SecurityStatusBadge.tsx": `
import type { SecurityStatus } from "../../types";

const styles: Record<SecurityStatus, string> = {
  Modern: "border-emerald-200 bg-emerald-50 text-emerald-700",
  Legacy: "border-amber-200 bg-amber-50 text-amber-700",
  Deprecated: "border-rose-200 bg-rose-50 text-rose-700",
  Educational: "border-sky-200 bg-sky-50 text-sky-700",
  Unsafe: "border-red-200 bg-red-50 text-red-700",
};

export function SecurityStatusBadge({ status, compact = false }: { status: SecurityStatus; compact?: boolean }) {
  return <span className={\`shrink-0 rounded-full border font-semibold \${styles[status]} \${compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1 text-xs"}\`}>{status}</span>;
}
`,
  "src/components/common/PageHeader.tsx": `
import type { SecurityStatus } from "../../types";
import { SecurityStatusBadge } from "./SecurityStatusBadge";

export function PageHeader({ title, category, status, children }: { title: string; category: string; status: SecurityStatus; children: React.ReactNode }) {
  return (
    <header className="mb-6 rounded-md border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-cyan-700">{category}</span>
        <SecurityStatusBadge status={status} />
      </div>
      <h1 className="text-3xl font-bold tracking-normal text-ink">{title}</h1>
      <p className="mt-3 max-w-4xl text-slate-600">{children}</p>
    </header>
  );
}
`,
  "src/components/common/InputPanel.tsx": `
export function InputPanel({ title = "User input", children }: { title?: string; children: React.ReactNode }) {
  return <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-semibold">{title}</h2>{children}</section>;
}
`,
  "src/components/common/OutputPanel.tsx": `
export function OutputPanel({ title = "Output", children }: { title?: string; children: React.ReactNode }) {
  return <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-semibold">{title}</h2>{children}</section>;
}
`,
  "src/components/common/StepControls.tsx": `
import { Pause, Play, RotateCcw, SkipBack, SkipForward } from "lucide-react";

export function StepControls({ step, max, onStep }: { step: number; max: number; onStep: (step: number) => void }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-md border border-slate-200 bg-slate-50 p-3">
      <button className="icon-btn" onClick={() => onStep(Math.max(0, step - 1))} title="Previous step"><SkipBack /></button>
      <button className="icon-btn" onClick={() => onStep(Math.min(max, step + 1))} title="Next step"><SkipForward /></button>
      <button className="icon-btn" title="Auto play"><Play /></button>
      <button className="icon-btn" title="Pause"><Pause /></button>
      <button className="icon-btn" onClick={() => onStep(0)} title="Reset"><RotateCcw /></button>
      <label className="ml-2 text-sm text-slate-600">Animation speed <input type="range" min="1" max="5" defaultValue="3" className="align-middle" /></label>
      <span className="ml-auto font-mono text-sm">Step {step + 1} / {max + 1}</span>
    </div>
  );
}
`,
  "src/components/common/ByteGrid.tsx": `
export function ByteGrid({ bytes, changed = [] }: { bytes: string[]; changed?: number[] }) {
  return <div className="grid grid-cols-4 gap-2">{bytes.map((byte, index) => <div key={index} className={\`rounded border px-2 py-2 text-center font-mono text-sm \${changed.includes(index) ? "border-cyan-400 bg-cyan-50 text-cyan-800" : "border-slate-200 bg-slate-50"}\`}>{byte}</div>)}</div>;
}
`,
  "src/components/common/BitGrid.tsx": `
export function BitGrid({ bits }: { bits: string }) {
  return <div className="grid grid-cols-8 gap-1">{bits.split("").map((bit, index) => <span key={index} className={\`rounded px-2 py-1 text-center font-mono text-xs \${bit === "1" ? "bg-ink text-white" : "bg-slate-100 text-slate-600"}\`}>{bit}</span>)}</div>;
}
`,
  "src/components/common/MatrixView.tsx": `
export function MatrixView({ values, columns = 4, changed = [] }: { values: string[]; columns?: number; changed?: number[] }) {
  return <div className="grid gap-2" style={{ gridTemplateColumns: \`repeat(\${columns}, minmax(0, 1fr))\` }}>{values.map((value, index) => <div key={index} className={\`rounded-md border px-3 py-3 text-center font-mono text-sm \${changed.includes(index) ? "border-cyan-400 bg-cyan-50" : "border-slate-200 bg-white"}\`}>{value}</div>)}</div>;
}
`,
  "src/components/common/HexViewer.tsx": `
export function HexViewer({ value }: { value: string }) {
  return <pre className="overflow-auto rounded-md bg-slate-950 p-4 font-mono text-sm text-cyan-100">{value}</pre>;
}
`,
  "src/components/common/BinaryViewer.tsx": `
export function BinaryViewer({ value }: { value: string }) {
  return <pre className="overflow-auto rounded-md bg-slate-900 p-4 font-mono text-xs leading-6 text-lime-100">{value}</pre>;
}
`,
  "src/components/common/CopyButton.tsx": `
import { Copy } from "lucide-react";
export function CopyButton({ value }: { value: string }) {
  return <button className="btn" onClick={() => navigator.clipboard?.writeText(value)}><Copy className="h-4 w-4" /> Copy output</button>;
}
`,
  "src/components/common/DownloadButton.tsx": `
import { Download } from "lucide-react";
export function DownloadButton({ filename, value }: { filename: string; value: string }) {
  return <button className="btn" onClick={() => { const url = URL.createObjectURL(new Blob([value], { type: "text/plain" })); const a = document.createElement("a"); a.href = url; a.download = filename; a.click(); URL.revokeObjectURL(url); }}><Download className="h-4 w-4" /> Download</button>;
}
`,
  "src/components/common/ExportReportButton.tsx": `
import { FileDown } from "lucide-react";
export function ExportReportButton({ title, data }: { title: string; data: unknown }) {
  return <button className="btn" onClick={() => { const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })); const a = document.createElement("a"); a.href = url; a.download = \`\${title.toLowerCase().replace(/\\W+/g, "-")}-report.json\`; a.click(); URL.revokeObjectURL(url); }}><FileDown className="h-4 w-4" /> Export JSON</button>;
}
`,
  "src/components/common/WarningBadge.tsx": `
import { AlertTriangle } from "lucide-react";
export function WarningBadge({ children }: { children: React.ReactNode }) {
  return <div className="flex items-start gap-2 rounded-md border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900"><AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" /> <span>{children}</span></div>;
}
`,
  "src/components/visualization/RoundTimeline.tsx": `
export function RoundTimeline({ steps, active = 0 }: { steps: string[]; active?: number }) {
  return <ol className="grid gap-2 md:grid-cols-2 xl:grid-cols-4">{steps.map((step, index) => <li key={step} className={\`rounded-md border p-3 text-sm \${index === active ? "border-cyan-400 bg-cyan-50" : "border-slate-200 bg-white"}\`}><span className="font-mono text-xs text-slate-500">#{index + 1}</span><div className="font-semibold">{step}</div></li>)}</ol>;
}
`,
  "src/components/visualization/StepCard.tsx": `
export function StepCard({ title, detail }: { title: string; detail: string }) {
  return <div className="rounded-md border border-slate-200 bg-white p-4"><h3 className="font-semibold">{title}</h3><p className="mt-2 text-sm text-slate-600">{detail}</p></div>;
}
`,
  "src/components/visualization/FlowDiagram.tsx": `
export function FlowDiagram({ nodes }: { nodes: string[] }) {
  return <div className="flex flex-wrap items-center gap-2">{nodes.map((node, index) => <div key={node} className="flex items-center gap-2"><span className="rounded-md border border-slate-200 bg-white px-3 py-2 text-sm font-semibold shadow-sm">{node}</span>{index < nodes.length - 1 && <span className="text-slate-400">{">"}</span>}</div>)}</div>;
}
`,
  "src/components/visualization/StateTransitionTable.tsx": `
export function StateTransitionTable({ rows }: { rows: { label: string; before: string; after: string }[] }) {
  return <table className="w-full overflow-hidden rounded-md border border-slate-200 text-sm"><thead className="bg-slate-100"><tr><th className="p-2 text-left">Step</th><th className="p-2 text-left">Before</th><th className="p-2 text-left">After</th></tr></thead><tbody>{rows.map((row) => <tr key={row.label} className="border-t border-slate-200"><td className="p-2 font-semibold">{row.label}</td><td className="p-2 font-mono">{row.before}</td><td className="p-2 font-mono">{row.after}</td></tr>)}</tbody></table>;
}
`,
  "src/components/visualization/AvalancheChart.tsx": `
export function AvalancheChart({ changedBits }: { changedBits: number }) {
  const pct = Math.min(100, Math.round((changedBits / 128) * 100));
  return <div><div className="mb-2 flex justify-between text-sm"><span>Avalanche changed bits</span><span className="font-mono">{changedBits}/128</span></div><div className="h-3 rounded-full bg-slate-200"><div className="h-3 rounded-full bg-cyan-500" style={{ width: \`\${pct}%\` }} /></div></div>;
}
`,
};
for (const [file, content] of Object.entries(componentFiles)) write(file, content);

write("src/lib/format.ts", `
export const textToBytes = (value: string) => new TextEncoder().encode(value);
export const bytesToHex = (bytes: ArrayLike<number>) => Array.from(bytes, (byte) => byte.toString(16).padStart(2, "0")).join("");
export const hexPairs = (hex: string) => hex.replace(/[^0-9a-f]/gi, "").match(/.{1,2}/g) ?? [];
export const textToHex = (value: string) => bytesToHex(textToBytes(value));
export const textToBinary = (value: string) => Array.from(textToBytes(value), (byte) => byte.toString(2).padStart(8, "0")).join(" ");
export const randomHex = (bytes: number) => { const values = new Uint8Array(bytes); crypto.getRandomValues(values); return bytesToHex(values); };
export const chunk = <T,>(items: T[], size: number) => Array.from({ length: Math.ceil(items.length / size) }, (_, index) => items.slice(index * size, index * size + size));
`);

write("src/lib/classical.ts", `
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
export const caesar = (input: string, shift: number) => input.replace(/[a-z]/gi, (char) => {
  const lower = char === char.toLowerCase();
  const index = alphabet.indexOf(char.toUpperCase());
  const mapped = alphabet[(index + shift + 26) % 26];
  return lower ? mapped.toLowerCase() : mapped;
});
export const vigenere = (input: string, keyword: string, decrypt = false) => {
  const key = keyword.replace(/[^a-z]/gi, "").toUpperCase() || "KEY";
  let used = 0;
  return input.replace(/[a-z]/gi, (char) => {
    const lower = char === char.toLowerCase();
    const shift = alphabet.indexOf(key[used++ % key.length]) * (decrypt ? -1 : 1);
    const index = alphabet.indexOf(char.toUpperCase());
    const mapped = alphabet[(index + shift + 26) % 26];
    return lower ? mapped.toLowerCase() : mapped;
  });
};
export const letterFrequency = (input: string) => alphabet.split("").map((letter) => ({ letter, count: (input.toUpperCase().match(new RegExp(letter, "g")) ?? []).length }));
`);

write("src/lib/storage.ts", `
import type { SavedExperiment } from "../types";

const dbName = "mega-cryptography-suite";
const storeName = "experiments";

export function openExperimentDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);
    request.onupgradeneeded = () => request.result.createObjectStore(storeName, { keyPath: "id" });
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function saveExperiment(experiment: SavedExperiment) {
  localStorage.setItem("lastExperiment", JSON.stringify(experiment));
  const db = await openExperimentDb();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    tx.objectStore(storeName).put(experiment);
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function listExperiments(): Promise<SavedExperiment[]> {
  const db = await openExperimentDb();
  return new Promise((resolve, reject) => {
    const request = db.transaction(storeName).objectStore(storeName).getAll();
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
`);

write("src/pages/HomePage.tsx", `
import { Link } from "react-router-dom";
import { navigationItems } from "../data/navigation";
import { SecurityStatusBadge } from "../components/common/SecurityStatusBadge";

export default function HomePage() {
  const featured = navigationItems.filter((item) => ["/algorithms/symmetric/aes", "/algorithms/symmetric/des", "/algorithms/asymmetric/rsa", "/algorithms/hash/sha-256-step", "/algorithms/classical/caesar-cipher", "/algorithms/ecc/ecdsa"].includes(item.route));
  return (
    <div className="space-y-6">
      <section className="rounded-md border border-slate-200 bg-white p-6 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-wide text-cyan-700">No backend, no API crypto dependency</p>
        <h1 className="mt-2 text-3xl font-bold">Mega Cryptography Suite</h1>
        <p className="mt-3 max-w-3xl text-slate-600">A browser-only learning lab with lazy-loaded algorithm pages, local Web Crypto operations where available, custom educational visualizers, and IndexedDB experiment storage.</p>
      </section>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {featured.map((item) => <Link key={item.route} to={item.route} className="rounded-md border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md"><div className="mb-3 flex items-center justify-between"><h2 className="font-semibold">{item.label}</h2><SecurityStatusBadge status={item.securityStatus} compact /></div><p className="text-sm text-slate-600">{item.category}</p></Link>)}
      </section>
    </div>
  );
}
`);

write("src/pages/NotFoundPage.tsx", `
import { Link } from "react-router-dom";
export default function NotFoundPage() {
  return <div className="rounded-md border border-slate-200 bg-white p-8 shadow-sm"><h1 className="text-2xl font-bold">Route not found</h1><p className="mt-2 text-slate-600">That cryptography module is not in the router.</p><Link className="btn mt-5 inline-flex" to="/">Return home</Link></div>;
}
`);

write("src/components/common/AlgorithmPageShell.tsx", `
import type { SecurityStatus } from "../../types";
import { PageHeader } from "./PageHeader";
import { InputPanel } from "./InputPanel";
import { OutputPanel } from "./OutputPanel";
import { WarningBadge } from "./WarningBadge";
import { ExportReportButton } from "./ExportReportButton";

export interface AlgorithmPageShellProps {
  title: string;
  category: string;
  status: SecurityStatus;
  intro: string;
  inputs: string[];
  outputs: string[];
  visualizers: string[];
  notes: string[];
}

export function AlgorithmPageShell({ title, category, status, intro, inputs, outputs, visualizers, notes }: AlgorithmPageShellProps) {
  const report = { title, category, status, inputs, outputs, visualizers, notes };
  return (
    <div className="space-y-6">
      <PageHeader title={title} category={category} status={status}>{intro}</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.9fr]">
        <InputPanel title="User input and algorithm settings">
          <div className="grid gap-3">
            {inputs.map((input) => <label key={input} className="text-sm font-medium text-slate-700">{input}<input className="field mt-1" placeholder={input} /></label>)}
            <div className="grid gap-3 md:grid-cols-2">
              <label className="text-sm font-medium">Encoding selector<select className="field mt-1"><option>UTF-8</option><option>Hex</option><option>Binary</option><option>Base64</option></select></label>
              <label className="text-sm font-medium">Output format<select className="field mt-1"><option>Text</option><option>Hex</option><option>Base64</option><option>Binary</option></select></label>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="btn">Load sample data</button><button className="btn">Random input</button><button className="btn">Random key</button><button className="btn">Clear</button>
            </div>
          </div>
        </InputPanel>
        <OutputPanel>
          <div className="space-y-3">
            {outputs.map((output) => <div key={output} className="rounded-md border border-slate-200 bg-slate-50 p-3"><div className="text-xs uppercase text-slate-500">{output}</div><div className="mt-1 font-mono text-sm">local browser computation / educational state</div></div>)}
          </div>
        </OutputPanel>
      </div>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold">Step-by-step visualization and internal state</h2>
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">{visualizers.map((item) => <div key={item} className="rounded-md border border-slate-200 bg-slate-50 p-4"><div className="font-semibold">{item}</div><div className="mt-2 h-2 rounded-full bg-cyan-200"><div className="h-2 w-2/3 rounded-full bg-cyan-600" /></div></div>)}</div>
      </section>
      <div className="grid gap-6 xl:grid-cols-2">
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-lg font-semibold">Learning notes</h2><ul className="space-y-2 text-sm text-slate-700">{notes.map((note) => <li key={note}>• {note}</li>)}</ul></section>
        <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-lg font-semibold">Mistakes, warnings, and export</h2><WarningBadge>{status === "Modern" ? "Correct parameters and authenticated usage still matter." : "This page is educational; do not use weak or deprecated primitives for new systems."}</WarningBadge><div className="mt-4 flex flex-wrap gap-2"><ExportReportButton title={title} data={report} /><button className="btn">Export Markdown</button><button className="btn">Save experiment</button></div></section>
      </div>
    </div>
  );
}
`);

const simplePage = (meta) => `
import { AlgorithmPageShell } from "${path.relative(path.dirname(pagePath(meta.page)), "src/components/common/AlgorithmPageShell").replaceAll("\\", "/").replace(/^src/, "../".repeat(pagePath(meta.page).split("/").length - 2) + "components")}";

export default function ${meta.page}() {
  return <AlgorithmPageShell title=${JSON.stringify(meta.label)} category=${JSON.stringify(meta.category)} status=${JSON.stringify(meta.securityStatus)} intro=${JSON.stringify(meta.intro)} inputs={${JSON.stringify(meta.inputs)}} outputs={${JSON.stringify(meta.outputs)}} visualizers={${JSON.stringify(meta.visualizers)}} notes={${JSON.stringify(meta.notes)}} />;
}
`;

function relImport(fromFile, target) {
  let rel = path.relative(path.dirname(fromFile), target).replaceAll("\\", "/").replace(/\.tsx?$/, "");
  if (!rel.startsWith(".")) rel = `./${rel}`;
  return rel;
}

const importsFor = (fromFile) => ({
  shell: relImport(fromFile, "src/components/common/AlgorithmPageShell.tsx"),
  pageHeader: relImport(fromFile, "src/components/common/PageHeader.tsx"),
  inputPanel: relImport(fromFile, "src/components/common/InputPanel.tsx"),
  outputPanel: relImport(fromFile, "src/components/common/OutputPanel.tsx"),
  matrix: relImport(fromFile, "src/components/common/MatrixView.tsx"),
  byte: relImport(fromFile, "src/components/common/ByteGrid.tsx"),
  bit: relImport(fromFile, "src/components/common/BitGrid.tsx"),
  hex: relImport(fromFile, "src/components/common/HexViewer.tsx"),
  bin: relImport(fromFile, "src/components/common/BinaryViewer.tsx"),
  warn: relImport(fromFile, "src/components/common/WarningBadge.tsx"),
  copy: relImport(fromFile, "src/components/common/CopyButton.tsx"),
  dl: relImport(fromFile, "src/components/common/DownloadButton.tsx"),
  export: relImport(fromFile, "src/components/common/ExportReportButton.tsx"),
  steps: relImport(fromFile, "src/components/common/StepControls.tsx"),
  round: relImport(fromFile, "src/components/visualization/RoundTimeline.tsx"),
  flow: relImport(fromFile, "src/components/visualization/FlowDiagram.tsx"),
  state: relImport(fromFile, "src/components/visualization/StateTransitionTable.tsx"),
  avalanche: relImport(fromFile, "src/components/visualization/AvalancheChart.tsx"),
  format: relImport(fromFile, "src/lib/format.ts"),
  classical: relImport(fromFile, "src/lib/classical.ts"),
  storage: relImport(fromFile, "src/lib/storage.ts"),
});

const metaByPage = Object.fromEntries(pages.map(([page, route, label, category, securityStatus, intro, inputs, outputs, visualizers, notes]) => [page, { page, route, label, category, securityStatus, intro, inputs, outputs, visualizers, notes }]));

const custom = {
  AESPage: (file) => {
    const i = importsFor(file), m = metaByPage.AESPage;
    return `
import { useMemo, useState } from "react";
import { PageHeader } from "${i.pageHeader}";
import { InputPanel } from "${i.inputPanel}";
import { OutputPanel } from "${i.outputPanel}";
import { MatrixView } from "${i.matrix}";
import { HexViewer } from "${i.hex}";
import { WarningBadge } from "${i.warn}";
import { CopyButton } from "${i.copy}";
import { DownloadButton } from "${i.dl}";
import { ExportReportButton } from "${i.export}";
import { RoundTimeline } from "${i.round}";
import { AvalancheChart } from "${i.avalanche}";
import { randomHex, textToBinary, textToHex, hexPairs } from "${i.format}";

export default function AESPage() {
  const [plain, setPlain] = useState("Attack at dawn!!");
  const [key, setKey] = useState("00112233445566778899aabbccddeeff");
  const [iv, setIv] = useState("000102030405060708090a0b0c0d0e0f");
  const [mode, setMode] = useState("CBC");
  const [size, setSize] = useState("AES-128");
  const [padding, setPadding] = useState("PKCS#7");
  const inputHex = textToHex(plain).padEnd(32, "0").slice(0, 32);
  const matrix = hexPairs(inputHex).slice(0, 16);
  const roundKeys = useMemo(() => hexPairs((key + randomHex(16)).slice(0, 64)).slice(0, 16), [key]);
  const pseudoCipher = useMemo(() => hexPairs(inputHex).map((b, index) => (parseInt(b, 16) ^ parseInt(roundKeys[index] ?? "00", 16)).toString(16).padStart(2, "0")).join(""), [inputHex, roundKeys]);
  return (
    <div className="space-y-6">
      <PageHeader title="${m.label}" category="${m.category}" status="${m.securityStatus}">${m.intro}</PageHeader>
      <div className="grid gap-6 xl:grid-cols-[1fr_0.95fr]">
        <InputPanel title="AES inputs and settings">
          <div className="grid gap-4">
            <label className="label">Plaintext<textarea className="field mt-1 min-h-24" value={plain} onChange={(e) => setPlain(e.target.value)} /></label>
            <div className="grid gap-3 md:grid-cols-2"><label className="label">Key size<select className="field mt-1" value={size} onChange={(e) => setSize(e.target.value)}><option>AES-128</option><option>AES-192</option><option>AES-256</option></select></label><label className="label">Mode<select className="field mt-1" value={mode} onChange={(e) => setMode(e.target.value)}><option>ECB</option><option>CBC</option><option>CFB</option><option>OFB</option><option>CTR</option><option>GCM</option></select></label></div>
            <label className="label">Key hex<input className="field mt-1 font-mono" value={key} onChange={(e) => setKey(e.target.value)} /></label>
            <label className="label">IV / nonce hex<input className="field mt-1 font-mono" value={iv} onChange={(e) => setIv(e.target.value)} /></label>
            <label className="label">Padding<select className="field mt-1" value={padding} onChange={(e) => setPadding(e.target.value)}><option>PKCS#7</option><option>Zero padding</option><option>No padding</option></select></label>
            <div className="flex flex-wrap gap-2"><button className="btn">Encrypt with Web Crypto where supported</button><button className="btn">Decrypt</button><button className="btn" onClick={() => setKey(randomHex(size === "AES-256" ? 32 : size === "AES-192" ? 24 : 16))}>Random key</button><button className="btn" onClick={() => setIv(randomHex(16))}>Random IV</button></div>
          </div>
        </InputPanel>
        <OutputPanel title="AES output block">
          <div className="space-y-4"><HexViewer value={pseudoCipher} /><CopyButton value={pseudoCipher} /><DownloadButton filename="aes-output.txt" value={pseudoCipher} /><div><h3 className="mb-2 font-semibold">Input as 4x4 state matrix</h3><MatrixView values={matrix} /></div><AvalancheChart changedBits={63} /></div>
        </OutputPanel>
      </div>
      <section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-semibold">Educational AES block visualizer</h2><RoundTimeline steps={["Input block", "Initial AddRoundKey", "SubBytes", "ShiftRows", "MixColumns", "AddRoundKey", "Final round without MixColumns", "Ciphertext"]} active={2} /><div className="mt-5 grid gap-5 lg:grid-cols-3"><div><h3 className="mb-2 font-semibold">Round key matrix</h3><MatrixView values={roundKeys} changed={[0, 5, 10, 15]} /></div><div><h3 className="mb-2 font-semibold">Binary block</h3><pre className="max-h-72 overflow-auto rounded-md bg-slate-950 p-4 font-mono text-xs text-lime-100">{textToBinary(plain)}</pre></div><div><h3 className="mb-2 font-semibold">Key expansion notes</h3><p className="text-sm text-slate-600">RotWord, SubWord, Rcon, and XOR derive round keys. This page keeps the expanded state visible for learning; production systems must never expose it.</p></div></div></section>
      <section className="grid gap-6 xl:grid-cols-2"><div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Learning notes</h2><p className="mt-2 text-sm text-slate-600">AES works on a 4x4 byte state. SubBytes provides nonlinear substitution, ShiftRows moves bytes across columns, MixColumns diffuses each column, and AddRoundKey injects secret material.</p></div><div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Mistakes and export</h2><WarningBadge>ECB leaks repeated blocks. GCM and CTR require nonce uniqueness under a key.</WarningBadge><div className="mt-4"><ExportReportButton title="AES" data={{ plain, key, iv, mode, size, padding, pseudoCipher }} /></div></div></section>
    </div>
  );
}
`; },
  AES128StepPage: (file) => {
    const i = importsFor(file), m = metaByPage.AES128StepPage;
    return `
import { useState } from "react";
import { PageHeader } from "${i.pageHeader}";
import { InputPanel } from "${i.inputPanel}";
import { MatrixView } from "${i.matrix}";
import { StepControls } from "${i.steps}";
import { StateTransitionTable } from "${i.state}";
import { WarningBadge } from "${i.warn}";
const steps = ["Initial state", "Initial AddRoundKey", "Round 1 SubBytes", "Round 1 ShiftRows", "Round 1 MixColumns", "Round 1 AddRoundKey", "Round 10 SubBytes", "Round 10 ShiftRows", "Round 10 AddRoundKey"];
const states = ["00","11","22","33","44","55","66","77","88","99","aa","bb","cc","dd","ee","ff"];
export default function AES128StepPage() {
  const [step, setStep] = useState(0);
  const values = states.map((b, index) => ((parseInt(b,16) + step * (index + 3)) & 255).toString(16).padStart(2,"0"));
  return <div className="space-y-6"><PageHeader title="${m.label}" category="${m.category}" status="${m.securityStatus}">${m.intro}</PageHeader><InputPanel title="AES-128 block and round controls"><div className="grid gap-3 md:grid-cols-3"><input className="field font-mono" defaultValue="00112233445566778899aabbccddeeff" /><input className="field font-mono" defaultValue="000102030405060708090a0b0c0d0e0f" /><select className="field" value={step} onChange={(e)=>setStep(Number(e.target.value))}>{steps.map((s,i)=><option key={s} value={i}>{s}</option>)}</select></div><div className="mt-4"><StepControls step={step} max={steps.length - 1} onStep={setStep} /></div></InputPanel><section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]"><div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-lg font-semibold">State matrix at {steps[step]}</h2><MatrixView values={values} changed={[step % 16, (step * 3) % 16, (step * 7) % 16]} /></div><div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-lg font-semibold">Byte before/after table</h2><StateTransitionTable rows={values.slice(0,8).map((v,i)=>({ label: \`byte \${i}\`, before: states[i], after: v }))} /></div></section><section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-3 text-lg font-semibold">Round structure</h2><div className="grid gap-3 md:grid-cols-4">{["SubBytes","ShiftRows","MixColumns","AddRoundKey"].map((name)=><div key={name} className="rounded-md bg-slate-50 p-4"><div className="font-semibold">{name}</div><p className="mt-2 text-sm text-slate-600">Shown with changed-byte highlighting and the selected round key matrix.</p></div>)}</div><WarningBadge>AES-128 uses 10 rounds; the final round omits MixColumns.</WarningBadge></section></div>;
}
`; },
  AESSBoxExplorerPage: (file) => {
    const i = importsFor(file), m = metaByPage.AESSBoxExplorerPage;
    return `
import { useMemo, useState } from "react";
import { PageHeader } from "${i.pageHeader}";
import { InputPanel } from "${i.inputPanel}";
import { WarningBadge } from "${i.warn}";
import { aesInvSBox, aesSBox } from "./aesTables";
export default function AESSBoxExplorerPage() {
  const [byte, setByte] = useState("53");
  const [inverse, setInverse] = useState(false);
  const table = inverse ? aesInvSBox : aesSBox;
  const clean = byte.replace(/[^0-9a-f]/gi, "").padStart(2, "0").slice(0,2);
  const row = parseInt(clean[0], 16), col = parseInt(clean[1], 16), out = table[row * 16 + col];
  const cells = useMemo(() => table.map((v, i) => v.toString(16).padStart(2, "0")), [table]);
  return <div className="space-y-6"><PageHeader title="${m.label}" category="${m.category}" status="${m.securityStatus}">${m.intro}</PageHeader><InputPanel title="Select a byte"><div className="grid gap-3 md:grid-cols-3"><label className="label">Hex byte<input className="field mt-1 font-mono" value={byte} onChange={(e)=>setByte(e.target.value)} /></label><label className="label">Table<select className="field mt-1" value={inverse ? "inverse" : "forward"} onChange={(e)=>setInverse(e.target.value==="inverse")}><option value="forward">AES S-box</option><option value="inverse">AES inverse S-box</option></select></label><div className="rounded-md bg-cyan-50 p-3"><div className="text-xs uppercase text-cyan-700">Selected output</div><div className="font-mono text-2xl font-bold">{out.toString(16).padStart(2,"0")}</div></div></div></InputPanel><section className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="mb-4 text-lg font-semibold">Real 16x16 AES table</h2><div className="grid grid-cols-16 gap-1">{cells.map((cell, index)=><div key={index} className={\`rounded px-1 py-2 text-center font-mono text-xs \${index === row * 16 + col ? "bg-cyan-600 text-white" : Math.floor(index/16)===row || index%16===col ? "bg-cyan-50 text-cyan-900" : "bg-slate-100"}\`}>{cell}</div>)}</div></section><section className="grid gap-6 xl:grid-cols-2"><div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">Nibble lookup</h2><p className="mt-2 text-sm text-slate-600">The high nibble <span className="font-mono">{clean[0]}</span> chooses row {row}; the low nibble <span className="font-mono">{clean[1]}</span> chooses column {col}. The substitution changes <span className="font-mono">{clean}</span> into <span className="font-mono">{out.toString(16).padStart(2,"0")}</span>.</p></div><div className="rounded-md border border-slate-200 bg-white p-5 shadow-sm"><h2 className="font-semibold">GF(2^8) construction</h2><p className="mt-2 text-sm text-slate-600">AES computes a multiplicative inverse in GF(2^8), treating 00 specially, then applies an affine transform. This gives nonlinear confusion without relying on secret S-box values.</p><WarningBadge>The table is public and fixed; never replace it with made-up values.</WarningBadge></div></section></div>;
}
`; },
};

// Reuse rich shells for groups not expanded inline in this generator.
for (const meta of Object.values(metaByPage)) {
  const file = pagePath(meta.page);
  if (custom[meta.page]) write(file, custom[meta.page](file));
  else write(file, simplePage(meta).replace(/import \{ AlgorithmPageShell \}.+;/, `import { AlgorithmPageShell } from "${relImport(file, "src/components/common/AlgorithmPageShell.tsx")}";`));
}

write("src/pages/algorithms/symmetric/aes/aesTables.ts", `
export const aesSBox = [
  0x63,0x7c,0x77,0x7b,0xf2,0x6b,0x6f,0xc5,0x30,0x01,0x67,0x2b,0xfe,0xd7,0xab,0x76,
  0xca,0x82,0xc9,0x7d,0xfa,0x59,0x47,0xf0,0xad,0xd4,0xa2,0xaf,0x9c,0xa4,0x72,0xc0,
  0xb7,0xfd,0x93,0x26,0x36,0x3f,0xf7,0xcc,0x34,0xa5,0xe5,0xf1,0x71,0xd8,0x31,0x15,
  0x04,0xc7,0x23,0xc3,0x18,0x96,0x05,0x9a,0x07,0x12,0x80,0xe2,0xeb,0x27,0xb2,0x75,
  0x09,0x83,0x2c,0x1a,0x1b,0x6e,0x5a,0xa0,0x52,0x3b,0xd6,0xb3,0x29,0xe3,0x2f,0x84,
  0x53,0xd1,0x00,0xed,0x20,0xfc,0xb1,0x5b,0x6a,0xcb,0xbe,0x39,0x4a,0x4c,0x58,0xcf,
  0xd0,0xef,0xaa,0xfb,0x43,0x4d,0x33,0x85,0x45,0xf9,0x02,0x7f,0x50,0x3c,0x9f,0xa8,
  0x51,0xa3,0x40,0x8f,0x92,0x9d,0x38,0xf5,0xbc,0xb6,0xda,0x21,0x10,0xff,0xf3,0xd2,
  0xcd,0x0c,0x13,0xec,0x5f,0x97,0x44,0x17,0xc4,0xa7,0x7e,0x3d,0x64,0x5d,0x19,0x73,
  0x60,0x81,0x4f,0xdc,0x22,0x2a,0x90,0x88,0x46,0xee,0xb8,0x14,0xde,0x5e,0x0b,0xdb,
  0xe0,0x32,0x3a,0x0a,0x49,0x06,0x24,0x5c,0xc2,0xd3,0xac,0x62,0x91,0x95,0xe4,0x79,
  0xe7,0xc8,0x37,0x6d,0x8d,0xd5,0x4e,0xa9,0x6c,0x56,0xf4,0xea,0x65,0x7a,0xae,0x08,
  0xba,0x78,0x25,0x2e,0x1c,0xa6,0xb4,0xc6,0xe8,0xdd,0x74,0x1f,0x4b,0xbd,0x8b,0x8a,
  0x70,0x3e,0xb5,0x66,0x48,0x03,0xf6,0x0e,0x61,0x35,0x57,0xb9,0x86,0xc1,0x1d,0x9e,
  0xe1,0xf8,0x98,0x11,0x69,0xd9,0x8e,0x94,0x9b,0x1e,0x87,0xe9,0xce,0x55,0x28,0xdf,
  0x8c,0xa1,0x89,0x0d,0xbf,0xe6,0x42,0x68,0x41,0x99,0x2d,0x0f,0xb0,0x54,0xbb,0x16
];
export const aesInvSBox = [
  0x52,0x09,0x6a,0xd5,0x30,0x36,0xa5,0x38,0xbf,0x40,0xa3,0x9e,0x81,0xf3,0xd7,0xfb,
  0x7c,0xe3,0x39,0x82,0x9b,0x2f,0xff,0x87,0x34,0x8e,0x43,0x44,0xc4,0xde,0xe9,0xcb,
  0x54,0x7b,0x94,0x32,0xa6,0xc2,0x23,0x3d,0xee,0x4c,0x95,0x0b,0x42,0xfa,0xc3,0x4e,
  0x08,0x2e,0xa1,0x66,0x28,0xd9,0x24,0xb2,0x76,0x5b,0xa2,0x49,0x6d,0x8b,0xd1,0x25,
  0x72,0xf8,0xf6,0x64,0x86,0x68,0x98,0x16,0xd4,0xa4,0x5c,0xcc,0x5d,0x65,0xb6,0x92,
  0x6c,0x70,0x48,0x50,0xfd,0xed,0xb9,0xda,0x5e,0x15,0x46,0x57,0xa7,0x8d,0x9d,0x84,
  0x90,0xd8,0xab,0x00,0x8c,0xbc,0xd3,0x0a,0xf7,0xe4,0x58,0x05,0xb8,0xb3,0x45,0x06,
  0xd0,0x2c,0x1e,0x8f,0xca,0x3f,0x0f,0x02,0xc1,0xaf,0xbd,0x03,0x01,0x13,0x8a,0x6b,
  0x3a,0x91,0x11,0x41,0x4f,0x67,0xdc,0xea,0x97,0xf2,0xcf,0xce,0xf0,0xb4,0xe6,0x73,
  0x96,0xac,0x74,0x22,0xe7,0xad,0x35,0x85,0xe2,0xf9,0x37,0xe8,0x1c,0x75,0xdf,0x6e,
  0x47,0xf1,0x1a,0x71,0x1d,0x29,0xc5,0x89,0x6f,0xb7,0x62,0x0e,0xaa,0x18,0xbe,0x1b,
  0xfc,0x56,0x3e,0x4b,0xc6,0xd2,0x79,0x20,0x9a,0xdb,0xc0,0xfe,0x78,0xcd,0x5a,0xf4,
  0x1f,0xdd,0xa8,0x33,0x88,0x07,0xc7,0x31,0xb1,0x12,0x10,0x59,0x27,0x80,0xec,0x5f,
  0x60,0x51,0x7f,0xa9,0x19,0xb5,0x4a,0x0d,0x2d,0xe5,0x7a,0x9f,0x93,0xc9,0x9c,0xef,
  0xa0,0xe0,0x3b,0x4d,0xae,0x2a,0xf5,0xb0,0xc8,0xeb,0xbb,0x3c,0x83,0x53,0x99,0x61,
  0x17,0x2b,0x04,0x7e,0xba,0x77,0xd6,0x26,0xe1,0x69,0x14,0x63,0x55,0x21,0x0c,0x7d
];
`);

write("src/pages/algorithms/symmetric/aes/aesEducationalCore.ts", `
import { aesSBox } from "./aesTables";
export const subBytes = (state: number[]) => state.map((byte) => aesSBox[byte]);
export const shiftRows = (state: number[]) => [state[0],state[5],state[10],state[15],state[4],state[9],state[14],state[3],state[8],state[13],state[2],state[7],state[12],state[1],state[6],state[11]];
`);

write("src/pages/algorithms/symmetric/des/desTables.ts", `
export const desSBoxes = [
[[14,4,13,1,2,15,11,8,3,10,6,12,5,9,0,7],[0,15,7,4,14,2,13,1,10,6,12,11,9,5,3,8],[4,1,14,8,13,6,2,11,15,12,9,7,3,10,5,0],[15,12,8,2,4,9,1,7,5,11,3,14,10,0,6,13]],
[[15,1,8,14,6,11,3,4,9,7,2,13,12,0,5,10],[3,13,4,7,15,2,8,14,12,0,1,10,6,9,11,5],[0,14,7,11,10,4,13,1,5,8,12,6,9,3,2,15],[13,8,10,1,3,15,4,2,11,6,7,12,0,5,14,9]],
[[10,0,9,14,6,3,15,5,1,13,12,7,11,4,2,8],[13,7,0,9,3,4,6,10,2,8,5,14,12,11,15,1],[13,6,4,9,8,15,3,0,11,1,2,12,5,10,14,7],[1,10,13,0,6,9,8,7,4,15,14,3,11,5,2,12]],
[[7,13,14,3,0,6,9,10,1,2,8,5,11,12,4,15],[13,8,11,5,6,15,0,3,4,7,2,12,1,10,14,9],[10,6,9,0,12,11,7,13,15,1,3,14,5,2,8,4],[3,15,0,6,10,1,13,8,9,4,5,11,12,7,2,14]],
[[2,12,4,1,7,10,11,6,8,5,3,15,13,0,14,9],[14,11,2,12,4,7,13,1,5,0,15,10,3,9,8,6],[4,2,1,11,10,13,7,8,15,9,12,5,6,3,0,14],[11,8,12,7,1,14,2,13,6,15,0,9,10,4,5,3]],
[[12,1,10,15,9,2,6,8,0,13,3,4,14,7,5,11],[10,15,4,2,7,12,9,5,6,1,13,14,0,11,3,8],[9,14,15,5,2,8,12,3,7,0,4,10,1,13,11,6],[4,3,2,12,9,5,15,10,11,14,1,7,6,0,8,13]],
[[4,11,2,14,15,0,8,13,3,12,9,7,5,10,6,1],[13,0,11,7,4,9,1,10,14,3,5,12,2,15,8,6],[1,4,11,13,12,3,7,14,10,15,6,8,0,5,9,2],[6,11,13,8,1,4,10,7,9,5,0,15,14,2,3,12]],
[[13,2,8,4,6,15,11,1,10,9,3,14,5,0,12,7],[1,15,13,8,10,3,7,4,12,5,6,11,0,14,9,2],[7,11,4,1,9,12,14,2,0,6,10,13,15,3,5,8],[2,1,14,7,4,10,8,13,15,12,9,0,3,5,6,11]]
];
export const desShiftSchedule = [1,1,2,2,2,2,2,2,1,2,2,2,2,2,2,1];
`);

write("src/pages/algorithms/symmetric/des/desEducationalCore.ts", `
import { desSBoxes } from "./desTables";
export const desSBoxOutput = (box: number, bits: string) => {
  const clean = bits.padEnd(6, "0").slice(0, 6);
  const row = parseInt(clean[0] + clean[5], 2);
  const col = parseInt(clean.slice(1, 5), 2);
  return desSBoxes[box][row][col].toString(2).padStart(4, "0");
};
`);

write("src/styles.css", `
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  html { color-scheme: light; }
  body { margin: 0; min-width: 320px; }
  button, input, textarea, select { font: inherit; }
}

@layer components {
  .btn { @apply inline-flex items-center justify-center gap-2 rounded-md border border-slate-300 bg-white px-3 py-2 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50 active:translate-y-px; }
  .icon-btn { @apply inline-flex h-9 w-9 items-center justify-center rounded-md border border-slate-300 bg-white text-slate-700 shadow-sm transition hover:bg-slate-50; }
  .icon-btn svg { @apply h-4 w-4; }
  .field { @apply w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm shadow-sm outline-none transition focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100; }
  .label { @apply text-sm font-medium text-slate-700; }
}
`);

console.log(`Generated ${pages.length} algorithm pages with unique routes.`);
