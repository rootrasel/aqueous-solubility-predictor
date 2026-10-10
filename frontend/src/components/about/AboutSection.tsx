import React from 'react';
import { BookOpen, Code2, Database, ShieldCheck, Server } from 'lucide-react';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cheminformatics Knowledge Base</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            About MolecuLab AI & Solubility Science
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Understanding why aqueous solubility is a cornerstone of biopharmaceutical drug discovery, computational chemistry, and lead compound optimization.
          </p>
        </div>

        {/* 3 Pillars Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1: Clinical Importance */}
          <div className="rounded-2xl glass-card p-6 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">Why Solubility Matters in ADMET</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Aqueous solubility directly limits the maximum achievable systemic drug concentration in gastrointestinal fluids. Insufficient solubility leads to poor oral bioavailability, erratic pharmacokinetics, and is a leading cause of candidate attrition during drug development.
            </p>
          </div>

          {/* Card 2: Delaney ESOL Dataset */}
          <div className="rounded-2xl glass-card p-6 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-teal-500/10 border border-teal-500/30 flex items-center justify-center text-teal-400">
              <Database className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">The Delaney (ESOL) Benchmark</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Published by John S. Delaney in 2004, the Estimated SOLubility (ESOL) dataset remains a canonical benchmark in cheminformatics. It demonstrates that aqueous solubility can be predicted from simple molecular properties: LogP, Molecular Weight, and aromatic proportion.
            </p>
          </div>

          {/* Card 3: Modern ML & Descriptors */}
          <div className="rounded-2xl glass-card p-6 border border-slate-700/80 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
              <Code2 className="w-5 h-5" />
            </div>
            <h3 className="text-base font-bold text-white">RDKit & Supervised Ensembles</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Modern AI solubility modeling uses RDKit topological descriptors and Morgan ECFP fingerprints combined with non-linear tree ensembles (Random Forests, XGBoost) to capture subtle structural modifications, hydrogen bonding networks, and steric hindrance.
            </p>
          </div>
        </div>

        {/* Backend API Integration Reference */}
        <div className="rounded-2xl glass-card p-6 sm:p-8 border border-slate-700/80 space-y-4">
          <div className="flex items-center gap-2">
            <Server className="w-5 h-5 text-cyan-400" />
            <h3 className="text-lg font-bold text-white tracking-tight">FastAPI Backend Integration Contract</h3>
          </div>
          <p className="text-xs sm:text-sm text-slate-400">
            MolecuLab AI connects to a high-performance Python FastAPI service hosted at <code className="text-cyan-300 font-mono">VITE_API_BASE_URL</code>.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
            {/* Request Schema */}
            <div className="rounded-xl bg-navy-900/90 p-4 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-cyan-400 uppercase tracking-wider flex items-center justify-between">
                <span>POST /api/v1/predict</span>
                <span className="text-slate-500">JSON Request</span>
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-2 rounded bg-slate-950/80">
{`{
  "smiles": "CCO"
}`}
              </pre>
            </div>

            {/* Response Schema */}
            <div className="rounded-xl bg-navy-900/90 p-4 border border-slate-800 space-y-2">
              <div className="text-[11px] font-mono text-teal-400 uppercase tracking-wider flex items-center justify-between">
                <span>HTTP 200 OK</span>
                <span className="text-slate-500">JSON Response</span>
              </div>
              <pre className="text-xs font-mono text-slate-300 overflow-x-auto p-2 rounded bg-slate-950/80">
{`{
  "smiles": "CCO",
  "predicted_solubility": -0.5,
  "unit": "log mol/L",
  "molecular_properties": {
    "molecular_weight": 46.07,
    "logp": -0.0,
    "tpsa": 20.23,
    "h_bond_donors": 1,
    "h_bond_acceptors": 1
  },
  "model": {
    "name": "ESOL Solubility Predictor",
    "type": "Random Forest",
    "dataset": "ESOL"
  }
}`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
