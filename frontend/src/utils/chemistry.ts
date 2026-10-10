import type { MolecularProperties, SolubilityClassification } from '../types/prediction';

/**
 * Classify predicted aqueous solubility (log mol/L, ESOL Delaney scale)
 * 
 * Standard pharmaceutical / medicinal chemistry classification:
 * log S > 0: Highly soluble (> 1 mol/L)
 * -2 to 0: Moderately soluble (optimal oral drug bioavailability)
 * -4 to -2: Slightly soluble (acceptable for typical drugs, formulation may be needed)
 * -6 to -4: Low solubility (poor bioavailability, micronization/nanoparticles often needed)
 * < -6: Practically insoluble (severe developability liability)
 */
export const classifySolubility = (logS: number): SolubilityClassification => {
  if (logS > 0) {
    return {
      category: 'highly_soluble',
      label: 'Highly Soluble',
      color: '#34d399', // Emerald
      badgeBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30',
      badgeBorder: 'border-emerald-500/40',
      description: 'Readily dissolves in aqueous solution (> 1 mol/L). Minimal formulation barrier.',
      clinicalImpact: 'Exceptional dissolution profile; unlikely to face absorption constraints in gastrointestinal fluids.'
    };
  } else if (logS >= -2) {
    return {
      category: 'moderately_soluble',
      label: 'Moderately Soluble',
      color: '#22d3ee', // Cyan
      badgeBg: 'bg-cyan-500/10 text-cyan-300 border-cyan-500/30',
      badgeBorder: 'border-cyan-500/40',
      description: 'Good aqueous solubility (0.01 to 1 mol/L). Optimal range for standard oral administration.',
      clinicalImpact: 'Favorable biopharmaceutical classification (BCS Class I or III tendency); smooth passage into systemic circulation.'
    };
  } else if (logS >= -4) {
    return {
      category: 'slightly_soluble',
      label: 'Slightly Soluble',
      color: '#fbbf24', // Amber
      badgeBg: 'bg-amber-500/10 text-amber-300 border-amber-500/30',
      badgeBorder: 'border-amber-500/40',
      description: 'Sub-optimal solubility (0.1 to 10 mmol/L). Typical range for many commercial small-molecule APIs.',
      clinicalImpact: 'May require salt selection, amorphous solid dispersion, or lipid formulations to optimize oral uptake.'
    };
  } else if (logS >= -6) {
    return {
      category: 'low_solubility',
      label: 'Low Solubility',
      color: '#f97316', // Orange
      badgeBg: 'bg-orange-500/10 text-orange-300 border-orange-500/30',
      badgeBorder: 'border-orange-500/40',
      description: 'Poor aqueous solubility (1 to 100 μmol/L). Significant bioavailability risk.',
      clinicalImpact: 'Dissolution-rate limited absorption (BCS Class II or IV); rigorous formulation enhancement required.'
    };
  } else {
    return {
      category: 'insoluble',
      label: 'Practically Insoluble',
      color: '#ef4444', // Red
      badgeBg: 'bg-rose-500/10 text-rose-300 border-rose-500/30',
      badgeBorder: 'border-rose-500/40',
      description: 'Extremely hydrophobic or crystalline (< 1 μmol/L). High risk of precipitation.',
      clinicalImpact: 'High attrition risk in drug discovery without substantial structural modification to lower LogP or crystal lattice energy.'
    };
  }
};

/**
 * Convert log mol/L to mg/mL and g/L
 * S (mol/L) = 10^(logS)
 * S (g/L) = S (mol/L) * MW
 * S (mg/mL) = S (g/L)
 */
export const convertLogSToConcentrations = (logS: number, molecularWeight: number) => {
  const molarity = Math.pow(10, logS); // mol/L
  const concentrationGPerL = molarity * molecularWeight; // g/L
  const concentrationMgPerMl = concentrationGPerL; // 1 g/L = 1 mg/mL
  const concentrationUgPerMl = concentrationGPerL * 1000; // μg/mL

  return {
    molarityFormatted: molarity < 1e-4 ? molarity.toExponential(2) : molarity.toFixed(4),
    mgPerMlFormatted: concentrationMgPerMl < 0.01 ? concentrationMgPerMl.toExponential(2) : concentrationMgPerMl.toFixed(3),
    ugPerMlFormatted: concentrationUgPerMl < 1 ? concentrationUgPerMl.toFixed(2) : Math.round(concentrationUgPerMl).toLocaleString(),
  };
};

/**
 * Lipinski's Rule of 5 Evaluation
 * MW <= 500 Da
 * LogP <= 5
 * H-Bond Donors <= 5
 * H-Bond Acceptors <= 10
 */
export interface LipinskiRuleCheck {
  mwPass: boolean;
  logpPass: boolean;
  hbdPass: boolean;
  hbaPass: boolean;
  violationsCount: number;
  isCompliant: boolean;
}

export const evaluateLipinski = (props: MolecularProperties): LipinskiRuleCheck => {
  const mwPass = props.molecular_weight <= 500;
  const logpPass = props.logp <= 5.0;
  const hbdPass = props.h_bond_donors <= 5;
  const hbaPass = props.h_bond_acceptors <= 10;

  const violations = [mwPass, logpPass, hbdPass, hbaPass].filter(passed => !passed).length;

  return {
    mwPass,
    logpPass,
    hbdPass,
    hbaPass,
    violationsCount: violations,
    isCompliant: violations <= 1, // Traditional RO5 allows at most 1 violation
  };
};
