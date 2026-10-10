import React from 'react';
import { 
  FileCode, 
  Binary, 
  Cpu, 
  FlaskConical, 
  Sparkles,
  Layers,
  Database
} from 'lucide-react';

export const WorkflowDiagram: React.FC = () => {
  const steps = [
    {
      number: '01',
      title: 'SMILES Ingestion & Normalization',
      tool: 'IUPAC / OpenSMILES Standard',
      icon: FileCode,
      color: 'text-cyan-400',
      bgColor: 'bg-cyan-500/10 border-cyan-500/30',
      description:
        'The input SMILES character sequence is validated for bracket balancing, correct ring closure indices, and canonicalized into a standardized molecular graph representation.',
      details: ['Grammar validation', 'Stereochemistry check', 'Kekulization'],
    },
    {
      number: '02',
      title: 'Molecular Parsing & Graph Sanitization',
      tool: 'RDKit Cheminformatics Engine',
      icon: Binary,
      color: 'text-teal-400',
      bgColor: 'bg-teal-500/10 border-teal-500/30',
      description:
        'RDKit parses atoms, bond orders, aromaticity rings, and implicit hydrogens into an in-memory chemical molecule entity, verifying chemical valence rules.',
      details: ['Valence sanity check', 'Aromaticity perception', 'Implicit hydrogen addition'],
    },
    {
      number: '03',
      title: 'Descriptor & Fingerprint Featurization',
      tool: 'Physicochemical & Morgan Featurizer',
      icon: Layers,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/10 border-indigo-500/30',
      description:
        'Calculates 2D molecular descriptors: Crippen LogP, Topological Polar Surface Area (TPSA), Molecular Weight, H-Bond Donors/Acceptors, and Circular Morgan Fingerprints (ECFP4).',
      details: ['Crippen cLogP', 'TPSA (Å²)', 'Rotatable bond count'],
    },
    {
      number: '04',
      title: 'Supervised Machine Learning Inference',
      tool: 'Random Forest & Gradient Boosted Ensemble',
      icon: Cpu,
      color: 'text-cyan-300',
      bgColor: 'bg-cyan-500/10 border-cyan-500/30',
      description:
        'The numerical descriptor vector is evaluated by the pre-trained regression model trained on the curated Delaney ESOL dataset, mapping multidimensional features to aqueous solubility.',
      details: ['100 Decision Trees', 'Non-linear feature splits', 'Delaney ESOL weights'],
    },
    {
      number: '05',
      title: 'Solubility Output & Clinical Classification',
      tool: 'MolecuLab AI Workspace UI',
      icon: FlaskConical,
      color: 'text-emerald-400',
      bgColor: 'bg-emerald-500/10 border-emerald-500/30',
      description:
        'The predicted logS (log mol/L) value is returned with associated confidence intervals, quantitative conversions (mg/mL, μg/mL), and biopharmaceutical developability classifications.',
      details: ['Thermodynamic log S', 'Concentration conversion', 'Lipinski RO5 check'],
    },
  ];

  return (
    <section id="methodology" className="py-16 md:py-24 border-t border-slate-800/80 bg-slate-950/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cheminformatics Pipeline</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            End-to-End Prediction Methodology
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            From raw string representation to quantitative thermodynamic solubility. Discover how our machine learning pipeline translates chemical structures into predictive insight.
          </p>
        </div>

        {/* Connected Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 relative">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="relative rounded-2xl glass-card p-5 border border-slate-700/70 hover:border-cyan-500/50 transition-all flex flex-col justify-between group"
              >
                {/* Step Top Bar */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-bold text-slate-400">
                      STEP {step.number}
                    </span>
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${step.bgColor}`}>
                      <Icon className={`w-4 h-4 ${step.color}`} />
                    </div>
                  </div>

                  <h3 className="font-bold text-sm text-white group-hover:text-cyan-300 transition-colors leading-snug">
                    {step.title}
                  </h3>

                  <div className="text-[10px] font-mono text-cyan-400/90 mt-1 mb-2">
                    {step.tool}
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Sub-features / bullets */}
                <div className="mt-4 pt-3 border-t border-slate-800/80 space-y-1">
                  {step.details.map((detail) => (
                    <div key={detail} className="flex items-center gap-1.5 text-[10px] font-mono text-slate-400">
                      <span className="w-1 h-1 rounded-full bg-cyan-400"></span>
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Explanatory Scientific Callout */}
        <div className="rounded-2xl border border-slate-700/80 bg-navy-900/60 p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Database className="w-4 h-4 text-cyan-400" />
              <span>Ground Truth Data: Delaney (ESOL) Benchmark</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              The underlying supervised model was trained on the Delaney aqueous solubility dataset, comprising 1,128 diverse organic molecules with experimentally validated log S values measured under standardized aqueous equilibrium conditions.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-xs font-mono text-cyan-400 font-bold">1,128</div>
              <div className="text-[10px] text-slate-500 font-mono">Compounds</div>
            </div>
            <div className="px-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-center">
              <div className="text-xs font-mono text-teal-400 font-bold">4-Fold</div>
              <div className="text-[10px] text-slate-500 font-mono">CV Split</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
