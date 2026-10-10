import React from 'react';
import { Atom, Activity, Sparkles, Server } from 'lucide-react';
import type { ApiHealthStatus } from '../../services/api';
import { GithubIcon } from '../ui/GithubIcon';

interface NavbarProps {
  backendHealth: ApiHealthStatus;
  demoModeOnly: boolean;
  onToggleDemoMode: (enabled: boolean) => void;
  onNavigate: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  backendHealth,
  demoModeOnly,
  onToggleDemoMode,
  onNavigate,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-navy-950/80 backdrop-blur-md transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Product Name */}
          <div 
            onClick={() => onNavigate('hero')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-600 via-cyan-500 to-indigo-600 p-[1px] shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-500/40 transition-all duration-300">
              <div className="w-full h-full bg-navy-900 rounded-[11px] flex items-center justify-center">
                <Atom className="w-5 h-5 text-cyan-400 group-hover:rotate-180 transition-transform duration-700" />
              </div>
              {/* Ping dot */}
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            </div>
            
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white group-hover:text-cyan-300 transition-colors">
                  MolecuLab<span className="text-cyan-400">.AI</span>
                </span>
                <span className="text-[10px] uppercase font-mono font-semibold px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-400 border border-cyan-800/60">
                  v1.0
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block tracking-wide">
                From Molecular Structure to Predictive Insight
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1 text-sm font-medium text-slate-300">
            <button
              onClick={() => onNavigate('predictor')}
              className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              Predictor
            </button>
            <button
              onClick={() => onNavigate('methodology')}
              className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              Methodology
            </button>
            <button
              onClick={() => onNavigate('evaluation')}
              className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              Model Evaluation
            </button>
            <button
              onClick={() => onNavigate('about')}
              className="px-3.5 py-1.5 rounded-lg hover:text-white hover:bg-slate-800/60 transition-colors cursor-pointer"
            >
              About & Data
            </button>
          </nav>

          {/* Right Status & Actions */}
          <div className="flex items-center gap-3">
            {/* Backend / Model Status Indicator */}
            <div 
              className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-mono border transition-all ${
                demoModeOnly
                  ? 'bg-amber-950/30 border-amber-600/40 text-amber-300'
                  : backendHealth.isOnline
                    ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                    : 'bg-cyan-950/30 border-cyan-600/40 text-cyan-300'
              }`}
              title={
                demoModeOnly
                  ? 'Demo Mode active (client-side Delaney heuristic simulation)'
                  : backendHealth.isOnline
                    ? `FastAPI Backend online at ${backendHealth.backendUrl}`
                    : `Backend offline at ${backendHealth.backendUrl}. Auto-fallback to simulation mode.`
              }
            >
              {demoModeOnly ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                  <span>Demo Mode</span>
                </>
              ) : backendHealth.isOnline ? (
                <>
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <span className="hidden sm:inline">Backend Live</span>
                  <span className="sm:hidden">Live</span>
                </>
              ) : (
                <>
                  <Server className="w-3.5 h-3.5 text-cyan-400" />
                  <span className="hidden sm:inline">Standby (Simulation)</span>
                  <span className="sm:hidden">Standby</span>
                </>
              )}
            </div>

            {/* Demo Mode Toggle Button */}
            <button
              onClick={() => onToggleDemoMode(!demoModeOnly)}
              className={`hidden lg:flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                demoModeOnly 
                  ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' 
                  : 'bg-slate-900 text-slate-400 border-slate-800 hover:text-slate-200 hover:border-slate-700'
              }`}
              title="Force client-side simulation demo mode without contacting backend"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>{demoModeOnly ? 'Simulation On' : 'Sim Mode'}</span>
            </button>

            {/* GitHub Link */}
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View on GitHub"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/60 transition-colors"
            >
              <GithubIcon className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
};
