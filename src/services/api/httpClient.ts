// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\services\api\httpClient.ts
// HTTP Client - Configuração base para comunicação com a API

type RequestConfig = {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
  headers?: Record<string, string>;
  body?: Record<string, unknown> | unknown;
};

class HttpClient {
  private baseURL: string;
  private defaultHeaders: Record<string, string>;

  constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, ''); // Remove trailing slash
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, config: RequestConfig = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    const token = this.getAuthToken();

    const headers = {
      ...this.defaultHeaders,
      ...config.headers,
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const requestConfig: RequestInit = {
      method: config.method || 'GET',
      headers,
      ...(config.body ? { body: JSON.stringify(config.body) } : {}),
    };

    try {
      const response = await fetch(url, requestConfig);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ 
          message: 'Erro de comunicação com o servidor' 
        }));
        throw new Error(errorData.message || `HTTP Error: ${response.status}`);
      }

      // Handle empty responses (204 No Content)
      if (response.status === 204) {
        return {} as T;
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Erro de rede');
    }
  }
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('athletica_token');
  }

  setAuthToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('athletica_token', token);
    }
  }

  removeAuthToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('athletica_token');
    }
  }

  // HTTP Methods
  async get<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', headers });
  }
  async post<T>(endpoint: string, data?: Record<string, unknown> | unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'POST', body: data, headers });
  }

  async put<T>(endpoint: string, data?: Record<string, unknown> | unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PUT', body: data, headers });
  }

  async patch<T>(endpoint: string, data?: Record<string, unknown> | unknown, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'PATCH', body: data, headers });
  }

  async delete<T>(endpoint: string, headers?: Record<string, string>): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', headers });
  }
}

// Create and export HTTP client instance
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
export const httpClient = new HttpClient(API_BASE_URL);

export default httpClient;
