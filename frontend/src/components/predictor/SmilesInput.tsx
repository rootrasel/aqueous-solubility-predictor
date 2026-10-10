import React from 'react';
import { 
  FlaskConical, 
  Trash2, 
  Clipboard, 
  AlertCircle, 
  CheckCircle2, 
  HelpCircle,
  Loader2,
  Bookmark
} from 'lucide-react';
import { EXAMPLE_MOLECULES } from '../../utils/demoData';

interface SmilesInputProps {
  smiles: string;
  onSmilesChange: (value: string) => void;
  inputError: string | null;
  isLoading: boolean;
  loadingStatus: string;
  onPredict: () => void;
  onLoadExample: (smiles: string) => void;
  demoModeOnly: boolean;
}

export const SmilesInput: React.FC<SmilesInputProps> = ({
  smiles,
  onSmilesChange,
  inputError,
  isLoading,
  loadingStatus,
  onPredict,
  onLoadExample,
  demoModeOnly,
}) => {
  const handleClear = () => {
    onSmilesChange('');
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        onSmilesChange(text.trim());
      }
    } catch {
      // Clipboard permissions denied
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      if (!isLoading && smiles.trim() && !inputError) {
        onPredict();
      }
    }
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-6">
      <div className="space-y-4">
        {/* Panel Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-white tracking-tight">Molecular Input</h2>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/40">
                SMILES
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Enter a SMILES string to analyze your molecule.
            </p>
          </div>

          {/* Quick Actions: Clear & Paste */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePaste}
              className="p-1.5 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Paste from clipboard"
            >
              <Clipboard className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Paste</span>
            </button>
            <button
              type="button"
              onClick={handleClear}
              disabled={!smiles}
              className="p-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400 flex items-center gap-1 cursor-pointer"
              title="Clear input"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Clear</span>
            </button>
          </div>
        </div>

        {/* Input Area */}
        <div className="relative">
          <textarea
            value={smiles}
            onChange={(e) => onSmilesChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="e.g. CC(=O)Oc1ccccc1C(=O)O (Aspirin)"
            rows={3}
            className={`w-full p-4 rounded-xl font-mono text-sm sm:text-base leading-relaxed bg-navy-900/90 text-cyan-100 placeholder-slate-600 border transition-all resize-none focus:outline-none focus:ring-2 ${
              inputError
                ? 'border-rose-500/80 focus:border-rose-500 focus:ring-rose-500/20'
                : 'border-slate-700/80 hover:border-slate-600 focus:border-cyan-500 focus:ring-cyan-500/20'
            }`}
          />

          {/* Bottom metadata within textarea container */}
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-500 mt-1.5 px-1">
            <div className="flex items-center gap-1.5">
              {inputError ? (
                <span className="text-rose-400 flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{inputError}</span>
                </span>
              ) : smiles.trim() ? (
                <span className="text-emerald-400 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Valid SMILES syntax</span>
                </span>
              ) : (
                <span>Awaiting molecular formula...</span>
              )}
            </div>

            <div className="flex items-center gap-2">
              <span className="text-slate-500">
                {smiles.length} chars
              </span>
              <span className="text-slate-600 hidden sm:inline">•</span>
              <span className="text-slate-500 hidden sm:inline">
                Ctrl+Enter to predict
              </span>
            </div>
          </div>
        </div>

        {/* Example Molecule Selector */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 uppercase tracking-wider text-[11px] flex items-center gap-1">
              <Bookmark className="w-3 h-3 text-cyan-400" />
              <span>Sample Molecules</span>
            </span>
            <span className="text-slate-500 text-[11px]">Click to load</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {EXAMPLE_MOLECULES.map((mol) => {
              const isSelected = smiles.trim() === mol.smiles;
              return (
                <button
                  key={mol.name}
                  type="button"
                  onClick={() => onLoadExample(mol.smiles)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-mono transition-all border flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-500/60 shadow-sm shadow-cyan-500/20'
                      : 'bg-slate-900/90 text-slate-300 border-slate-800 hover:border-slate-700 hover:text-white'
                  }`}
                  title={`${mol.name} (${mol.formula}): ${mol.description}`}
                >
                  <span className="font-sans font-medium">{mol.name}</span>
                  <span className="text-[10px] text-slate-400">{mol.formula}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Helper Note explaining SMILES format */}
        <div className="rounded-lg p-3 bg-slate-900/60 border border-slate-800/80 text-xs text-slate-400 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-300 font-medium">
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>What is a SMILES string?</span>
          </div>
          <p className="text-[11px] text-slate-400 leading-normal">
            <strong>Simplified Molecular Input Line Entry System</strong> represents chemical structures using ASCII strings. For example, <code className="text-cyan-300 font-mono">CCO</code> represents ethanol (<span className="font-mono">CH₃CH₂OH</span>), where bonds and atom valencies are deduced algorithmically.
          </p>
        </div>
      </div>

      {/* Primary Action Button */}
      <div className="pt-2">
        <button
          type="button"
          onClick={onPredict}
          disabled={!smiles.trim() || !!inputError || isLoading}
          className={`w-full py-3.5 px-6 rounded-xl font-semibold text-sm sm:text-base flex items-center justify-center gap-2.5 transition-all shadow-lg ${
            !smiles.trim() || !!inputError
              ? 'bg-slate-800 text-slate-500 border border-slate-700/50 cursor-not-allowed'
              : isLoading
                ? 'bg-cyan-950 text-cyan-300 border border-cyan-800/80 cursor-wait'
                : 'bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-navy-950 font-bold shadow-cyan-500/20 hover:shadow-cyan-500/40 cursor-pointer active:scale-[0.99]'
          }`}
        >
          {isLoading ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin text-cyan-400" />
              <span>{loadingStatus || 'Analyzing molecule...'}</span>
            </>
          ) : (
            <>
              <FlaskConical className="w-5 h-5" />
              <span>Predict Solubility</span>
            </>
          )}
        </button>

        {demoModeOnly && (
          <p className="text-[11px] text-center text-amber-400/90 mt-2 font-mono">
            * Simulation Demo Mode is active. Prediction will be computed locally.
          </p>
        )}
      </div>
    </div>
  );
};
