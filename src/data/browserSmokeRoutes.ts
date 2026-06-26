export interface BrowserSmokeExpectation {
  route: string;
  expectsHeader: boolean;
  expectsSafetyStatus: boolean;
  expectsLearning: boolean;
  expectsAnimation: boolean;
  expectsMainContent: boolean;
  mobileOverflowCheck: boolean;
}

export const browserSmokeRoutes: BrowserSmokeExpectation[] = [
  { route: "/", expectsHeader: false, expectsSafetyStatus: false, expectsLearning: false, expectsAnimation: false, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/classical/caesar-cipher", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: false, expectsAnimation: true, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/classical/affine-cipher", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: true, expectsAnimation: false, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/asymmetric/diffie-hellman", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: true, expectsAnimation: true, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/asymmetric/rsa-key-generation", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: true, expectsAnimation: true, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/hash/sha-256-step", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: false, expectsAnimation: true, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/hash/sha3", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: true, expectsAnimation: true, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/kdf/pbkdf2", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: true, expectsAnimation: true, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/kdf/argon2", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: false, expectsAnimation: false, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/mac/hmac", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: true, expectsAnimation: true, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/encoding/base64", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: true, expectsAnimation: true, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/symmetric/aes-mix-columns", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: true, expectsAnimation: true, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/blockchain/merkle-tree", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: false, expectsAnimation: true, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/attacks/ecb-pattern-leakage", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: true, expectsAnimation: false, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/pki/x509-certificate-viewer", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: false, expectsAnimation: false, expectsMainContent: true, mobileOverflowCheck: true },
  { route: "/algorithms/tools/export-center", expectsHeader: true, expectsSafetyStatus: true, expectsLearning: false, expectsAnimation: false, expectsMainContent: true, mobileOverflowCheck: true },
];
