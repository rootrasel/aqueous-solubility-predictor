import React, { useState } from 'react';
import { 
  Copy, 
  Check, 
  Sparkles, 
  AlertTriangle, 
  Info, 
  HelpCircle,
  Clock,
  Compass
} from 'lucide-react';
import type { PredictionResponse } from '../../types/prediction';
import { classifySolubility, convertLogSToConcentrations } from '../../utils/chemistry';

interface PredictionResultProps {
  result: PredictionResponse;
}

export const PredictionResult: React.FC<PredictionResultProps> = ({ result }) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [showUnitHelper, setShowUnitHelper] = useState<boolean>(false);

  const classification = classifySolubility(result.predicted_solubility);
  const mw = result.molecular_properties?.molecular_weight || 100;
  const concentrations = convertLogSToConcentrations(result.predicted_solubility, mw);

  const handleCopyResult = async () => {
    const textToCopy = `Solubility for ${result.smiles}: ${result.predicted_solubility} ${result.unit} (${classification.label})`;
    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  // Solubility scale intervals: -8 to +2
  // We compute position percentage: min -8 = 0%, max +2 = 100%
  const minScale = -8;
  const maxScale = 2;
  const clampedVal = Math.min(Math.max(result.predicted_solubility, minScale), maxScale);
  const markerPercent = ((clampedVal - minScale) / (maxScale - minScale)) * 100;

  return (
    <div className="space-y-6">
      {/* Simulation / Demo Mode Notice Banner if applicable */}
      {result.is_demo && (
        <div className="rounded-xl border border-amber-600/50 bg-amber-950/30 p-4 flex items-center justify-between gap-3 text-xs text-amber-200">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>Simulation / Demo Mode Active:</strong> Prediction calculated locally via Delaney topological heuristics because the FastAPI backend is currently on standby. Connect your backend to use the trained ML model.
            </span>
          </div>
          <span className="font-mono text-[10px] uppercase px-2 py-0.5 rounded bg-amber-900/60 text-amber-300 shrink-0">
            Local Simulation
          </span>
        </div>
      )}

      {/* Main Result Showcase Card */}
      <div className="relative rounded-2xl glass-card p-6 sm:p-8 border border-slate-700/80 shadow-2xl overflow-hidden">
        {/* Ambient background glow matching the classification color */}
        <div 
          className="absolute -top-12 -right-12 w-64 h-64 rounded-full blur-[90px] opacity-20 pointer-events-none transition-all duration-700"
          style={{ backgroundColor: classification.color }}
        />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-800/80 pb-6">
          {/* Numerical Result & Unit */}
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-mono font-semibold uppercase tracking-wider text-slate-400">
                Predicted Aqueous Solubility (ESOL)
              </span>
              <button
                type="button"
                onClick={() => setShowUnitHelper(!showUnitHelper)}
                className="text-slate-400 hover:text-cyan-300 transition-colors cursor-pointer"
                title="What is log mol/L?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <span 
                className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight font-mono"
                style={{ color: classification.color }}
              >
                {result.predicted_solubility > 0 ? `+${result.predicted_solubility.toFixed(2)}` : result.predicted_solubility.toFixed(2)}
              </span>
              
              <span className="text-xl sm:text-2xl font-mono text-slate-300 font-medium">
                {result.unit || 'log mol/L'}
              </span>

              {/* Classification Pill */}
              <div className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border ${classification.badgeBg} ${classification.badgeBorder} ml-2 flex items-center gap-1.5`}>
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: classification.color }} />
                <span>{classification.label}</span>
              </div>
            </div>

            {/* Inferred Concentrations in mg/mL and g/L */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs font-mono text-slate-400 mt-3">
              <span>
                ≈ <strong className="text-slate-200">{concentrations.mgPerMlFormatted}</strong> mg/mL
              </span>
              <span>•</span>
              <span>
                ≈ <strong className="text-slate-200">{concentrations.ugPerMlFormatted}</strong> μg/mL
              </span>
              <span>•</span>
              <span>
                Molarity: <strong className="text-slate-200">{concentrations.molarityFormatted}</strong> M
              </span>
            </div>
          </div>

          {/* Action buttons: Copy Result & Timestamp */}
          <div className="flex flex-col sm:items-end justify-between gap-3 shrink-0">
            <button
              onClick={handleCopyResult}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 border border-slate-700/80 hover:border-slate-600 text-slate-200 text-xs font-medium transition-all shadow-sm group cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied to Clipboard!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4 text-slate-400 group-hover:text-cyan-300 transition-colors" />
                  <span>Copy Prediction</span>
                </>
              )}
            </button>

            {result.inference_time_ms && (
              <div className="flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
                <Clock className="w-3 h-3 text-slate-500" />
                <span>Latency: {result.inference_time_ms} ms</span>
              </div>
            )}
          </div>
        </div>

        {/* Solubility Spectrum Gauge */}
        <div className="pt-6 space-y-3">
          <div className="flex items-center justify-between text-xs font-mono text-slate-400">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-cyan-400" />
              <span>Biopharmaceutical Solubility Spectrum</span>
            </span>
            <span className="text-[11px] text-slate-500">Scale: -8.0 to +2.0 log S</span>
          </div>

          {/* Color Gradient Track */}
          <div className="relative w-full h-3 rounded-full bg-gradient-to-r from-rose-600 via-orange-500 via-amber-400 via-cyan-400 to-emerald-400 p-[1px] shadow-inner">
            {/* Position Pin Marker */}
            <div 
              className="absolute -top-1.5 -bottom-1.5 w-3 bg-white rounded-full shadow-lg border-2 border-navy-950 transition-all duration-500 -translate-x-1/2 ring-2 ring-cyan-400/80"
              style={{ left: `${markerPercent}%` }}
              title={`Current Prediction: ${result.predicted_solubility} log mol/L`}
            />
          </div>

          {/* Scale Labels */}
          <div className="flex justify-between text-[10px] font-mono text-slate-400 pt-1">
            <span className="text-rose-400">&lt; -6.0 (Insoluble)</span>
            <span className="text-orange-400 hidden sm:inline">-4.0 to -6.0 (Low)</span>
            <span className="text-amber-400">-2.0 to -4.0 (Slight)</span>
            <span className="text-cyan-400 hidden sm:inline">0.0 to -2.0 (Moderate)</span>
            <span className="text-emerald-400">&gt; 0.0 (High)</span>
          </div>
        </div>

        {/* Clinical / Scientific Interpretation */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl bg-navy-900/60 border border-slate-800 p-4">
            <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Biochemical Interpretation</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {classification.description}
            </p>
          </div>

          <div className="rounded-xl bg-navy-900/60 border border-slate-800 p-4">
            <div className="text-xs font-mono text-indigo-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5" />
              <span>Pharmacokinetic Impact</span>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {classification.clinicalImpact}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
