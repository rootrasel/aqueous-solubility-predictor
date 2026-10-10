import React from 'react';
import { Navbar } from '../components/layout/Navbar';
import { HeroSection } from '../components/hero/HeroSection';
import { PredictionWorkspace } from '../components/predictor/PredictionWorkspace';
import { WorkflowDiagram } from '../components/methodology/WorkflowDiagram';
import { ModelMetrics } from '../components/evaluation/ModelMetrics';
import { AboutSection } from '../components/about/AboutSection';
import { Footer } from '../components/layout/Footer';
import { usePrediction } from '../hooks/usePrediction';

export const Home: React.FC = () => {
  const {
    smiles,
    setSmiles,
    inputError,
    isLoading,
    loadingStatus,
    result,
    predictionError,
    backendHealth,
    demoModeOnly,
    setDemoModeOnly,
    history,
    clearHistory,
    loadExample,
    handlePredict,
  } = usePrediction();

  const handleNavigate = (sectionId: string) => {
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handlePredictFromHero = () => {
    handleNavigate('predictor');
  };

  const handleExploreEvaluation = () => {
    handleNavigate('evaluation');
  };

  const handleReloadFromHistory = (reloadedSmiles: string) => {
    setSmiles(reloadedSmiles);
    handleNavigate('predictor');
    handlePredict(reloadedSmiles);
  };

  return (
    <div className="min-h-screen bg-navy-950 text-slate-100 flex flex-col justify-between selection:bg-cyan-500/30 selection:text-cyan-200">
      {/* Sticky Navigation Bar */}
      <Navbar
        backendHealth={backendHealth}
        demoModeOnly={demoModeOnly}
        onToggleDemoMode={setDemoModeOnly}
        onNavigate={handleNavigate}
      />

      {/* Main Page Sections */}
      <main className="flex-1">
        {/* A. Hero Section */}
        <HeroSection
          onPredictClick={handlePredictFromHero}
          onExploreEvaluation={handleExploreEvaluation}
        />

        {/* B. Main Prediction Workspace & Results */}
        <PredictionWorkspace
          smiles={smiles}
          onSmilesChange={setSmiles}
          inputError={inputError}
          isLoading={isLoading}
          loadingStatus={loadingStatus}
          result={result}
          predictionError={predictionError}
          onPredict={() => handlePredict()}
          onLoadExample={loadExample}
          demoModeOnly={demoModeOnly}
          history={history}
          onReloadFromHistory={handleReloadFromHistory}
          onClearHistory={clearHistory}
        />

        {/* C. Methodology Pipeline Section */}
        <WorkflowDiagram />

        {/* D. Model Evaluation & Benchmark Diagnostics */}
        <ModelMetrics />

        {/* E. About & Scientific Background */}
        <AboutSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};
