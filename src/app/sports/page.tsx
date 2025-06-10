'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaPlus, FaUsers, FaImage } from 'react-icons/fa';
import { useEsportes } from '../../hooks/useEsportes';
import { useInscricoes } from '../../hooks/useInscricoes';
import { useAuth } from '../../context/AuthContext';

export default function SportsPage() {
  const { esportes, isLoading, error, isAdmin, carregarEsportes } = useEsportes();
  const { criarInscricao, getStatusInscricao } = useInscricoes();
  const { user, isAuthenticated } = useAuth();
  const [inscrevendoId, setInscrevendoId] = useState<string | number | null>(null);

  const handleInscrever = async (esporteId: string | number) => {
    if (!isAuthenticated) {
      alert('Você precisa fazer login para se inscrever em um esporte');
      return;
    }
    
    try {
      setInscrevendoId(esporteId);
      await criarInscricao(esporteId);
      alert('Inscrição realizada com sucesso! Aguarde a aprovação.');
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Erro ao se inscrever');
    } finally {
      setInscrevendoId(null);
    }
  };

  const getStatusText = (esporteId: string | number) => {
    if (!isAuthenticated) return null;
    
    const status = getStatusInscricao(esporteId);
    switch (status) {
      case 'pendente':
        return { text: 'Pendente', color: 'text-yellow-500' };
      case 'aceito':
        return { text: 'Aprovado', color: 'text-green-500' };
      case 'rejeitado':
        return { text: 'Rejeitado', color: 'text-red-500' };
      default:
        return null;
    }  };
  // Se não estiver autenticado, tentar carregar mesmo assim (fallback)
  // A API pode permitir acesso público mesmo que prefira autenticação
  // if (!isAuthenticated) {
  //   return (
  //     <div className="max-w-4xl mx-auto">
  //       <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4 mb-6">
  //         <p className="text-yellow-500">Você precisa fazer login para ver os esportes disponíveis.</p>
  //         <Link href="/login" className="text-yellow-400 hover:text-yellow-300 underline">
  //           Fazer Login
  //         </Link>
  //       </div>
  //     </div>
  //   );
  // }
  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
          <span className="ml-3 text-gray-400">Carregando esportes...</span>
        </div>
      </div>
    );
  }
  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaHome />
            Voltar para Home
          </Link>
        </div>
        
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <h3 className="text-red-400 font-semibold mb-2">Erro ao carregar esportes</h3>
          <p className="text-red-300 mb-4">Detalhes: {error}</p>
          <div className="flex gap-2">
            <button
              onClick={carregarEsportes}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
            >
              Tentar Novamente
            </button>
            {!isAuthenticated && (
              <Link 
                href="/login"
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Fazer Login
              </Link>
            )}
          </div>
        </div>
        
        <div className="bg-gray-800 rounded-lg p-6">
          <h3 className="font-semibold mb-3">Possíveis soluções:</h3>
          <ul className="space-y-2 text-gray-300">
            <li>• Verifique sua conexão com a internet</li>
            <li>• Faça login em sua conta</li>
            <li>• Tente recarregar a página</li>
            <li>• Entre em contato com o suporte se o problema persistir</li>
          </ul>
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto">      <div className="mb-6 flex justify-between items-center">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
          <div className="flex gap-2">
          <button
            onClick={carregarEsportes}
            className="inline-flex items-center gap-2 bg-blue-700 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Recarregar Esportes
          </button>
          <div className="text-sm text-gray-400 px-2 py-2">
            {isAuthenticated ? `✅ Logado como: ${user?.nome || user?.email}` : '❓ Navegando como visitante'}
          </div>
          {isAdmin && (
            <Link 
              href="/admin-dashboard/esportes" 
              className="inline-flex items-center gap-2 bg-red-700 hover:bg-red-600 text-white px-4 py-2 rounded-lg transition-colors"
            >
              <FaPlus />
              Gerenciar Esportes
            </Link>
          )}
        </div>
      </div>

      {/* Mensagem informativa */}
      {!isAuthenticated && (
        <div className="mb-6 bg-blue-900/20 border border-blue-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400 font-semibold">ℹ️ Visitante</span>
          </div>
          <p className="text-blue-300 text-sm">
            Você pode visualizar todos os esportes disponíveis. Para se inscrever e participar, é necessário{' '}
            <Link href="/login" className="text-blue-200 underline hover:text-blue-100">
              fazer login
            </Link> ou{' '}
            <Link href="/register" className="text-blue-200 underline hover:text-blue-100">
              criar uma conta
            </Link>.
          </p>
        </div>
      )}

      <h1 className="text-3xl font-bold mb-6 text-red-500">Esportes Disponíveis</h1>

      {esportes.length === 0 ? (
        <div className="text-center py-12">
          <FaUsers className="mx-auto text-6xl text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">Nenhum esporte disponível no momento.</p>
        </div>
      ) : (        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {esportes
            .filter((esporte) => esporte.nome.toLowerCase() !== 'geral' && esporte.id !== '0')
            .map((esporte) => {
            const esporteId = esporte.id;
            if (!esporteId) return null;
            
            const status = getStatusText(esporteId);
            const inscricoesAprovadas = esporte.inscricoes?.filter(i => i.status === 'aceito').length || 0;
              return (
              <div
                key={esporteId}
                className="bg-gray-900 rounded-lg border border-gray-700 hover:border-red-500 transition-colors overflow-hidden"
              >{/* Imagem do esporte */}                <div className="h-48 bg-gray-800 flex items-center justify-center relative overflow-hidden">
                  {esporte.fotoUrl ? (
                    <Image 
                      src={esporte.fotoUrl} 
                      alt={esporte.nome}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      onError={(e) => {
                        console.log('Erro ao carregar imagem do esporte:', esporte.fotoUrl);
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  ) : (
                    <FaImage className="text-4xl text-gray-600" />
                  )}
                </div>                <div className="p-4">
                  <h2 className="font-bold text-xl mb-2 text-white">{esporte.nome}</h2>
                  
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-1 text-gray-500">
                      <FaUsers />
                      <span className="text-sm">{inscricoesAprovadas} membros</span>
                    </div>
                    
                    {status && (
                      <span className={`text-sm font-medium ${status.color}`}>
                        {status.text}
                      </span>
                    )}
                  </div>                  <div className="flex gap-2">
                    <Link
                      href={`/sports/${esporteId}`}
                      className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-2 px-4 rounded-lg text-center text-sm transition-colors"
                    >
                      Ver Detalhes
                    </Link>
                    
                    {isAuthenticated ? (
                      !status && (
                        <button
                          onClick={() => handleInscrever(esporteId)}
                          disabled={inscrevendoId === esporteId}
                          className="bg-red-700 hover:bg-red-600 disabled:bg-red-800 disabled:cursor-not-allowed text-white py-2 px-4 rounded-lg text-sm transition-colors"
                        >
                          {inscrevendoId === esporteId ? 'Inscrevendo...' : 'Participar'}
                        </button>
                      )
                    ) : (
                      <Link
                        href="/login"
                        className="bg-blue-700 hover:bg-blue-600 text-white py-2 px-4 rounded-lg text-sm transition-colors"
                      >
                        Login para Participar
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}        </div>
      )}
    </div>
  );
}
