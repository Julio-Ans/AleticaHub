'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { authApi } from '@/services/api/authApi';

export default function RegisterPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    telefone: '',
    dataNascimento: '',
    curso: '',
    codigo: '', // Código de convite (opcional)
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Validações básicas do frontend
  const validateForm = () => {
    if (!formData.email || !formData.senha || !formData.nome || 
        !formData.telefone || !formData.dataNascimento || !formData.curso) {
      setError('Todos os campos obrigatórios devem ser preenchidos');
      return false;
    }
    
    if (!formData.email.includes('@')) {
      setError('Email inválido');
      return false;
    }
    
    if (formData.senha.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres');
      return false;
    }

    return true;
  };
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validações do frontend
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    const { email, senha, nome, telefone, dataNascimento, curso, codigo } = formData;

    try {
      console.log('Iniciando registro...');
      
      const data = await authApi.register({
        email,
        password: senha,
        nome,
        telefone,
        dataNascimento,
        curso,
        codigo: codigo || undefined
      });

      console.log('Registro bem-sucedido:', data);
      
      // Redirecionar com base no papel do usuário
      if (data.user.role === 'admin') {
        router.push('/admin-dashboard');
      } else {
        router.push('/home');
      }
    } catch (err) {
      console.error('Erro ao registrar:', err);
      setError(err instanceof Error ? err.message : 'Erro ao registrar. Verifique os dados ou tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <form onSubmit={handleRegister} className="bg-gray-900 p-8 rounded-lg border border-gray-700 w-full max-w-md space-y-4">
        <h1 className="text-2xl font-bold text-red-500 text-center mb-6">Criar Conta</h1>
        <p className="text-gray-400 text-sm text-center mb-6">
          Preencha o formulário abaixo para se registrar na plataforma AtleticaHub
        </p>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Nome completo*</label>
          <input 
            type="text" 
            name="nome" 
            placeholder="Digite seu nome completo" 
            required 
            onChange={handleChange} 
            disabled={isLoading}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" 
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">E-mail*</label>
          <input 
            type="email" 
            name="email" 
            placeholder="Digite seu e-mail" 
            required 
            onChange={handleChange} 
            disabled={isLoading}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" 
          />
          <p className="text-gray-500 text-xs mt-1">Use um email com domínio autorizado</p>
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Senha*</label>
          <input 
            type="password" 
            name="senha" 
            placeholder="Mínimo 6 caracteres" 
            required 
            onChange={handleChange} 
            disabled={isLoading}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" 
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Telefone*</label>
          <input 
            type="tel" 
            name="telefone" 
            placeholder="(00) 00000-0000" 
            required 
            onChange={handleChange} 
            disabled={isLoading}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" 
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Data de Nascimento*</label>
          <input 
            type="date" 
            name="dataNascimento" 
            required 
            onChange={handleChange} 
            disabled={isLoading}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" 
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Curso*</label>
          <input 
            type="text" 
            name="curso" 
            placeholder="Digite seu curso" 
            required 
            onChange={handleChange} 
            disabled={isLoading}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" 
          />
        </div>

        <div>
          <label className="block text-gray-300 text-sm mb-1">Código de convite (opcional)</label>
          <input 
            type="text" 
            name="codigo" 
            placeholder="Digite se tiver um código" 
            onChange={handleChange} 
            disabled={isLoading}
            className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white" 
          />
          <p className="text-gray-500 text-xs mt-1">Necessário para acesso administrativo</p>
        </div>

        {error && <p className="text-red-500 text-sm py-2 px-3 bg-red-900/30 rounded">{error}</p>}

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full ${isLoading ? 'bg-gray-600' : 'bg-red-700 hover:bg-red-600'} 
            text-white py-3 rounded font-bold transition-colors`}
        >
          {isLoading ? 'Registrando...' : 'Registrar'}
        </button>

        <p className="text-gray-400 text-sm text-center">
          Já tem conta?{' '}
          <Link href="/login" className="text-red-500 hover:text-red-400 font-semibold">
            Entrar
          </Link>
        </p>
      </form>
    </div>
  );
}
