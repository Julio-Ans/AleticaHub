'use client';

import { useState } from 'react';

export default function TestAPIPage() {
  const [resultado, setResultado] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResultado('Testing connection...\n');
    
    try {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
      
      // Test 1: Basic connection
      setResultado(prev => prev + `Testing API at: ${baseURL}\n`);
      
      const response = await fetch(`${baseURL}/health`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.text();
        setResultado(prev => prev + `✅ Health check OK: ${data}\n`);
      } else {
        setResultado(prev => prev + `❌ Health check failed: ${response.status} ${response.statusText}\n`);
      }
      
    } catch (error) {
      setResultado(prev => prev + `❌ Connection error: ${error}\n`);
    }
    
    setLoading(false);
  };

  const testLogin = async () => {
    setLoading(true);
    setResultado('Testing Firebase authentication...\n');
    
    try {
      const { FirebaseService } = await import('@/services/firebase/firebaseService');
      const firebaseService = new FirebaseService();
      
      // Test credentials - replace with actual test account
      const email = 'teste@teste.com';
      const password = '123456';
      
      setResultado(prev => prev + `Attempting Firebase login with: ${email}\n`);
      
      const idToken = await firebaseService.signIn(email, password);
      setResultado(prev => prev + `✅ Firebase login successful! Token length: ${idToken.length}\n`);
      
      // Now test backend login
      setResultado(prev => prev + `Sending Firebase token to backend...\n`);
      
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
      const response = await fetch(`${baseURL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          idToken,
          email: email,
          displayName: email.split('@')[0]
        }),
      });
      
      if (response.ok) {
        const data = await response.json();
        setResultado(prev => prev + `✅ Backend login successful!\n`);
        setResultado(prev => prev + `Token: ${data.token.substring(0, 50)}...\n`);
        setResultado(prev => prev + `User: ${JSON.stringify(data.user, null, 2)}\n`);
        
        // Save tokens
        localStorage.setItem('authToken', data.token);
        localStorage.setItem('athletica_token', data.token);
        setResultado(prev => prev + `✅ Tokens saved to localStorage\n`);
        
      } else {
        const error = await response.text();
        setResultado(prev => prev + `❌ Backend login failed: ${response.status}\n${error}\n`);
      }
      
    } catch (error) {
      setResultado(prev => prev + `❌ Authentication error: ${error}\n`);
    }
    
    setLoading(false);
  };

  const testAuthenticatedRequest = async () => {
    setLoading(true);
    setResultado('Testing authenticated API request...\n');
    
    try {
      const token = localStorage.getItem('authToken') || localStorage.getItem('athletica_token');
      
      if (!token) {
        setResultado(prev => prev + `❌ No token found in localStorage\n`);
        setLoading(false);
        return;
      }
      
      setResultado(prev => prev + `Using token: ${token.substring(0, 50)}...\n`);
      
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://atleticahubapi.onrender.com';
      const response = await fetch(`${baseURL}/api/esportes`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        setResultado(prev => prev + `✅ Sports API request successful!\n`);
        setResultado(prev => prev + `Found ${data.length} sports:\n`);
        data.slice(0, 3).forEach((sport: any) => {
          setResultado(prev => prev + `- ${sport.nome}\n`);
        });
      } else {
        const error = await response.text();
        setResultado(prev => prev + `❌ Sports API failed: ${response.status}\n${error}\n`);
      }
      
    } catch (error) {
      setResultado(prev => prev + `❌ Request error: ${error}\n`);
    }
    
    setLoading(false);
  };

  const testarAPI = async () => {
    setLoading(true);
    setResultado('Testando...');
    
    try {
      console.log('🧪 Testando API de Esportes...');
      
      const response = await fetch('https://atleticahubapi.onrender.com/api/esportes', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📊 Status:', response.status);
      console.log('📋 Headers:', Object.fromEntries(response.headers.entries()));
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Dados recebidos:', data);
        setResultado(`✅ Sucesso! Status: ${response.status}, Quantidade: ${data.length || 'N/A'}, Dados: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorText = await response.text();
        console.log('❌ Erro:', errorText);
        setResultado(`❌ Erro! Status: ${response.status}, Erro: ${errorText}`);
      }
      
    } catch (error) {
      console.error('❌ Erro na requisição:', error);
      setResultado(`❌ Erro de Rede: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-red-500">Teste API Esportes</h1>
      
      <button
        onClick={testarAPI}
        disabled={loading}
        className="bg-red-700 hover:bg-red-600 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg mb-4"
      >
        {loading ? 'Testando...' : 'Testar API'}
      </button>
      
      {resultado && (
        <div className="bg-gray-900 border border-gray-700 rounded-lg p-4">
          <h2 className="text-lg font-bold mb-2 text-white">Resultado:</h2>
          <pre className="text-sm text-gray-300 whitespace-pre-wrap overflow-auto">
            {resultado}
          </pre>
        </div>
      )}
    </div>
  );
}
