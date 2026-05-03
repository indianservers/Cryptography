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

