/**
 * Types and interfaces for MolecuLab AI Aqueous Solubility Predictor
 */

export interface MolecularProperties {
  molecular_weight: number;
  logp: number;
  tpsa: number;
  h_bond_donors: number;
  h_bond_acceptors: number;
  rotatable_bonds?: number;
  heavy_atoms?: number;
  formula?: string;
  aromatic_proportion?: number;
}

export interface ModelMetadata {
  name: string;
  type: string;
  dataset: string;
  r2?: number | null;
  rmse?: number | null;
  mae?: number | null;
  version?: string;
}

export interface PredictionRequest {
  smiles: string;
}

export interface PredictionResponse {
  smiles: string;
  predicted_solubility: number;
  unit: string;
  molecular_properties: MolecularProperties;
  model: ModelMetadata;
  inference_time_ms?: number;
  timestamp?: string;
  is_demo?: boolean;
}

export type SolubilityCategory = 
  | 'highly_soluble'      // > 0
  | 'moderately_soluble'  // -2 to 0
  | 'slightly_soluble'    // -4 to -2
  | 'low_solubility'      // -6 to -4
  | 'insoluble';          // < -6

export interface SolubilityClassification {
  category: SolubilityCategory;
  label: string;
  color: string;
  badgeBg: string;
  badgeBorder: string;
  description: string;
  clinicalImpact: string;
}

export interface HistoryItem {
  id: string;
  smiles: string;
  predictedSolubility: number;
  unit: string;
  category: SolubilityCategory;
  categoryLabel: string;
  timestamp: string;
  molecularWeight?: number;
  formula?: string;
  isDemo?: boolean;
}

export interface ExampleMolecule {
  name: string;
  smiles: string;
  formula: string;
  description: string;
  category: string;
}

export interface EvaluationMetric {
  name: string;
  symbol: string;
  value: number;
  unit?: string;
  benchmarkTarget: string;
  description: string;
}

export interface ScatterDataPoint {
  compound: string;
  smiles: string;
  actual: number;
  predicted: number;
  residual: number;
  mw: number;
}
