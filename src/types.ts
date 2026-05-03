export type SecurityStatus = "Modern" | "Legacy" | "Deprecated" | "Educational" | "Unsafe";
export type ImplementationStatus = "Real" | "Educational" | "Substitute";
export type BrowserSupport = "Web Crypto" | "Custom TypeScript" | "Educational Substitute" | "Mixed";

export interface NavigationItem {
  label: string;
  category: string;
  icon?: string;
  route: string;
  securityStatus: SecurityStatus;
  implementationStatus?: ImplementationStatus;
  browserSupport?: BrowserSupport;
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
