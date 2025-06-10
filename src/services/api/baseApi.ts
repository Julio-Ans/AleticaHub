// Base API Service - Classe base para todos os serviços da API

class AtleticaHubAPI {
  protected baseURL: string;

  constructor() {
    // Use environment variable or fallback to production URL
    this.baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
  }  // Configurar headers padrão
  protected async getHeaders(includeAuth = true): Promise<Record<string, string>> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (includeAuth) {
      try {
        const firebaseToken = await this.getFirebaseToken();
        if (firebaseToken) {
          headers['Authorization'] = `Bearer ${firebaseToken}`;
        }
      } catch (error) {
        console.warn('Erro ao obter Firebase token:', error);
      }
    }
    
    return headers;
  }

  // Obter Firebase ID token atual
  protected async getFirebaseToken(): Promise<string | null> {
    try {
      if (typeof window === 'undefined') return null;
        const { firebaseService } = await import('../firebase/firebaseService');
      await firebaseService.initialize();
      
      return await firebaseService.getCurrentToken();
    } catch (error) {
      console.warn('Erro ao obter Firebase token:', error);
      return null;
    }
  }

  // Set token method (mantido para compatibilidade, mas não usado)
  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem('authToken', token);
      localStorage.setItem('athletica_token', token);
    }
  }

  // Remove token method
  removeToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('authToken');
      localStorage.removeItem('athletica_token');
    }
  }  // Método genérico para requisições
  protected async request<T = unknown>(endpoint: string, options: RequestInit & { auth?: boolean } = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    try {
      // Obter headers base
      const baseHeaders = await this.getHeaders(options.auth !== false);
      
      // Se é FormData, não incluir Content-Type (o navegador define automaticamente)
      let headers: Record<string, string> = {};
      
      if (options.body instanceof FormData) {
        // Para FormData, só incluir Authorization se disponível
        if (baseHeaders['Authorization']) {
          headers['Authorization'] = baseHeaders['Authorization'] as string;
        }
      } else {
        // Para outros tipos, usar todos os headers
        headers = baseHeaders as Record<string, string>;
      }
      
      const config: RequestInit = {
        ...options,
        headers: {
          ...headers,
          ...options.headers
        }
      };

      console.log(`🔗 API Request: ${options.method || 'GET'} ${url}`);
      
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `Erro ${response.status}: ${response.statusText}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch {
          // Se não conseguir parsear JSON, usar mensagem padrão
        }
        
        if (response.status === 401) {
          errorMessage = 'Token ausente ou inválido';
        }
        
        console.error(`❌ API Error: ${errorMessage}`);
        throw new Error(errorMessage);
      }
      
      const result = await response.json();
      console.log(`✅ API Success: ${options.method || 'GET'} ${url}`);
      return result;
    } catch (error) {
      console.error(`❌ API Exception: ${error}`);
      throw error;
    }
  }
}

export default AtleticaHubAPI;
