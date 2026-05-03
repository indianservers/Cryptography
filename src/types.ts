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

