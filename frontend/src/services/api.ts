import axios, { AxiosError } from 'axios';
import type { PredictionRequest, PredictionResponse } from '../types/prediction';
import { calculateDemoPrediction } from '../utils/demoData';

// Retrieve backend URL from environment variables, fallback to localhost:8000
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 8000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

export interface ApiHealthStatus {
  isOnline: boolean;
  message?: string;
  backendUrl: string;
}

/**
 * Health check to verify whether FastAPI backend is reachable
 */
export const checkBackendHealth = async (): Promise<ApiHealthStatus> => {
  try {
    const response = await apiClient.get('/api/v1/health', { timeout: 3000 });
    return {
      isOnline: response.status === 200,
      message: response.data?.status || 'Online',
      backendUrl: API_BASE_URL,
    };
  } catch {
    // Also try root /health
    try {
      const fallbackRes = await apiClient.get('/health', { timeout: 2000 });
      return {
        isOnline: fallbackRes.status === 200,
        message: 'Online',
        backendUrl: API_BASE_URL,
      };
    } catch {
      return {
        isOnline: false,
        message: 'FastAPI Backend Offline',
        backendUrl: API_BASE_URL,
      };
    }
  }
};

export interface PredictionResultWrapper {
  data: PredictionResponse;
  source: 'backend' | 'demo';
  latencyMs: number;
}

/**
 * Request solubility prediction from FastAPI ML Backend, or simulate in Demo Mode if offline.
 */
export const predictSolubility = async (
  request: PredictionRequest,
  allowDemoFallback: boolean = true
): Promise<PredictionResultWrapper> => {
  const startTime = performance.now();

  try {
    const response = await apiClient.post<PredictionResponse>('/api/v1/predict', request);
    const latency = Math.round(performance.now() - startTime);

    return {
      data: {
        ...response.data,
        is_demo: false,
        inference_time_ms: latency,
        timestamp: new Date().toISOString(),
      },
      source: 'backend',
      latencyMs: latency,
    };
  } catch (error) {
    const axiosError = error as AxiosError<{ detail?: string | { message?: string } }>;
    
    // If backend is unreachable and demo mode fallback is enabled
    if (allowDemoFallback && (!axiosError.response || axiosError.code === 'ERR_NETWORK' || axiosError.code === 'ECONNABORTED')) {
      // Simulate realistic ML inference latency (150-300ms)
      await new Promise((resolve) => setTimeout(resolve, 250));
      const demoResult = calculateDemoPrediction(request.smiles);
      const latency = Math.round(performance.now() - startTime);

      return {
        data: {
          ...demoResult,
          is_demo: true,
          inference_time_ms: latency,
        },
        source: 'demo',
        latencyMs: latency,
      };
    }

    // Backend returned an error response (e.g., 400 Bad SMILES, 422 Unprocessable)
    if (axiosError.response) {
      const detail = axiosError.response.data?.detail;
      const message = typeof detail === 'string' 
        ? detail 
        : typeof detail === 'object' && detail !== null 
          ? JSON.stringify(detail) 
          : `Server error (${axiosError.response.status}): Unable to process molecule.`;
      
      throw new Error(message);
    }

    if (axiosError.code === 'ECONNABORTED') {
      throw new Error('Prediction request timed out. The backend model server took too long to respond.');
    }

    throw new Error('Unable to connect to the backend server at ' + API_BASE_URL + '. Check your network or enable Demo Mode.');
  }
};
