'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function AuthFlowTest() {
  const [resultado, setResultado] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const { login, user, logout } = useAuth();

  const testCompleteAuthFlow = async () => {
    setLoading(true);
    setResultado('🔄 Testing complete authentication flow...\n');
      try {
      // Test credentials
      const email = 'user3@fatec.br';
      const password = '123456';
      
      setResultado(prev => prev + `Step 1: Attempting login with: ${email}\n`);
      
      // Use the actual auth context login method
      const result = await login(email, password);
      
      if (result.success) {
        setResultado(prev => prev + `✅ Login successful!\n`);
        setResultado(prev => prev + `User: ${JSON.stringify(result.user, null, 2)}\n`);
        
        // Check localStorage
        const authToken = localStorage.getItem('authToken');
        const athleticaToken = localStorage.getItem('athletica_token');
        
        setResultado(prev => prev + `\nTokens in localStorage:\n`);
        setResultado(prev => prev + `- authToken: ${authToken ? authToken.substring(0, 50) + '...' : 'null'}\n`);
        setResultado(prev => prev + `- athletica_token: ${athleticaToken ? athleticaToken.substring(0, 50) + '...' : 'null'}\n`);
          // Test an authenticated API call
        setResultado(prev => prev + `\nStep 2: Testing authenticated API call...\n`);
        
        const esportesApi = await import('@/services/api/esportesApi');
        const esportes = await esportesApi.default.listarEsportes();
        
        setResultado(prev => prev + `✅ Sports API call successful!\n`);
        setResultado(prev => prev + `Found ${esportes.length} sports:\n`);
        esportes.slice(0, 3).forEach((sport: { nome: string }) => {
          setResultado(prev => prev + `- ${sport.nome}\n`);
        });
        
      } else {
        setResultado(prev => prev + `❌ Login failed: ${result.message}\n`);
      }
      
    } catch (error) {
      setResultado(prev => prev + `❌ Authentication flow error: ${error}\n`);
    }
    
    setLoading(false);
  };

  const testLogout = async () => {
    setLoading(true);
    setResultado('🔄 Testing logout...\n');
    
    try {
      await logout();
      setResultado(prev => prev + `✅ Logout successful!\n`);
      
      // Check localStorage after logout
      const authToken = localStorage.getItem('authToken');
      const athleticaToken = localStorage.getItem('athletica_token');
      
      setResultado(prev => prev + `Tokens after logout:\n`);
      setResultado(prev => prev + `- authToken: ${authToken || 'null'}\n`);
      setResultado(prev => prev + `- athletica_token: ${athleticaToken || 'null'}\n`);
      
    } catch (error) {
      setResultado(prev => prev + `❌ Logout error: ${error}\n`);
    }
    
    setLoading(false);
  };

  const checkCurrentState = () => {
    setResultado('📊 Current authentication state:\n');
    setResultado(prev => prev + `User: ${user ? JSON.stringify(user, null, 2) : 'null'}\n`);
    
    const authToken = localStorage.getItem('authToken');
    const athleticaToken = localStorage.getItem('athletica_token');
    
    setResultado(prev => prev + `\nTokens in localStorage:\n`);
    setResultado(prev => prev + `- authToken: ${authToken ? authToken.substring(0, 50) + '...' : 'null'}\n`);
    setResultado(prev => prev + `- athletica_token: ${athleticaToken ? athleticaToken.substring(0, 50) + '...' : 'null'}\n`);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Complete Authentication Flow Test</h1>
        
        <div className="space-y-4 mb-8">
          <button
            onClick={testCompleteAuthFlow}
            disabled={loading}
            className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Complete Auth Flow'}
          </button>
          
          <button
            onClick={testLogout}
            disabled={loading}
            className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-600 disabled:opacity-50"
          >
            {loading ? 'Testing...' : 'Test Logout'}
          </button>
          
          <button
            onClick={checkCurrentState}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Check Current State
          </button>
        </div>
        
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm whitespace-pre-wrap min-h-96">
          {resultado || 'Click a button to start testing...'}
        </div>
      </div>
    </div>
  );
}
