export type GuidedPanel = "input" | "output" | "animation" | "formula" | "warning" | "checkpoint";

export interface GuidedStep {
  id: string;
  title: string;
  instruction: string;
  learnerAction: string;
  expectedObservation: string;
  hint?: string;
  relatedPanel?: GuidedPanel;
  safetyNote?: string;
}

export interface GuidedLesson {
  route: string;
  title: string;
  estimatedMinutes: number;
  objective: string;
  steps: GuidedStep[];
  completionMessage: string;
  nextSuggestedRoutes?: string[];
}

export const requiredGuidedRoutes = [
  "/algorithms/classical/caesar-cipher",
  "/algorithms/classical/vigenere-cipher",
  "/algorithms/asymmetric/diffie-hellman",
  "/algorithms/asymmetric/rsa-key-generation",
  "/algorithms/asymmetric/rsa-encryption",
  "/algorithms/asymmetric/rsa-decryption",
  "/algorithms/hash/sha-256-step",
  "/algorithms/hash/sha3",
  "/algorithms/mac/hmac",
  "/algorithms/kdf/pbkdf2",
  "/algorithms/encoding/base64",
  "/algorithms/encoding/hex",
  "/algorithms/symmetric/aes-mix-columns",
  "/algorithms/symmetric/aes-key-expansion",
  "/algorithms/blockchain/merkle-tree",
  "/algorithms/math/modular-arithmetic",
  "/algorithms/math/gf256",
  "/algorithms/attacks/ecb-pattern-leakage",
  "/algorithms/attacks/ecdsa-nonce-reuse",
  "/algorithms/attacks/padding-oracle-concept",
] as const;

const titles: Record<(typeof requiredGuidedRoutes)[number], string> = {
  "/algorithms/classical/caesar-cipher": "Caesar Cipher",
  "/algorithms/classical/vigenere-cipher": "Vigenere Cipher",
  "/algorithms/asymmetric/diffie-hellman": "Diffie-Hellman",
  "/algorithms/asymmetric/rsa-key-generation": "RSA Key Generation",
  "/algorithms/asymmetric/rsa-encryption": "RSA Encryption",
  "/algorithms/asymmetric/rsa-decryption": "RSA Decryption",
  "/algorithms/hash/sha-256-step": "SHA-256 Step Visualizer",
  "/algorithms/hash/sha3": "SHA-3",
  "/algorithms/mac/hmac": "HMAC",
  "/algorithms/kdf/pbkdf2": "PBKDF2",
  "/algorithms/encoding/base64": "Base64",
  "/algorithms/encoding/hex": "Hex",
  "/algorithms/symmetric/aes-mix-columns": "AES MixColumns",
  "/algorithms/symmetric/aes-key-expansion": "AES Key Expansion",
  "/algorithms/blockchain/merkle-tree": "Merkle Tree",
  "/algorithms/math/modular-arithmetic": "Modular Arithmetic",
  "/algorithms/math/gf256": "GF(2^8)",
  "/algorithms/attacks/ecb-pattern-leakage": "ECB Pattern Leakage",
  "/algorithms/attacks/ecdsa-nonce-reuse": "ECDSA Nonce Reuse",
  "/algorithms/attacks/padding-oracle-concept": "Padding Oracle Concept",
};

const safetyFor = (route: string) => route.includes("/attacks/")
  ? "Use only the toy local example and focus on the mitigation."
  : route.includes("rsa") || route.includes("diffie") || route.includes("key") || route.includes("pbkdf2") || route.includes("hmac")
    ? "Use sample values only. Do not paste production secrets."
    : undefined;

function lesson(route: (typeof requiredGuidedRoutes)[number]): GuidedLesson {
  const title = titles[route];
  const attack = route.includes("/attacks/");
  return {
    route,
    title,
    estimatedMinutes: attack ? 6 : 5,
    objective: `Follow ${title} from safe sample input through the visible result, while preserving the page safety boundary.`,
    steps: [
      {
        id: "read-boundary",
        title: "Read the boundary",
        instruction: "Start with the status badges and safety card before using the page.",
        learnerAction: "Identify whether the page is exact, conceptual, deprecated, unsafe, or secret-sensitive.",
        expectedObservation: "The safety wording tells you how far the page's result should be trusted.",
        relatedPanel: "warning",
        safetyNote: safetyFor(route),
      },
      {
        id: "use-sample",
        title: "Use the sample values",
        instruction: "Keep the default or toy sample inputs for this walkthrough.",
        learnerAction: "Run or inspect the demo using sample values only.",
        expectedObservation: "The output should be understandable without any production secret or external target.",
        relatedPanel: "input",
        hint: "If a field mentions a key, password, nonce, or private value, keep it fictional.",
        safetyNote: safetyFor(route),
      },
      {
        id: "watch-animation",
        title: "Connect step to result",
        instruction: "Use the visual walkthrough or step panel to inspect one highlighted stage.",
        learnerAction: "Move to the next visual step and read the narration.",
        expectedObservation: "The highlighted step explains why the final value changed.",
        relatedPanel: "animation",
      },
      {
        id: attack ? "find-mitigation" : "check-output",
        title: attack ? "Name the mitigation" : "Check the final result",
        instruction: attack ? "Describe what prevents this issue in a real design." : "Compare the final output with the formula or rule.",
        learnerAction: attack ? "Write the mitigation in your own words." : "Read the final output and one intermediate value.",
        expectedObservation: attack ? "The lesson ends with defensive design, not operational misuse." : "Intermediate values and final output are visually separate.",
        relatedPanel: attack ? "warning" : "output",
        safetyNote: attack ? "Defensive interpretation only." : undefined,
      },
    ],
    completionMessage: `You completed the guided ${title} walkthrough using safe, local, educational values.`,
    nextSuggestedRoutes: route.includes("caesar") ? ["/algorithms/classical/vigenere-cipher", "/algorithms/attacks/caesar-brute-force"] : undefined,
  };
}

export const moduleGuidedContent = Object.fromEntries(requiredGuidedRoutes.map((route) => [route, lesson(route)])) as Record<string, GuidedLesson>;

export const moduleGuidedEntries = Object.values(moduleGuidedContent).sort((left, right) => left.route.localeCompare(right.route));

export function getGuidedLesson(route: string) {
  return moduleGuidedContent[route];
}
