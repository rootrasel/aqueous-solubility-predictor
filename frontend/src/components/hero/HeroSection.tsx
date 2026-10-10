import React from 'react';
import { ArrowDown, Sparkles, FlaskConical, BarChart3, Database } from 'lucide-react';
import { MolecularNetworkCanvas } from './MolecularNetworkCanvas';

interface HeroSectionProps {
  onPredictClick: () => void;
  onExploreEvaluation: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onPredictClick,
  onExploreEvaluation,
}) => {
  return (
    <section id="hero" className="relative pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden border-b border-slate-800/60 bg-grid-pattern">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-cyan-600/10 via-indigo-600/10 to-teal-500/10 blur-[100px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Headline and Actions */}
          <div className="lg:col-span-7 space-y-6 text-left">
            {/* Scientific Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
              <span>AI-Powered Cheminformatics</span>
              <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
              <span className="text-slate-400">ESOL Delaney Benchmark</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-white leading-[1.12]">
              Understand Molecular{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 text-glow-cyan">
                Solubility
              </span>{' '}
              with AI.
            </h1>

            {/* Supporting Description */}
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl font-normal leading-relaxed">
              Explore aqueous solubility predictions from molecular structures using cheminformatics and machine learning.
            </p>

            {/* SMILES Explanation Note */}
            <p className="text-sm text-slate-400 max-w-xl border-l-2 border-cyan-500/40 pl-3.5 py-0.5">
              Enter any standard SMILES string to extract 2D topological descriptors (LogP, TPSA, molecular weight) and compute estimated thermodynamic aqueous solubility (<span className="font-mono text-cyan-300">log mol/L</span>) in milliseconds.
            </p>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-wrap items-center gap-4">
              <button
                onClick={onPredictClick}
                className="inline-flex items-center gap-2.5 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 hover:from-cyan-400 hover:to-teal-400 text-navy-950 font-semibold text-base shadow-lg shadow-cyan-500/20 hover:shadow-cyan-500/40 transition-all duration-300 group cursor-pointer"
              >
                <FlaskConical className="w-5 h-5 text-navy-950 group-hover:scale-110 transition-transform" />
                <span>Predict a Molecule</span>
                <ArrowDown className="w-4 h-4 ml-0.5 group-hover:translate-y-0.5 transition-transform" />
              </button>

              <button
                onClick={onExploreEvaluation}
                className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900/80 hover:bg-slate-850 border border-slate-700/80 hover:border-cyan-500/40 text-slate-200 font-medium text-sm transition-all duration-200"
              >
                <BarChart3 className="w-4 h-4 text-cyan-400" />
                <span>Model Evaluation & R²</span>
              </button>
            </div>

            {/* Quick Feature Badges */}
            <div className="pt-4 grid grid-cols-3 gap-3 max-w-lg border-t border-slate-800/80">
              <div className="space-y-0.5">
                <div className="text-xs font-mono text-cyan-400 font-semibold">R² = 0.87</div>
                <div className="text-[11px] text-slate-400">Test Accuracy</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-mono text-teal-400 font-semibold">&lt; 25 ms</div>
                <div className="text-[11px] text-slate-400">Inference Latency</div>
              </div>
              <div className="space-y-0.5">
                <div className="text-xs font-mono text-indigo-400 font-semibold">1,128 Compounds</div>
                <div className="text-[11px] text-slate-400">Trained Dataset</div>
              </div>
            </div>
          </div>

          {/* Right Column: Molecular Illustration with Interactive Network */}
          <div className="lg:col-span-5 relative">
            <div className="relative w-full h-[360px] sm:h-[400px] rounded-2xl glass-card overflow-hidden p-6 border border-slate-700/60 shadow-2xl flex flex-col justify-between">
              {/* Animated Canvas */}
              <MolecularNetworkCanvas />

              {/* Decorative Header Overlay */}
              <div className="relative z-10 flex items-center justify-between border-b border-slate-800/80 pb-3">
                <div className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-pulse"></div>
                  <span className="text-xs font-mono text-slate-300">Cheminformatics Visualizer</span>
                </div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/90 text-cyan-300 border border-slate-700">
                  2D Graph Topology
                </span>
              </div>

              {/* Central Molecule Callout */}
              <div className="relative z-10 text-center my-auto p-4 rounded-xl bg-navy-900/60 backdrop-blur-sm border border-slate-800/60">
                <div className="text-xs font-mono text-cyan-400 uppercase tracking-widest mb-1">
                  Target Property
                </div>
                <div className="text-2xl font-bold text-white tracking-tight">
                  Aqueous Solubility <span className="text-cyan-400 font-mono">(log S)</span>
                </div>
                <p className="text-xs text-slate-400 mt-1.5 max-w-xs mx-auto">
                  Essential for biopharmaceutical classification, oral bioavailability, and early lead optimization.
                </p>
              </div>

              {/* Footer Meta */}
              <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-800/80">
                <div className="flex items-center gap-1.5 font-mono">
                  <Database className="w-3.5 h-3.5 text-slate-500" />
                  <span>Delaney ESOL</span>
                </div>
                <div className="font-mono text-cyan-400">
                  Unit: log₁₀(mol/L)
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
