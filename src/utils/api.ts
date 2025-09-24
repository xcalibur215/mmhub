// API utility functions for consistent request handling
const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8081/api/v1';

export interface FetchConfig extends RequestInit {
  timeout?: number;
  retries?: number;
}

class APIError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: Response
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Timeout utility
const withTimeout = <T>(promise: Promise<T>, ms: number): Promise<T> => {
  const timeout = new Promise<never>((_, reject) =>
    setTimeout(() => reject(new Error('Request timeout')), ms)
  );
  return Promise.race([promise, timeout]);
};

// Enhanced fetch with retries and auth
export const apiFetch = async (
  url: string,
  config: FetchConfig = {}
): Promise<Response> => {
  const {
    timeout = 10000,
    retries = 1,
    headers = {},
    ...fetchConfig
  } = config;

  // Add auth token if available
  const token = localStorage.getItem('mmhub_access');
  const authHeaders = token ? { Authorization: `Bearer ${token}` } : {};

  const finalConfig: RequestInit = {
    ...fetchConfig,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders,
      ...headers,
    },
  };

  const fullUrl = url.startsWith('http') ? url : `${API_BASE}${url}`;

  let lastError: Error;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await withTimeout(fetch(fullUrl, finalConfig), timeout);
      
      if (!response.ok) {
        const errorText = await response.text().catch(() => 'Unknown error');
        throw new APIError(
          `HTTP ${response.status}: ${errorText}`,
          response.status,
          response
        );
      }
      
      return response;
    } catch (error) {
      lastError = error instanceof Error ? error : new Error('Unknown error');
      
      // Don't retry on client errors (4xx) or auth issues
      if (error instanceof APIError && error.status >= 400 && error.status < 500) {
        throw error;
      }
      
      // Wait before retry (exponential backoff)
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, attempt)));
      }
    }
  }
  
  throw lastError!;
};

// Convenience methods
export const apiGet = (url: string, config?: FetchConfig) =>
  apiFetch(url, { ...config, method: 'GET' });

export const apiPost = (url: string, data?: unknown, config?: FetchConfig) =>
  apiFetch(url, {
    ...config,
    method: 'POST',
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiPut = (url: string, data?: unknown, config?: FetchConfig) =>
  apiFetch(url, {
    ...config,
    method: 'PUT',
    body: data ? JSON.stringify(data) : undefined,
  });

export const apiDelete = (url: string, config?: FetchConfig) =>
  apiFetch(url, { ...config, method: 'DELETE' });

// JSON response helper
export const parseJSON = async <T = unknown>(response: Response): Promise<T> => {
  const text = await response.text();
  if (!text) return {} as T;
  try {
    return JSON.parse(text);
  } catch {
    throw new Error('Invalid JSON response');
  }
};

export { APIError };