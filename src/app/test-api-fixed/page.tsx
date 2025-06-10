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
        // Test credentials - try to create user first, then login
      const email = 'user3@fatec.br';
      const password = '123456';
      
      setResultado(prev => prev + `Step 1: Attempting to create test user: ${email}\n`);
      
      try {
        // Try to create the user first (will fail if user exists)
        await firebaseService.signUp(email, password);
        setResultado(prev => prev + `✅ Test user created successfully!\n`);      } catch (createError: unknown) {
        const error = createError as { code?: string; message?: string };
        if (error.code === 'auth/email-already-in-use') {
          setResultado(prev => prev + `ℹ️ Test user already exists, proceeding with login\n`);
        } else {
          setResultado(prev => prev + `⚠️ User creation failed: ${error.message || 'Unknown error'}\n`);
        }
      }
      
      setResultado(prev => prev + `Step 2: Attempting Firebase login with: ${email}\n`);
      
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
        setResultado(prev => prev + `Found ${data.length} sports:\n`);        data.slice(0, 3).forEach((sport: { nome: string }) => {
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

  const clearStorage = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('athletica_token');
    setResultado('✅ Cleared localStorage tokens\n');
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">API Connection Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test API Connection'}
          </button>
          
          <button
            onClick={testLogin}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Firebase Login'}
          </button>
          
          <button
            onClick={testAuthenticatedRequest}
            disabled={loading}
            className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Authenticated Request'}
          </button>
          
          <button
            onClick={clearStorage}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600"
          >
            Clear Storage
          </button>
        </div>
        
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm whitespace-pre-wrap min-h-96">
          {resultado || 'Click a button to start testing...'}
        </div>
      </div>
    </div>
  );
}
