import React, { useState } from 'react';
import { 
  Atom, 
  Download, 
  Copy, 
  Check, 
  AlertTriangle, 
  Layers,
  ZoomIn,
  ZoomOut,
  RotateCcw
} from 'lucide-react';
import { useMoleculeDrawer } from '../../hooks/useMoleculeDrawer';

interface MoleculeViewerProps {
  smiles: string;
  isLoading?: boolean;
}

export const MoleculeViewer: React.FC<MoleculeViewerProps> = ({
  smiles,
  isLoading,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const { svgRef, isRendered, renderError, formula } = useMoleculeDrawer(smiles, {
    theme: 'dark',
    width: 480,
    height: 320,
    bondThickness: 1.5,
  });

  const handleCopySmiles = async () => {
    if (!smiles) return;
    try {
      await navigator.clipboard.writeText(smiles);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Ignore
    }
  };

  const handleDownloadSvg = () => {
    if (!svgRef.current) return;
    try {
      const svgData = new XMLSerializer().serializeToString(svgRef.current);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = `molecule-${Date.now()}.svg`;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    } catch {
      // Ignore
    }
  };

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.15, 1.8));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => Math.max(prev - 0.15, 0.6));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
  };

  return (
    <div className="flex flex-col h-full justify-between space-y-4">
      {/* Header and Toolbar */}
      <div className="flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl font-bold text-white tracking-tight">Molecular Structure</h2>
            <span className="text-[11px] font-mono px-2 py-0.5 rounded bg-indigo-950/80 text-indigo-300 border border-indigo-800/40">
              2D Depiction
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1">
            Real-time atom-and-bond graph rendered client-side with SmilesDrawer.
          </p>
        </div>

        {/* Toolbar buttons */}
        <div className="flex items-center gap-1.5">
          {/* Zoom controls */}
          <button
            type="button"
            onClick={handleZoomOut}
            disabled={!isRendered || zoomLevel <= 0.65}
            className="p-1.5 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Zoom out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          
          <button
            type="button"
            onClick={handleResetZoom}
            disabled={!isRendered || zoomLevel === 1}
            className="p-1.5 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Reset zoom"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleZoomIn}
            disabled={!isRendered || zoomLevel >= 1.75}
            className="p-1.5 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Zoom in"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>

          <div className="w-[1px] h-4 bg-slate-800 mx-0.5" />

          <button
            type="button"
            onClick={handleCopySmiles}
            disabled={!smiles.trim()}
            className="p-1.5 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Copy SMILES to clipboard"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleDownloadSvg}
            disabled={!isRendered}
            className="p-1.5 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors disabled:opacity-30 disabled:hover:bg-transparent cursor-pointer"
            title="Download molecular SVG"
          >
            <Download className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas / SVG Container */}
      <div className="relative w-full h-[280px] sm:h-[320px] rounded-xl bg-navy-900/90 border border-slate-700/70 overflow-hidden flex items-center justify-center p-4 shadow-inner">
        {/* Subtle grid background */}
        <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />

        {/* Loading overlay */}
        {isLoading && (
          <div className="absolute inset-0 z-20 bg-navy-950/70 backdrop-blur-sm flex flex-col items-center justify-center gap-3">
            <div className="relative">
              <Atom className="w-10 h-10 text-cyan-400 animate-spin" />
              <div className="absolute inset-0 rounded-full bg-cyan-400/20 blur-md"></div>
            </div>
            <span className="text-xs font-mono text-cyan-300 animate-pulse">Rendering 2D topology...</span>
          </div>
        )}

        {/* 1. Empty State */}
        {!smiles.trim() && (
          <div className="text-center p-6 space-y-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-slate-800/80 border border-slate-700/80 mx-auto flex items-center justify-center text-slate-400">
              <Atom className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-slate-300">No Molecule Loaded</h3>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Enter a SMILES string or pick a sample compound on the left to inspect the 2D bond structure.
              </p>
            </div>
          </div>
        )}

        {/* 2. Error State */}
        {smiles.trim() && renderError && (
          <div className="text-center p-6 space-y-3 z-10">
            <div className="w-12 h-12 rounded-2xl bg-rose-950/60 border border-rose-800/60 mx-auto flex items-center justify-center text-rose-400">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-rose-300">Structure Rendering Error</h3>
              <p className="text-xs text-rose-200/80 max-w-xs mx-auto">
                {renderError}
              </p>
            </div>
          </div>
        )}

        {/* 3. SVG Molecule Renderer */}
        <div 
          className={`w-full h-full flex items-center justify-center transition-all duration-200 ${
            isRendered && !renderError ? 'opacity-100' : 'opacity-0 absolute pointer-events-none'
          }`}
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            ref={svgRef}
            className="w-full h-full max-h-[300px] object-contain drop-shadow-[0_2px_12px_rgba(34,211,238,0.15)]"
          />
        </div>

        {/* Formula Badge (if available) */}
        {isRendered && formula && (
          <div className="absolute top-3 left-3 z-10 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[11px] font-mono text-cyan-300 backdrop-blur-sm">
            {formula}
          </div>
        )}

        {/* Zoom Level Indicator (if zoomed) */}
        {isRendered && zoomLevel !== 1 && (
          <div className="absolute bottom-3 right-3 z-10 px-2 py-0.5 rounded bg-slate-950/80 border border-slate-800 text-[10px] font-mono text-slate-400 backdrop-blur-sm">
            {Math.round(zoomLevel * 100)}%
          </div>
        )}
      </div>

      {/* Atom Color Legend */}
      <div className="rounded-xl bg-slate-900/60 border border-slate-800/80 p-3">
        <div className="flex items-center justify-between text-[11px] mb-2 font-mono text-slate-400">
          <span className="font-semibold uppercase text-slate-300 flex items-center gap-1">
            <Layers className="w-3 h-3 text-cyan-400" />
            <span>Element Legend</span>
          </span>
          <span className="text-[10px] text-slate-500">IUPAC CPK Style</span>
        </div>

        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 shadow-sm" />
            <span className="text-slate-300">C <span className="text-slate-500">(Carbon)</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-400 shadow-sm" />
            <span className="text-slate-300">O <span className="text-slate-500">(Oxygen)</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-sky-400 shadow-sm" />
            <span className="text-slate-300">N <span className="text-slate-500">(Nitrogen)</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 shadow-sm" />
            <span className="text-slate-300">S <span className="text-slate-500">(Sulfur)</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-teal-400 shadow-sm" />
            <span className="text-slate-300">Cl/F <span className="text-slate-500">(Halogen)</span></span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 shadow-sm" />
            <span className="text-slate-300">P <span className="text-slate-500">(Phosphorus)</span></span>
          </div>
        </div>
      </div>
    </div>
  );
};
