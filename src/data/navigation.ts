import type { NavigationItem } from "../types";
import { algorithmMetadata } from "./algorithmMetadata";
import { getBrowserSupport, getImplementationStatus } from "./implementationStatus";

export const navigationItems: NavigationItem[] = algorithmMetadata.map(({ label, category, icon, route, securityStatus }) => ({
  label,
  category,
  icon: icon ?? "Shield",
  route,
  securityStatus,
  implementationStatus: getImplementationStatus(route),
  browserSupport: getBrowserSupport(route),
})).concat([{
  label: "AES Rounds",
  category: "Block Ciphers",
  icon: "Box",
  route: "/algorithms/symmetric/aes-rounds",
  securityStatus: "Educational",
  implementationStatus: "Real",
  browserSupport: "Custom TypeScript",
}, {
  label: "AES Test Vectors",
  category: "Block Ciphers",
  icon: "Box",
  route: "/algorithms/symmetric/aes-test-vectors",
  securityStatus: "Educational",
  implementationStatus: "Real",
  browserSupport: "Web Crypto",
}, {
  label: "Implementation Audit",
  category: "Benchmark and Comparison",
  icon: "Gauge",
  route: "/algorithms/tools/audit",
  securityStatus: "Educational",
  implementationStatus: "Real",
  browserSupport: "Custom TypeScript",
}, {
  label: "Global Test Vectors",
  category: "Benchmark and Comparison",
  icon: "Gauge",
  route: "/algorithms/tools/test-vectors",
  securityStatus: "Educational",
  implementationStatus: "Real",
  browserSupport: "Mixed",
}]);

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
