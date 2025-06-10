'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaRunning, FaCalendarAlt, FaComments, FaStore, FaUsers, FaCrown, FaUser, FaEdit, FaSignOutAlt, FaImage } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useEsportes } from '@/hooks/useEsportes';
import { useEventos } from '@/hooks/useEventos';
import ModalMensagens from '@/components/ModalMensagens';

export default function HomePage() {
  const { user, logout } = useAuth();  
  const { esportes } = useEsportes();
  const { eventos } = useEventos();
  const [modalMensagensOpen, setModalMensagensOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };
  return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex">
        {/* Sidebar do Usuário */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 min-h-screen p-6">
          <div className="mb-8">            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <FaUser className="text-2xl text-white" />
              </div>
              <div>
                <Link 
                  href="/home"
                  className="font-bold text-xl text-white hover:text-red-400 transition-colors cursor-pointer"
                  title="Voltar ao dashboard principal"
                >
                  {user?.nome || 'Usuário'}
                </Link>
                <p className="text-gray-400 capitalize">{user?.role === 'admin' ? 'Administrador' : 'Aluno'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>

            {/* Ações Rápidas */}
            <div className="space-y-2">
              <Link
                href="/profile"
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white border border-gray-700"
              >
                <FaEdit />
                <span>Editar Perfil</span>
              </Link>
              <button
                onClick={() => setModalMensagensOpen(true)}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-blue-600 hover:bg-blue-700 transition-colors text-white"
              >
                <FaComments />
                <span>Mensagens</span>
              </button>
              {user?.role === 'admin' && (
                <Link 
                  href="/admin-dashboard"
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white"
                >
                  <FaCrown />
                  <span>Painel Admin</span>
                </Link>
              )}
              <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white border border-gray-600"
              >
                <FaSignOutAlt />
                <span>Sair</span>
              </button>
            </div>
          </div>
        </div>

        {/* Conteúdo Principal */}
        <div className="flex-1 p-6">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white mb-2">
              Dashboard - AtleticaHub 🏆
            </h1>
            <p className="text-gray-400">
              Gerencie seus esportes, eventos e atividades
            </p>
          </div>

          {/* Cards de Navegação Principal */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Link 
              href="/sports"
              className="bg-gradient-to-br from-red-600 to-red-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <FaRunning className="text-3xl" />
                <span className="text-2xl font-bold">{esportes.length}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Esportes</h3>
              <p className="text-red-100 text-sm">Explore modalidades disponíveis</p>
            </Link>

            <Link 
              href="/events"
              className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <FaCalendarAlt className="text-3xl" />
                <span className="text-2xl font-bold">{eventos.length}</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Eventos</h3>
              <p className="text-blue-100 text-sm">Confira a programação</p>
            </Link>

            <Link 
              href="/shop"
              className="bg-gradient-to-br from-green-600 to-green-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <FaStore className="text-3xl" />
                <span className="text-2xl font-bold">🛍️</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Loja</h3>
              <p className="text-green-100 text-sm">Produtos da atlética</p>
            </Link>

            <button
              onClick={() => setModalMensagensOpen(true)}
              className="bg-gradient-to-br from-purple-600 to-purple-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-white"
            >
              <div className="flex items-center justify-between mb-4">
                <FaComments className="text-3xl" />
                <span className="text-2xl font-bold">💬</span>
              </div>
              <h3 className="font-bold text-lg mb-2">Chat</h3>
              <p className="text-purple-100 text-sm">Converse com outros atletas</p>
            </button>
          </div>

          {/* Esportes em Destaque */}
          <div className="bg-gray-900 rounded-xl border border-gray-800 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                <FaRunning className="text-red-500" />
                Esportes em Destaque
              </h2>
              <Link 
                href="/sports" 
                className="text-red-400 hover:text-red-300 text-sm font-medium"
              >
                Ver todos →
              </Link>
            </div>
            
            {esportes.length === 0 ? (
              <p className="text-gray-400 text-center py-8">
                Nenhum esporte disponível no momento
              </p>            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {esportes
                  .filter((esporte) => esporte.nome.toLowerCase() !== 'geral' && esporte.id !== '0')
                  .slice(0, 6).map(esporte => (
                  <Link
                    key={esporte.id}
                    href={`/sports/${esporte.id}`}
                    className="bg-gray-800 rounded-lg border border-gray-700 hover:border-red-500 transition-all duration-300 overflow-hidden group"
                  >                    <div className="h-32 bg-gray-700 flex items-center justify-center relative">
                      {esporte.fotoUrl ? (
                        <Image 
                          src={esporte.fotoUrl} 
                          alt={esporte.nome}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-300"                          onError={(e) => {
                            console.log('Erro ao carregar imagem:', esporte.fotoUrl);
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                      ) : (
                        <FaImage className="text-3xl text-gray-500" />
                      )}
                      {!esporte.fotoUrl && (
                        <FaImage className="text-3xl text-gray-500" />
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300" />
                    </div>                    <div className="p-4">
                      <h3 className="font-bold text-white mb-2">{esporte.nome}</h3>                      <div className="flex items-center gap-1 text-gray-500 text-sm">
                        <FaUsers />
                        <span>{esporte.inscricoes?.filter(i => i.status === 'aceito').length || 0} membros</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de Mensagens */}
      <ModalMensagens
        isOpen={modalMensagensOpen}
        onClose={() => setModalMensagensOpen(false)}
        esportes={esportes}
      />
    </div>
  );
}