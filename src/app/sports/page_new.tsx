'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaUsers, FaImage } from 'react-icons/fa';
import { useEsportes } from '../../hooks/useEsportes';
import { useInscricoes } from '../../hooks/useInscricoes';
import { useAuth } from '../../context/AuthContext';

export default function SportsPage() {
  const { esportes, isLoading, error } = useEsportes();
  const { criarInscricao, getStatusInscricao } = useInscricoes();
  const { isAuthenticated } = useAuth();
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

  const getStatusButton = (esporteId: string | number) => {
    if (!isAuthenticated) {
      return (
        <Link
          href="/login"
          className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold text-center"
        >
          Login para se Inscrever
        </Link>
      );
    }
    
    const status = getStatusInscricao(esporteId);
    switch (status) {
      case 'pendente':
        return (
          <button
            disabled
            className="w-full bg-yellow-600 text-white py-2 px-4 rounded font-semibold cursor-not-allowed"
          >
            Pendente
          </button>
        );
      case 'aceito':
        return (
          <div className="space-y-2">
            <button
              disabled
              className="w-full bg-green-600 text-white py-2 px-4 rounded font-semibold cursor-not-allowed"
            >
              Inscrito
            </button>
            <Link
              href={`/chat/${esporteId}`}
              className="block w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded font-semibold text-center"
            >
              Ir para o Chat
            </Link>
          </div>
        );
      case 'rejeitado':
        return (
          <button
            onClick={() => handleInscrever(esporteId)}
            disabled={inscrevendoId === esporteId}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold disabled:opacity-50"
          >
            {inscrevendoId === esporteId ? 'Inscrevendo...' : 'Tentar Novamente'}
          </button>
        );
      default:
        return (
          <button
            onClick={() => handleInscrever(esporteId)}
            disabled={inscrevendoId === esporteId}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold disabled:opacity-50"
          >
            {inscrevendoId === esporteId ? 'Inscrevendo...' : 'Inscrever-se'}
          </button>
        );
    }
  };

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
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaHome />
            Voltar para Home
          </Link>
        </div>
        
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <h3 className="text-red-400 font-semibold mb-2">Erro ao carregar esportes</h3>
          <p className="text-red-300 mb-4">Detalhes: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <h1 className="text-3xl font-bold mb-6 text-red-500">Esportes Disponíveis</h1>

      {esportes.length === 0 ? (
        <div className="text-center py-12">
          <FaUsers className="mx-auto text-6xl text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">Nenhum esporte disponível no momento.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {esportes
            .filter((esporte) => esporte.nome.toLowerCase() !== 'geral' && esporte.id !== '0')
            .map((esporte) => {
            const esporteId = esporte.id;
            if (!esporteId) return null;
            
            const inscricoesAprovadas = esporte.inscricoes?.filter(i => i.status === 'aceito').length || 0;
              return (
              <div
                key={esporteId}
                className="bg-gray-900 rounded-lg border border-gray-700 hover:border-red-500 transition-colors overflow-hidden"
              >
                {/* Imagem do esporte */}
                <div className="h-48 bg-gray-800 flex items-center justify-center relative overflow-hidden">
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
                </div>

                <div className="p-4">
                  <h2 className="font-bold text-xl mb-2 text-white">{esporte.nome}</h2>
                  
                  <div className="flex items-center gap-1 text-gray-500 mb-4">
                    <FaUsers />
                    <span className="text-sm">{inscricoesAprovadas} membros</span>
                  </div>

                  {/* Botão de inscrição */}
                  <div className="mt-4">
                    {getStatusButton(esporteId)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
