import React from 'react';
import { SmilesInput } from './SmilesInput';
import { MoleculeViewer } from './MoleculeViewer';
import { PredictionResult } from './PredictionResult';
import { MolecularProperties } from './MolecularProperties';
import { ModelInfoCard } from './ModelInfoCard';
import { PredictionHistory } from './PredictionHistory';
import type { PredictionResponse, HistoryItem } from '../../types/prediction';

interface PredictionWorkspaceProps {
  smiles: string;
  onSmilesChange: (value: string) => void;
  inputError: string | null;
  isLoading: boolean;
  loadingStatus: string;
  result: PredictionResponse | null;
  predictionError: string | null;
  onPredict: () => void;
  onLoadExample: (smiles: string) => void;
  demoModeOnly: boolean;
  history: HistoryItem[];
  onReloadFromHistory: (smiles: string) => void;
  onClearHistory: () => void;
}

export const PredictionWorkspace: React.FC<PredictionWorkspaceProps> = ({
  smiles,
  onSmilesChange,
  inputError,
  isLoading,
  loadingStatus,
  result,
  predictionError,
  onPredict,
  onLoadExample,
  demoModeOnly,
  history,
  onReloadFromHistory,
  onClearHistory,
}) => {
  return (
    <section id="predictor" className="py-12 md:py-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
      {/* Workspace Section Header */}
      <div className="space-y-2 text-left">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
          <span>Prediction Workbench</span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Molecular Input & Visualization Workspace
        </h2>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Submit valid chemical SMILES representations to inspect 2D topological graph structures and calculate aqueous thermodynamic solubility predictions.
        </p>
      </div>

      {/* Main Two-Panel Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
        
        {/* Left Panel: Molecular Input */}
        <div className="lg:col-span-6 rounded-2xl glass-card p-6 sm:p-7 border border-slate-700/80 shadow-2xl flex flex-col justify-between">
          <SmilesInput
            smiles={smiles}
            onSmilesChange={onSmilesChange}
            inputError={inputError}
            isLoading={isLoading}
            loadingStatus={loadingStatus}
            onPredict={onPredict}
            onLoadExample={onLoadExample}
            demoModeOnly={demoModeOnly}
          />
        </div>

        {/* Right Panel: Molecular Visualization */}
        <div className="lg:col-span-6 rounded-2xl glass-card p-6 sm:p-7 border border-slate-700/80 shadow-2xl flex flex-col justify-between">
          <MoleculeViewer
            smiles={smiles}
            isLoading={isLoading}
          />
        </div>

      </div>

      {/* Backend / Prediction Error Notification */}
      {predictionError && (
        <div className="rounded-xl border border-rose-600/50 bg-rose-950/40 p-5 text-rose-200 flex items-start gap-3 shadow-lg">
          <div className="w-2.5 h-2.5 rounded-full bg-rose-400 mt-1.5 shrink-0 animate-ping"></div>
          <div>
            <h4 className="font-semibold text-rose-100 text-sm">Prediction Request Failed</h4>
            <p className="text-xs text-rose-200/90 mt-1 leading-relaxed">{predictionError}</p>
          </div>
        </div>
      )}

      {/* Results Section (Appears after successful prediction) */}
      {result && (
        <div id="results" className="space-y-8 animate-fadeIn pt-4">
          <div className="border-t border-slate-800/80 pt-8 flex items-center justify-between">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-cyan-400 font-semibold">
                Inference Complete
              </span>
              <h3 className="text-2xl font-bold text-white tracking-tight mt-0.5">
                Solubility Prediction & Descriptors
              </h3>
            </div>
            <span className="text-xs font-mono text-slate-400 hidden sm:inline">
              Target: Aqueous Solubility (log S)
            </span>
          </div>

          {/* 1. Main Predicted Aqueous Solubility Card */}
          <PredictionResult result={result} />

          {/* 2. Molecular Properties & 3. Model Info Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-7">
              <MolecularProperties properties={result.molecular_properties} />
            </div>
            <div className="lg:col-span-5">
              <ModelInfoCard model={result.model} />
            </div>
          </div>
        </div>
      )}

      {/* Prediction History Section */}
      <div className="pt-4">
        <PredictionHistory
          history={history}
          onReload={onReloadFromHistory}
          onClear={onClearHistory}
        />
      </div>
    </section>
  );
};
