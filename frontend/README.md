# MolecuLab AI — Molecular Aqueous Solubility Predictor (Frontend)

*From Molecular Structure to Predictive Insight.*

[![React](https://img.shields.io/badge/React-19.0-61dafb.svg?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-3178c6.svg?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.0-646cff.svg?logo=vite&logoColor=white)](https://vite.dev)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-38bdf8.svg?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg)](LICENSE)

A state-of-the-art, research-oriented frontend workbench for predicting molecular aqueous solubility ($\log S$, in $\log_{10}\text{ mol/L}$) from SMILES strings using cheminformatics descriptors and machine learning regression models.

---

## Key Features

1. **Real-Time Molecular Input & Validation**
   - High-contrast monospace SMILES editor with keyboard shortcut (`Ctrl + Enter`).
   - Client-side IUPAC/OpenSMILES syntax parsing, unclosed bracket/parenthesis detection, and ring closure balance checks.
   - One-click sample molecule loader: Ethanol, Aspirin, Caffeine, Paracetamol, Ibuprofen, Nicotine, Glucose.

2. **Client-Side 2D Molecular Graph Visualization**
   - Pure client-side SVG vector structure rendering powered by [SmilesDrawer](https://github.com/reymond-group/smilesDrawer).
   - High-contrast dark IUPAC CPK element color palette (C, O, N, S, Halogens, P).
   - Interactive zoom controls (`Zoom In`, `Zoom Out`, `Reset`) and one-click SVG vector export.

3. **Predicted Solubility & Biochemical Interpretation**
   - Prominent thermodynamic aqueous solubility readout with 5-tier biopharmaceutical classification:
     - **Highly Soluble** ($\log S > 0$)
     - **Moderately Soluble** ($-2 \le \log S \le 0$)
     - **Slightly Soluble** ($-4 \le \log S < -2$)
     - **Low Solubility** ($-6 \le \log S < -4$)
     - **Practically Insoluble** ($\log S < -6$)
   - Visual continuous biopharmaceutical spectrum pin gauge.
   - Automatic unit conversion into $\text{mg/mL}$, $\mu\text{g/mL}$, and molarity ($\text{M}$).

4. **Physicochemical Descriptors & Lipinski Rule of 5**
   - Molecular Weight ($\text{g/mol}$), calculated $\text{cLogP}$, $\text{TPSA}$ ($\text{Å}^2$), Hydrogen-Bond Donors ($\text{HBD}$), and Hydrogen-Bond Acceptors ($\text{HBA}$).
   - Automated Lipinski's Rule of 5 compliance evaluator for oral drug developability.

5. **Statistical Model Evaluation & Benchmark Diagnostics**
   - Interactive [Recharts](https://recharts.org) diagnostic visualizations:
     - **Predicted vs. Actual Solubility** scatter plot with ideal $y=x$ reference line.
     - **Residual Distribution Plot** showing error dispersion around zero baseline.
     - **Feature Importance Breakdown** illustrating relative Gini contributions ($\text{cLogP}$, $\text{MW}$, $\text{AP}$, $\text{TPSA}$, $\text{RB}$).
   - Empirical Delaney ESOL benchmark statistics ($R^2 = 0.87$, $\text{RMSE} = 0.58$, $\text{MAE} = 0.42$).

6. **Robust Dual-Mode API Integration**
   - Connects seamlessly to a FastAPI backend endpoint (`POST /api/v1/predict`).
   - Automatic health checks and graceful fallback to an explicitly designated **Simulation / Demo Mode** when the backend server is on standby.

---

## Project Structure

```text
frontend/
├── public/
│   └── favicon.svg                  # Atomic graph SVG favicon
├── src/
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx           # Sticky brand navbar with live backend status
│   │   │   └── Footer.tsx           # Tech stack credits & scientific disclaimer
│   │   ├── hero/
│   │   │   ├── HeroSection.tsx      # Main headline and quick stats
│   │   │   └── MolecularNetworkCanvas.tsx # Animated atom & bond particle canvas
│   │   ├── predictor/
│   │   │   ├── PredictionWorkspace.tsx  # Two-panel interactive workspace container
│   │   │   ├── SmilesInput.tsx      # Monospace SMILES input with instant feedback
│   │   │   ├── MoleculeViewer.tsx   # 2D SmilesDrawer SVG renderer with zoom/export
│   │   │   ├── PredictionResult.tsx # Quantitative solubility card & spectrum gauge
│   │   │   ├── MolecularProperties.tsx # Physicochemical descriptors & Lipinski RO5
│   │   │   ├── ModelInfoCard.tsx    # Model architecture & benchmark validation
│   │   │   └── PredictionHistory.tsx# Session history with reload & JSON export
│   │   ├── methodology/
│   │   │   └── WorkflowDiagram.tsx  # 5-stage cheminformatics ML pipeline
│   │   ├── evaluation/
│   │   │   ├── ModelMetrics.tsx     # Diagnostic statistics overview
│   │   │   └── EvaluationCharts.tsx # Recharts scatter, residuals, & feature importances
│   │   ├── about/
│   │   │   └── AboutSection.tsx     # Scientific context, ADMET theory & API contract
│   │   └── ui/
│   │       └── GithubIcon.tsx       # Inline vector GitHub icon
│   ├── hooks/
│   │   ├── usePrediction.ts         # Prediction state, validation, history, and API
│   │   └── useMoleculeDrawer.ts     # SmilesDrawer SVG rendering lifecycle hook
│   ├── services/
│   │   └── api.ts                   # Axios client with timeout, health check & demo fallback
│   ├── types/
│   │   └── prediction.ts            # Strict TypeScript interfaces
│   ├── utils/
│   │   ├── validation.ts            # SMILES syntax & balanced parenthesis checks
│   │   ├── chemistry.ts             # Solubility classification & Lipinski evaluator
│   │   └── demoData.ts              # Sample molecules & ESOL benchmark test data
│   ├── pages/
│   │   └── Home.tsx                 # Single-page application root view
│   ├── App.tsx                      # Root React component
│   ├── main.tsx                     # React 19 entry point
│   └── index.css                    # Tailwind CSS base and scientific glow styles
├── .env.example                     # Environment variables template
├── .env                             # Local environment variables
├── package.json                     # Dependencies and scripts
├── tailwind.config.js               # Navy/Cyan design tokens
├── tsconfig.json                    # Strict TypeScript configuration
└── vite.config.ts                   # Vite build configuration
```

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org) >= 18.0.0
- `npm` >= 9.0.0

### Installation

1. Navigate to the `frontend` directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Configure environment variables:
   ```bash
   cp .env.example .env
   ```

### Development Server

Run the development server with Hot Module Replacement (HMR):

```bash
npm run dev
```

The application will be live at `http://localhost:5173`.

### Production Build

Compile and type-check the production bundle:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## Connecting to the Python FastAPI Backend

By default, the frontend points to `http://localhost:8000`. You can customize this by setting `VITE_API_BASE_URL` in your `.env` file:

```env
VITE_API_BASE_URL=http://localhost:8000
```

### Backend Endpoint Contract

#### Request

```http
POST /api/v1/predict
Content-Type: application/json

{
  "smiles": "CC(=O)Oc1ccccc1C(=O)O"
}
```

#### Response

```json
{
  "smiles": "CC(=O)Oc1ccccc1C(=O)O",
  "predicted_solubility": -1.86,
  "unit": "log mol/L",
  "molecular_properties": {
    "molecular_weight": 180.16,
    "logp": 1.31,
    "tpsa": 63.60,
    "h_bond_donors": 1,
    "h_bond_acceptors": 4,
    "rotatable_bonds": 3,
    "heavy_atoms": 13,
    "formula": "C9H8O4",
    "aromatic_proportion": 0.67
  },
  "model": {
    "name": "ESOL Random Forest Regressor",
    "type": "Random Forest Ensemble (100 Trees)",
    "dataset": "Delaney (ESOL)",
    "r2": 0.87,
    "rmse": 0.58,
    "mae": 0.42,
    "version": "1.0.0"
  }
}
```

---

## References & Scientific Attribution

- **ESOL**: Delaney, J. S. (2004). *ESOL: Estimating aqueous solubility directly from molecular structure.* Journal of Chemical Information and Computer Sciences, 44(3), 1000–1005.
- **RDKit**: Open-source cheminformatics toolkit ([rdkit.org](https://www.rdkit.org)).
- **SmilesDrawer**: Probst, D., & Reymond, J. L. (2018). *SmilesDrawer: Parsing and Drawing SMILES-encoded Molecule Structures in the Browser.* Journal of Chemical Information and Modeling, 58(1), 1–7.
