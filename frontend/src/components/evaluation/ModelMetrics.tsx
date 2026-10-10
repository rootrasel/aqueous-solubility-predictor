import React from 'react';
import { BarChart3, Activity } from 'lucide-react';
import { BENCHMARK_METRICS } from '../../utils/demoData';
import { EvaluationCharts } from './EvaluationCharts';

export const ModelMetrics: React.FC = () => {
  return (
    <section id="evaluation" className="py-16 md:py-24 border-t border-slate-800/80 bg-navy-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-medium">
            <BarChart3 className="w-3.5 h-3.5 text-cyan-400" />
            <span>Statistical Validation</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Model Evaluation & Benchmark Diagnostics
          </h2>
          <p className="text-sm sm:text-base text-slate-400 leading-relaxed">
            Rigorous statistical evaluation against held-out Delaney (ESOL) test partitions. We compare predicted aqueous solubility against gold-standard wet-lab thermodynamic measurements.
          </p>
        </div>

        {/* 4 Metric Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {BENCHMARK_METRICS.map((metric) => (
            <div
              key={metric.symbol}
              className="rounded-2xl glass-card p-5 border border-slate-700/80 hover:border-cyan-500/40 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-2">
                  <span>{metric.symbol}</span>
                  <span className="text-[10px] text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-950/80 border border-emerald-800/50">
                    Target: {metric.benchmarkTarget}
                  </span>
                </div>
                <div className="text-xs text-slate-300 font-medium">
                  {metric.name}
                </div>
              </div>

              <div className="my-4">
                <div className="text-3xl sm:text-4xl font-extrabold font-mono text-white tracking-tight">
                  {metric.value.toFixed(2)}
                  {metric.unit && <span className="text-xs font-normal text-slate-400 ml-1.5">{metric.unit}</span>}
                </div>
              </div>

              <p className="text-[11px] text-slate-400 leading-relaxed pt-3 border-t border-slate-800/80">
                {metric.description}
              </p>
            </div>
          ))}
        </div>

        {/* Interactive Charts Component */}
        <EvaluationCharts />

        {/* Scientific Context Card */}
        <div className="rounded-2xl bg-gradient-to-r from-slate-900 to-navy-900 p-6 sm:p-8 border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-1 max-w-2xl">
            <h4 className="text-base font-bold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Standard Error of Experimental Solubility</span>
            </h4>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Inter-laboratory experimental measurements of aqueous solubility naturally exhibit a standard deviation of approximately ±0.5 log S units. Our model's test RMSE of 0.58 log mol/L closely approaches this experimental uncertainty limit.
            </p>
          </div>

          <div className="text-xs font-mono text-slate-400 border border-slate-700 px-4 py-2.5 rounded-xl bg-slate-950/80 shrink-0">
            Experimental Variance Limit: <strong className="text-cyan-300">~0.50 log S</strong>
          </div>
        </div>
      </div>
    </section>
  );
};
