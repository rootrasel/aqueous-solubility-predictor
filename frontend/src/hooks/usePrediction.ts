import { useState, useEffect, useCallback } from 'react';
import type { PredictionResponse, HistoryItem } from '../types/prediction';
import { validateSmiles } from '../utils/validation';
import { classifySolubility } from '../utils/chemistry';
import { predictSolubility, checkBackendHealth } from '../services/api';
import type { ApiHealthStatus } from '../services/api';

const HISTORY_STORAGE_KEY = 'moleculab_prediction_history';

export function usePrediction() {
  const [smiles, setSmiles] = useState<string>('CCO'); // Default to ethanol
  const [inputError, setInputError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingStatus, setLoadingStatus] = useState<string>('');
  const [result, setResult] = useState<PredictionResponse | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [backendHealth, setBackendHealth] = useState<ApiHealthStatus>({
    isOnline: false,
    message: 'Checking...',
    backendUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  });
  const [demoModeOnly, setDemoModeOnly] = useState<boolean>(false);
  
  // Lazy initialize history from localStorage
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const stored = localStorage.getItem(HISTORY_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Check backend health on mount and periodically
  const refreshBackendHealth = useCallback(async () => {
    const status = await checkBackendHealth();
    setBackendHealth(status);
  }, []);

  useEffect(() => {
    let isMounted = true;
    checkBackendHealth().then((status) => {
      if (isMounted) setBackendHealth(status);
    });

    const interval = setInterval(refreshBackendHealth, 30000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [refreshBackendHealth]);

  // Handle SMILES input change with instant validation
  const handleSmilesChange = useCallback((value: string) => {
    setSmiles(value);
    setPredictionError(null);
    if (!value.trim()) {
      setInputError(null);
      return;
    }
    const validation = validateSmiles(value);
    if (!validation.isValid) {
      setInputError(validation.error || 'Invalid SMILES format');
    } else {
      setInputError(null);
    }
  }, []);

  // Save successful prediction to history
  const saveToHistory = useCallback((res: PredictionResponse) => {
    const classification = classifySolubility(res.predicted_solubility);
    const newItem: HistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      smiles: res.smiles,
      predictedSolubility: res.predicted_solubility,
      unit: res.unit,
      category: classification.category,
      categoryLabel: classification.label,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      molecularWeight: res.molecular_properties?.molecular_weight,
      formula: res.molecular_properties?.formula,
      isDemo: res.is_demo,
    };

    setHistory((prev) => {
      // Remove duplicate of same SMILES if at the very top, keep last 20
      const filtered = prev.filter((item) => item.smiles !== res.smiles);
      const updated = [newItem, ...filtered].slice(0, 20);
      try {
        localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(updated));
      } catch {
        // Ignore localstorage write errors
      }
      return updated;
    });
  }, []);

  // Execute prediction
  const handlePredict = useCallback(
    async (smilesToPredict?: string) => {
      const targetSmiles = (smilesToPredict ?? smiles).trim();

      const validation = validateSmiles(targetSmiles);
      if (!validation.isValid) {
        setInputError(validation.error || 'Invalid SMILES string');
        return;
      }

      setIsLoading(true);
      setPredictionError(null);

      // Multi-step animated progress indicators for scientific feedback
      setLoadingStatus('Validating chemical valence & SMILES syntax...');
      const timer1 = setTimeout(() => {
        setLoadingStatus('Computing 2D RDKit topological descriptors & Morgan fingerprints...');
      }, 150);
      const timer2 = setTimeout(() => {
        setLoadingStatus('Evaluating machine learning regression ensemble...');
      }, 350);

      try {
        const responseWrapper = await predictSolubility(
          { smiles: targetSmiles },
          !backendHealth.isOnline || demoModeOnly
        );

        setResult(responseWrapper.data);
        saveToHistory(responseWrapper.data);
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'An unexpected error occurred during prediction.';
        setPredictionError(msg);
      } finally {
        clearTimeout(timer1);
        clearTimeout(timer2);
        setIsLoading(false);
        setLoadingStatus('');
      }
    },
    [smiles, backendHealth.isOnline, demoModeOnly, saveToHistory]
  );

  const clearHistory = useCallback(() => {
    setHistory([]);
    try {
      localStorage.removeItem(HISTORY_STORAGE_KEY);
    } catch {
      // Ignore
    }
  }, []);

  const loadExample = useCallback((exampleSmiles: string) => {
    setSmiles(exampleSmiles);
    setInputError(null);
    setPredictionError(null);
  }, []);

  return {
    smiles,
    setSmiles: handleSmilesChange,
    inputError,
    isLoading,
    loadingStatus,
    result,
    predictionError,
    backendHealth,
    refreshBackendHealth,
    demoModeOnly,
    setDemoModeOnly,
    history,
    clearHistory,
    loadExample,
    handlePredict,
  };
}
