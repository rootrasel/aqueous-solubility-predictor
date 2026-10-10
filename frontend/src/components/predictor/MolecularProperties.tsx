import React from 'react';
import { 
  Scale, 
  Droplet, 
  Activity, 
  GitFork, 
  CheckCircle2, 
  AlertCircle, 
  Hash
} from 'lucide-react';
import type { MolecularProperties as IMolecularProperties } from '../../types/prediction';
import { evaluateLipinski } from '../../utils/chemistry';

interface MolecularPropertiesProps {
  properties: IMolecularProperties;
}

export const MolecularProperties: React.FC<MolecularPropertiesProps> = ({ properties }) => {
  const lipinski = evaluateLipinski(properties);

  const propItems = [
    {
      label: 'Molecular Weight',
      value: properties.molecular_weight ? `${properties.molecular_weight} g/mol` : 'N/A',
      symbol: 'MW',
      icon: Scale,
      rulePass: lipinski.mwPass,
      ruleThreshold: '≤ 500 Da',
      desc: 'Sum of atomic masses in the chemical entity.'
    },
    {
      label: 'Calculated LogP',
      value: properties.logp !== undefined ? properties.logp.toFixed(2) : 'N/A',
      symbol: 'cLogP',
      icon: Droplet,
      rulePass: lipinski.logpPass,
      ruleThreshold: '≤ 5.0',
      desc: 'Octanol/water partition coefficient; index of lipophilicity.'
    },
    {
      label: 'Polar Surface Area',
      value: properties.tpsa !== undefined ? `${properties.tpsa} Å²` : 'N/A',
      symbol: 'TPSA',
      icon: Activity,
      desc: 'Surface sum over all polar atoms (O, N, attached H); correlates with cell permeability.'
    },
    {
      label: 'H-Bond Donors',
      value: properties.h_bond_donors !== undefined ? properties.h_bond_donors : 'N/A',
      symbol: 'HBD',
      icon: GitFork,
      rulePass: lipinski.hbdPass,
      ruleThreshold: '≤ 5',
      desc: 'Count of O-H and N-H hydrogen bond donor groups.'
    },
    {
      label: 'H-Bond Acceptors',
      value: properties.h_bond_acceptors !== undefined ? properties.h_bond_acceptors : 'N/A',
      symbol: 'HBA',
      icon: GitFork,
      rulePass: lipinski.hbaPass,
      ruleThreshold: '≤ 10',
      desc: 'Count of N and O atoms capable of accepting hydrogen bonds.'
    },
    {
      label: 'Heavy Atoms',
      value: properties.heavy_atoms !== undefined ? properties.heavy_atoms : 'N/A',
      symbol: 'NHA',
      icon: Hash,
      desc: 'Count of all non-hydrogen atoms in the molecular graph.'
    },
  ];

  return (
    <div className="rounded-2xl glass-card p-6 border border-slate-700/80 shadow-xl space-y-6">
      {/* Header with Lipinski Rule of 5 summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
        <div>
          <h3 className="text-lg font-bold text-white tracking-tight">Molecular Descriptors</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Key physicochemical properties driving aqueous solvation & membrane permeability.
          </p>
        </div>

        {/* Lipinski Badge */}
        <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono font-medium border ${
          lipinski.isCompliant
            ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
            : 'bg-amber-950/40 border-amber-500/40 text-amber-300'
        }`}>
          {lipinski.isCompliant ? (
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          ) : (
            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
          )}
          <span>
            Lipinski Rule of 5: {lipinski.isCompliant ? 'Compliant' : `${lipinski.violationsCount} Violation(s)`}
          </span>
        </div>
      </div>

      {/* Grid of Properties */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3.5">
        {propItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="rounded-xl bg-navy-900/80 border border-slate-800/80 p-3.5 hover:border-slate-700 transition-colors group flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[11px] font-mono text-slate-400 uppercase tracking-wider">
                    {item.symbol}
                  </span>
                  <Icon className="w-3.5 h-3.5 text-slate-500 group-hover:text-cyan-400 transition-colors" />
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {item.label}
                </div>
              </div>

              <div className="mt-3">
                <div className="text-base sm:text-lg font-bold font-mono text-white tracking-tight">
                  {item.value}
                </div>
                {item.ruleThreshold && (
                  <div className="text-[10px] font-mono text-slate-500 mt-0.5 flex items-center justify-between">
                    <span>Limit: {item.ruleThreshold}</span>
                    <span className={item.rulePass ? 'text-emerald-400' : 'text-amber-400'}>
                      {item.rulePass ? '✓' : '✗'}
                    </span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Rotatable Bonds & Heavy Atom extra footnote if available */}
      {properties.rotatable_bonds !== undefined && (
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-900/40 rounded-lg p-2.5 border border-slate-800/60">
          <span>Rotatable Bonds: <strong className="text-slate-200">{properties.rotatable_bonds}</strong></span>
          {properties.formula && <span>Formula: <strong className="text-cyan-300">{properties.formula}</strong></span>}
          {properties.aromatic_proportion !== undefined && (
            <span>Aromatic Proportion: <strong className="text-slate-200">{(properties.aromatic_proportion * 100).toFixed(0)}%</strong></span>
          )}
        </div>
      )}
    </div>
  );
};
