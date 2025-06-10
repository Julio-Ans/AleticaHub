'use client';

import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';

export default function DebugLoginPage() {
  const [email, setEmail] = useState('admin@test.com');
  const [password, setPassword] = useState('123456');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, user } = useAuth();

  const handleLogin = async () => {
    setLoading(true);
    setResult('🔄 Fazendo login...\n');
    
    try {
      const response = await login(email, password);
      setResult(prev => prev + '✅ Login bem-sucedido!\n');
      setResult(prev => prev + `Usuário: ${response.user.nome}\n`);
      setResult(prev => prev + `Token salvo: ${localStorage.getItem('authToken') ? 'SIM' : 'NÃO'}\n`);
    } catch (error) {
      setResult(prev => prev + `❌ Erro: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testAPI = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      setResult(prev => prev + '❌ Nenhum token disponível\n');
      return;
    }

    setResult(prev => prev + '🧪 Testando API de esportes...\n');
    
    try {
      const response = await fetch('https://atleticahubapi.onrender.com/api/esportes', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setResult(prev => prev + `✅ API funcionando! ${data.length} esportes encontrados\n`);
      } else {
        const error = await response.text();
        setResult(prev => prev + `❌ API erro: ${response.status} - ${error}\n`);
      }
    } catch (error) {
      setResult(prev => prev + `❌ Erro de rede: ${error.message}\n`);
    }
  };

  const clearStorage = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('athletica_token');
    setResult(prev => prev + '🗑️ localStorage limpo\n');
  };

  return (
    <div className="min-h-screen bg-black text-white p-8">
      <h1 className="text-3xl font-bold text-red-500 mb-8">Debug Login</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Login Test</h2>
          
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1">Senha:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-white"
            />
          </div>
          
          <div className="space-x-2">
            <button
              onClick={handleLogin}
              disabled={loading}
              className="bg-red-600 hover:bg-red-700 disabled:bg-red-800 px-4 py-2 rounded"
            >
              {loading ? 'Fazendo Login...' : 'Fazer Login'}
            </button>
            
            <button
              onClick={testAPI}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded"
            >
              Testar API
            </button>
            
            <button
              onClick={clearStorage}
              className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
            >
              Limpar Storage
            </button>
          </div>
          
          {user && (
            <div className="bg-green-900/20 border border-green-500 rounded p-4">
              <h3 className="text-green-400 font-semibold">Usuário Logado:</h3>
              <p>Nome: {user.nome}</p>
              <p>Email: {user.email}</p>
              <p>Role: {user.role}</p>
            </div>
          )}
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Log de Debug</h2>
          <pre className="bg-gray-900 border border-gray-700 rounded p-4 h-96 overflow-y-auto text-sm">
            {result || 'Nenhum log ainda...'}
          </pre>
          
          <button
            onClick={() => setResult('')}
            className="bg-gray-600 hover:bg-gray-700 px-4 py-2 rounded"
          >
            Limpar Log
          </button>
        </div>
      </div>
    </div>
  );
}
