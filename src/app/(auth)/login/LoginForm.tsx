// filepath: c:\Users\julio\Downloads\AtleticaHub-FrontEnd\AleticaHub\src\app\(auth)\login\LoginForm.tsx
// Login Form Component - Formulário de login integrado com API

'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthForm } from '../../../hooks/useAuthForm';

const LoginForm = () => {
  const { handleLogin, isLoading, errors } = useAuthForm();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await handleLogin(formData);
  };

  const fillTestCredentials = () => {
    setFormData({
      email: 'user3@fatec.br',
      password: '123456'
    });
  };

  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center p-4">
      <div className="bg-gray-900 p-8 rounded-lg border border-gray-700 w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-red-500 mb-2">AtleticaHub</h1>
          <p className="text-gray-400">Faça login em sua conta</p>
        </div>

        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <input
              type="email"
              name="email"
              placeholder="E-mail"
              value={formData.email}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-3 rounded bg-gray-800 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.email 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-red-600'
              }`}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>

          <div>
            <input
              type="password"
              name="password"
              placeholder="Senha"
              value={formData.password}
              onChange={handleChange}
              disabled={isLoading}
              className={`w-full p-3 rounded bg-gray-800 border text-white placeholder-gray-500 focus:outline-none focus:ring-2 transition-colors ${
                errors.password 
                  ? 'border-red-500 focus:ring-red-500' 
                  : 'border-gray-700 focus:ring-red-600'
              }`}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          {errors.general && (
            <div className="bg-red-900/20 border border-red-500 rounded p-3">
              <p className="text-red-500 text-sm">{errors.general}</p>
            </div>
          )}

          {/* Development test button */}
          {process.env.NODE_ENV === 'development' && (
            <button
              type="button"
              onClick={fillTestCredentials}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded text-sm transition-colors"
            >
              🧪 Preencher com credenciais de teste
            </button>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-red-700 hover:bg-red-600 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-3 rounded font-bold transition-colors flex items-center justify-center"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Entrando...
              </>
            ) : (
              'Entrar'
            )}
          </button>

          <div className="text-center space-y-2">
            <Link 
              href="/forgot-password" 
              className="text-red-500 hover:text-red-400 text-sm transition-colors"
            >
              Esqueceu sua senha?
            </Link>
            
            <p className="text-gray-400 text-sm">
              Não tem conta?{' '}
              <Link 
                href="/register" 
                className="text-red-500 hover:text-red-400 font-semibold transition-colors"
              >
                Criar conta
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
