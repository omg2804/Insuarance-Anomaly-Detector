import axios, { AxiosError } from 'axios';
import { API_BASE } from '../config';
import { ClaimData } from '../types/claim';

// const api = axios.create({
//   baseURL: API_BASE,
//   timeout: 30000, // 30 seconds for large file processing
// });
export const api = axios.create({
  baseURL: "https://insurance-anomaly-detector.onrender.com",
});


export interface HealthResponse {
  status: string;
}

export interface PipelineResponse {
  data: ClaimData[];
  message?: string;
}

/**
 * Check if backend is reachable
 */
export async function checkHealth(): Promise<boolean> {
  try {
    const response = await api.get<HealthResponse>('/health');
    return response.data.status === 'ok';
  } catch (error) {
    return false;
  }
}

/**
 * Upload CSV file and run anomaly detection pipeline
 */
export async function runPipeline(file: File): Promise<ClaimData[]> {
  const formData = new FormData();
  formData.append('file', file);

  try {
    const response = await api.post<ClaimData[]>('/pipeline/run', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      throw new Error(
        axiosError.response?.data?.detail || 
        axiosError.message || 
        'Failed to run pipeline'
      );
    }
    throw error;
  }
}

/**
 * Get the most recently generated anomaly report
 */
export async function getLatestReport(): Promise<ClaimData[] | null> {
  try {
    const response = await api.get<ClaimData[]>('/pipeline/latest');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      // 404 means no report exists yet
      if (axiosError.response?.status === 404) {
        return null;
      }
      throw new Error(
        axiosError.response?.data?.detail || 
        axiosError.message || 
        'Failed to fetch latest report'
      );
    }
    throw error;
  }
}

/**
 * Run pipeline with sample data
 */
export async function runSamplePipeline(): Promise<ClaimData[]> {
  try {
    const response = await api.post<ClaimData[]>('/pipeline/run-sample');
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{ detail?: string }>;
      throw new Error(
        axiosError.response?.data?.detail || 
        axiosError.message || 
        'Failed to run sample pipeline'
      );
    }
    throw error;
  }
}

