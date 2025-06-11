'use client';

import { useState, useEffect } from 'react';
import { FaHome, FaUser, FaSpinner, FaSave } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { authApi } from '@/services/api/authApi';

interface UserProfile {
  nome: string;
  telefone: string;
  curso: string;
  dataNascimento: string;
  email: string;
}

export default function ProfilePage() {
  const { user, isAuthenticated, updateProfile } = useAuth();
  const [profile, setProfile] = useState<UserProfile>({
    nome: '',
    telefone: '',
    curso: '',
    dataNascimento: '',
    email: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const carregarPerfil = async () => {
      try {
        // Usar a API do sistema em vez de fazer requisições diretas
        const userData = await authApi.getProfile();
        
        setProfile({
          nome: userData.nome || '',
          telefone: userData.telefone || '',
          curso: userData.curso || '',
          dataNascimento: userData.dataNascimento ? 
            new Date(userData.dataNascimento).toISOString().split('T')[0] : '',
          email: userData.email || user?.email || ''
        });
      } catch (err) {
        setError('Erro ao carregar perfil');
        console.error('Erro:', err);
      } finally {
        setLoading(false);
      }
    };

    const loadProfile = async () => {
      if (isAuthenticated && user) {
        await carregarPerfil();
      } else {
        setLoading(false);
      }
    };
    
    loadProfile();
  }, [user, isAuthenticated]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSuccess(false);
    setError(null);
    setSaving(true);

    try {
      // Usar o updateProfile do contexto para atualizar o perfil
      await updateProfile({
        nome: profile.nome,
        telefone: profile.telefone,
        curso: profile.curso,
      });

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar perfil');
    } finally {
      setSaving(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    setProfile(prev => ({ ...prev, [field]: value }));
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaHome />
            Voltar para Home
          </Link>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg text-center">
          <p className="text-gray-400 mb-4">Você precisa estar logado para ver seu perfil.</p>
          <Link href="/login" className="text-red-500 hover:text-red-400 underline">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <FaUser className="text-red-500" />
          Meu Perfil
        </h1>

        {error && (
          <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
            <p className="text-red-500">{error}</p>
          </div>
        )}

        {success && (
          <div className="bg-green-900/20 border border-green-500 rounded-lg p-4 mb-6">
            <p className="text-green-500">Perfil atualizado com sucesso!</p>
          </div>
        )}

        {loading ? (
          <div className="text-center py-8">
            <FaSpinner className="animate-spin text-3xl text-red-500 mx-auto mb-4" />
            <p className="text-gray-400">Carregando perfil...</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block mb-2 text-gray-300 font-medium">Email</label>
              <input 
                type="email" 
                value={profile.email}
                disabled
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-400 cursor-not-allowed" 
              />
              <p className="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
            </div>

            <div>
              <label className="block mb-2 text-gray-300 font-medium">Nome Completo *</label>
              <input 
                type="text" 
                value={profile.nome}
                onChange={(e) => handleInputChange('nome', e.target.value)}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="Digite seu nome completo"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300 font-medium">Telefone *</label>
              <input 
                type="tel" 
                value={profile.telefone}
                onChange={(e) => handleInputChange('telefone', e.target.value)}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="Digite seu telefone"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300 font-medium">Curso *</label>
              <input 
                type="text" 
                value={profile.curso}
                onChange={(e) => handleInputChange('curso', e.target.value)}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white focus:outline-none focus:ring-2 focus:ring-red-500" 
                placeholder="Digite seu curso"
              />
            </div>

            <div>
              <label className="block mb-2 text-gray-300 font-medium">Data de Nascimento</label>
              <input 
                type="date" 
                value={profile.dataNascimento}
                disabled
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-gray-400 cursor-not-allowed" 
              />
              <p className="text-xs text-gray-500 mt-1">A data de nascimento não pode ser alterada</p>
            </div>

            <div className="border-t border-gray-700 pt-6">
              <button 
                type="submit" 
                disabled={saving}
                className="w-full bg-red-600 hover:bg-red-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2 transition-colors"
              >
                {saving ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <FaSave />
                    Salvar Alterações
                  </>
                )}
              </button>
            </div>

            <div className="text-xs text-gray-500">
              <p>* Campos obrigatórios</p>
              <p>Apenas nome, telefone e curso podem ser alterados.</p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
