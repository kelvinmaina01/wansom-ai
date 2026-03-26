import { supabase } from './supabase';

const getBaseUrl = () => {
  // @ts-ignore - Vite environment variable
  return import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
};

/**
 * Centrailized API Client for Lawlify AI.
 * Auto-attaches Firebase ID tokens to all requests.
 */
export const apiClient = {
  async fetch(endpoint: string, options: RequestInit = {}) {
    const baseUrl = getBaseUrl();
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;

    // Get Supabase session token
    const { data: { session } } = await supabase.auth.getSession();
    const token = session?.access_token || '';

    const headers = {
      'Content-Type': 'application/json',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (response.status === 401) {
        console.warn('API Unauthorized error (401)');
      }

      return response;
    } catch (error: any) {
      console.error('API Connection Error:', error);
      // Return a mock response object that components can check for error
      return {
        ok: false,
        status: 503,
        json: async () => ({ error: 'Connection refused. Is the backend server running?' }),
        text: async () => 'Connection refused',
      } as Response;
    }
  },

  async get(endpoint: string, options: RequestInit = {}) {
    return this.fetch(endpoint, { ...options, method: 'GET' });
  },

  async post(endpoint: string, body: any, options: RequestInit = {}) {
    return this.fetch(endpoint, {
      ...options,
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
};
