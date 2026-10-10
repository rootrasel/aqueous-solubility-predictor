import { useEffect, useRef, useState, useCallback } from 'react';
import SmilesDrawer from 'smiles-drawer';

export interface UseMoleculeDrawerOptions {
  theme?: 'dark' | 'light';
  width?: number;
  height?: number;
  bondThickness?: number;
}

export function useMoleculeDrawer(
  smiles: string,
  options: UseMoleculeDrawerOptions = {}
) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isRendered, setIsRendered] = useState<boolean>(false);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [formula, setFormula] = useState<string>('');

  const renderMolecule = useCallback(() => {
    if (!svgRef.current) return;

    const trimmed = smiles?.trim();
    if (!trimmed) {
      setIsRendered(false);
      setRenderError(null);
      setFormula('');
      if (svgRef.current) {
        svgRef.current.innerHTML = '';
      }
      return;
    }

    try {
      const drawerOptions = {
        width: options.width || 420,
        height: options.height || 300,
        bondThickness: options.bondThickness || 1.4,
        bondLength: 26,
        padding: 24,
        compactDrawing: true,
        fontFamily: '"JetBrains Mono", Inter, sans-serif',
        fontSizeLarge: 11,
        fontSizeSmall: 7,
        themes: {
          dark: {
            FOREGROUND: '#e2e8f0',
            BACKGROUND: 'transparent',
            C: '#cbd5e1',
            O: '#fb7185',     // Rose 400
            N: '#38bdf8',     // Sky 400
            F: '#34d399',     // Emerald 400
            CL: '#2dd4bf',    // Teal 400
            BR: '#fb923c',    // Orange 400
            I: '#c084fc',     // Violet 400
            P: '#f59e0b',     // Amber 500
            S: '#facc15',     // Yellow 400
            B: '#f97316',     // Orange 500
            SI: '#14b8a6',    // Teal 500
            H: '#94a3b8'      // Slate 400
          },
          light: {
            FOREGROUND: '#0f172a',
            BACKGROUND: 'transparent',
            C: '#1e293b',
            O: '#e11d48',
            N: '#0284c7',
            F: '#059669',
            CL: '#0d9488',
            BR: '#ea580c',
            I: '#7c3aed',
            P: '#d97706',
            S: '#ca8a04',
            B: '#c2410c',
            SI: '#0f766e',
            H: '#64748b'
          }
        }
      };

      const svgDrawer = new SmilesDrawer.SvgDrawer(drawerOptions);

      SmilesDrawer.parse(
        trimmed,
        (tree) => {
          if (!svgRef.current) return;
          try {
            // Clear prior SVG nodes
            svgRef.current.innerHTML = '';
            svgDrawer.draw(tree, svgRef.current, options.theme || 'dark', false);
            
            // Extract molecular formula if supported by the parse tree
            try {
              const graphWithFormula = tree as unknown as { getMolecularFormula?: () => string };
              if (graphWithFormula && typeof graphWithFormula.getMolecularFormula === 'function') {
                setFormula(graphWithFormula.getMolecularFormula());
              }
            } catch {
              // Ignore formula extraction errors
            }

            setIsRendered(true);
            setRenderError(null);
          } catch {
            setIsRendered(false);
            setRenderError('Could not render 2D projection for this molecular graph.');
          }
        },
        (error) => {
          setIsRendered(false);
          const errorMsg = error?.message || 'Invalid or unparseable SMILES syntax.';
          setRenderError(errorMsg);
        }
      );
    } catch {
      setIsRendered(false);
      setRenderError('Failed to initialize molecular structure renderer.');
    }
  }, [smiles, options.theme, options.width, options.height, options.bondThickness]);

  useEffect(() => {
    const handle = requestAnimationFrame(() => {
      renderMolecule();
    });
    return () => cancelAnimationFrame(handle);
  }, [renderMolecule]);

  return {
    svgRef,
    isRendered,
    renderError,
    formula,
    reRender: renderMolecule,
  };
}
