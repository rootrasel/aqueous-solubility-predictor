import React from 'react';
import { History, RotateCcw, Trash2, Download } from 'lucide-react';
import type { HistoryItem } from '../../types/prediction';

interface PredictionHistoryProps {
  history: HistoryItem[];
  onReload: (smiles: string) => void;
  onClear: () => void;
}

export const PredictionHistory: React.FC<PredictionHistoryProps> = ({
  history,
  onReload,
  onClear,
}) => {
  const handleExportJson = () => {
    if (!history.length) return;
    const blob = new Blob([JSON.stringify(history, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `moleculab-history-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="rounded-2xl glass-card p-6 border border-slate-700/80 shadow-xl space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <History className="w-5 h-5 text-cyan-400" />
          <h3 className="text-lg font-bold text-white tracking-tight">Prediction History</h3>
          <span className="text-xs font-mono text-slate-400">({history.length})</span>
        </div>

        {history.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExportJson}
              className="p-1.5 text-xs text-slate-400 hover:text-cyan-300 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Export predictions as JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Export JSON</span>
            </button>
            <button
              onClick={onClear}
              className="p-1.5 text-xs text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              title="Clear all history"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="hidden sm:inline text-[11px]">Clear</span>
            </button>
          </div>
        )}
      </div>

      {/* History Items or Empty State */}
      {history.length === 0 ? (
        <div className="text-center py-8 px-4 rounded-xl bg-navy-900/40 border border-slate-800/60">
          <p className="text-xs text-slate-500 font-mono">No previous predictions recorded in this session.</p>
          <p className="text-[11px] text-slate-600 mt-1">Predictions will appear here automatically with timestamps and reload buttons.</p>
        </div>
      ) : (
        <div className="space-y-2 max-h-[260px] overflow-y-auto pr-1">
          {history.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between p-3 rounded-xl bg-navy-900/70 border border-slate-800/80 hover:border-slate-700 transition-all text-xs"
            >
              <div className="space-y-1 min-w-0 pr-3">
                <div className="font-mono text-slate-200 truncate font-semibold" title={item.smiles}>
                  {item.smiles}
                </div>
                <div className="flex items-center gap-2 text-[11px] text-slate-400">
                  <span className="font-mono font-bold text-cyan-400">
                    {item.predictedSolubility.toFixed(2)} {item.unit}
                  </span>
                  <span>•</span>
                  <span>{item.categoryLabel}</span>
                  <span>•</span>
                  <span className="text-slate-500">{item.timestamp}</span>
                  {item.isDemo && (
                    <span className="text-[9px] uppercase px-1 rounded bg-amber-950 text-amber-400 border border-amber-800">
                      Sim
                    </span>
                  )}
                </div>
              </div>

              <button
                onClick={() => onReload(item.smiles)}
                className="shrink-0 p-2 rounded-lg bg-slate-800/80 hover:bg-cyan-950 hover:text-cyan-300 text-slate-400 transition-colors flex items-center gap-1 cursor-pointer"
                title="Reload this molecule into prediction workspace"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline text-[11px]">Load</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
