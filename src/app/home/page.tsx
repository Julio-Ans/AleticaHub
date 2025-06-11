'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FaRunning, FaCalendarAlt, FaComments, FaStore, FaCrown, FaUser, FaEdit, FaSignOutAlt } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useEsportes } from '@/hooks/useEsportes';
import { useEventos } from '@/hooks/useEventos';
import ModalMensagens from '@/components/ModalMensagens';

export default function HomePage() {
  const { user, logout, isAuthenticated } = useAuth();
  const router = useRouter();
  const { esportes, isLoading: esportesLoading, error: esportesError } = useEsportes();
  const { eventos, isLoading: eventosLoading, error: eventosError } = useEventos();
  // const { minhasInscricoes } = useInscricoes(); // TODO: Implementar uso das inscrições
  const [modalMensagensOpen, setModalMensagensOpen] = useState(false);

  // Redirecionamento automático para login se não autenticado
  useEffect(() => {
    // Aguardar um pouco para garantir que a verificação de autenticação foi concluída
    const timeout = setTimeout(() => {
      if (!isAuthenticated && !user) {
        console.log('🔄 HomePage: Usuário não autenticado, redirecionando para login');
        router.push('/login');
      }
    }, 1000); // 1 segundo de delay para evitar redirecionamentos prematuros

    return () => clearTimeout(timeout);
  }, [isAuthenticated, user, router]);
  
  // Debug logs MAIS DETALHADOS para verificar carregamento
  console.log('🏠 HomePage RENDERIZADA:');
  console.log('  - Esportes:', esportes.length, 'loading:', esportesLoading, 'error:', esportesError);
  console.log('  - Eventos:', eventos.length, 'loading:', eventosLoading, 'error:', eventosError);
  console.log('  - Usuário:', user?.nome, 'role:', user?.role);
  
  // Debug detalhado dos esportes
  if (esportes.length > 0) {
    console.log('🏠 Esportes detalhados:', esportes.map(e => ({ 
      id: e.id, 
      nome: e.nome, 
      temFoto: !!e.fotoUrl,
      fotoUrl: e.fotoUrl?.substring(0, 50) + '...' 
    })));
  } else {
    console.log('🏠 ⚠️ NENHUM ESPORTE CARREGADO!');
  }
    // Debug detalhado dos eventos
  if (eventos.length > 0) {
    console.log('🏠 Eventos detalhados:', eventos.map(e => ({ 
      id: e._id, 
      titulo: e.titulo, 
      data: e.data 
    })));
  } else {
    console.log('🏠 ⚠️ NENHUM EVENTO CARREGADO!');
  }  // Mostrar loading enquanto verifica autenticação
  if (!isAuthenticated && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-red-500 mx-auto mb-4"></div>
          <p className="text-gray-400">Verificando autenticação...</p>
        </div>
      </div>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };return (
    <div className="min-h-screen bg-gray-950">
      <div className="flex">
        {/* Sidebar do Usuário */}
        <div className="w-80 bg-gray-900 border-r border-gray-800 min-h-screen p-6 flex flex-col">
          <div className="flex-1">
            <div className="flex items-center gap-4 mb-6">
              <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center">
                <FaUser className="text-2xl text-white" />
              </div>
              <div>
                <h2 className="font-bold text-xl text-white">{user?.nome}</h2>
                <p className="text-gray-400 capitalize">{user?.role === 'admin' ? 'Administrador' : 'Aluno'}</p>
                <p className="text-sm text-gray-500">{user?.email}</p>
              </div>
            </div>            {/* Ações Rápidas */}
            <div className="space-y-2">
              <Link
                href="/profile"
                className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-800 hover:bg-gray-700 transition-colors text-gray-300 hover:text-white border border-gray-700"
              >
                <FaEdit />
                <span>Editar Perfil</span>
              </Link>
              {user?.role === 'admin' && (
                <Link 
                  href="/admin-dashboard"
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors text-white"
                >
                  <FaCrown />
                  <span>Painel Admin</span>
                </Link>
              )}
            </div>
          </div>
          
          {/* Logout no final da sidebar */}
          <div className="mt-auto">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 p-3 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors text-gray-300 hover:text-white border border-gray-600"
            >
              <FaSignOutAlt />
              <span>Sair</span>
            </button>
          </div>
        </div>        {/* Conteúdo Principal */}
        <div className="flex-1 flex flex-col min-h-screen">
          {/* Header */}
          <div className="text-center py-8 px-6">
            <h1 className="text-4xl font-bold text-white mb-4">
              Dashboard - AtleticaHub 🏆
            </h1>
            <p className="text-gray-400 text-lg">
              Gerencie seus esportes, eventos e atividades
            </p>
          </div>

          {/* Cards de Navegação Principal - Ocupando toda a área disponível */}
          <div className="flex-1 flex items-center justify-center px-6 py-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
              <Link 
                href="/sports"
                className="bg-gradient-to-br from-red-600 to-red-700 p-12 rounded-3xl shadow-2xl hover:shadow-red-500/25 transition-all duration-300 transform hover:scale-105 text-white min-h-[280px] flex flex-col justify-center group"
              >
                <div className="flex items-center justify-between mb-8">
                  <FaRunning className="text-6xl group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-right">
                    <span className="text-5xl font-bold block">{esportes.length}</span>
                    <span className="text-red-200 text-sm">modalidades</span>
                  </div>
                </div>
                <h3 className="font-bold text-3xl mb-4">Esportes</h3>
                <p className="text-red-100 text-xl leading-relaxed">Explore modalidades disponíveis e participe das atividades esportivas da atlética</p>
              </Link>

              <Link 
                href="/events"
                className="bg-gradient-to-br from-blue-600 to-blue-700 p-12 rounded-3xl shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:scale-105 text-white min-h-[280px] flex flex-col justify-center group"
              >
                <div className="flex items-center justify-between mb-8">
                  <FaCalendarAlt className="text-6xl group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-right">
                    <span className="text-5xl font-bold block">{eventos.length}</span>
                    <span className="text-blue-200 text-sm">programados</span>
                  </div>
                </div>
                <h3 className="font-bold text-3xl mb-4">Eventos</h3>
                <p className="text-blue-100 text-xl leading-relaxed">Confira a programação completa e inscreva-se nos eventos da comunidade</p>
              </Link>

              <Link 
                href="/shop"
                className="bg-gradient-to-br from-green-600 to-green-700 p-12 rounded-3xl shadow-2xl hover:shadow-green-500/25 transition-all duration-300 transform hover:scale-105 text-white min-h-[280px] flex flex-col justify-center group"
              >
                <div className="flex items-center justify-between mb-8">
                  <FaStore className="text-6xl group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-right">
                    <span className="text-5xl font-bold block">🛍️</span>
                    <span className="text-green-200 text-sm">produtos</span>
                  </div>
                </div>
                <h3 className="font-bold text-3xl mb-4">Loja</h3>
                <p className="text-green-100 text-xl leading-relaxed">Produtos oficiais da atlética, camisetas, acessórios e muito mais</p>
              </Link>

              <button
                onClick={() => setModalMensagensOpen(true)}
                className="bg-gradient-to-br from-purple-600 to-purple-700 p-12 rounded-3xl shadow-2xl hover:shadow-purple-500/25 transition-all duration-300 transform hover:scale-105 text-white min-h-[280px] flex flex-col justify-center group"
              >
                <div className="flex items-center justify-between mb-8">
                  <FaComments className="text-6xl group-hover:scale-110 transition-transform duration-300" />
                  <div className="text-right">
                    <span className="text-5xl font-bold block">💬</span>
                    <span className="text-purple-200 text-sm">mensagens</span>
                  </div>
                </div>
                <h3 className="font-bold text-3xl mb-4">Chat</h3>
                <p className="text-purple-100 text-xl leading-relaxed">Converse com outros atletas e membros da comunidade esportiva</p>
              </button>
            </div>
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