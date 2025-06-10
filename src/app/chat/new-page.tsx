'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useEsportes } from '@/hooks/useEsportes';
import { FaHome, FaComments, FaUsers, FaSearch } from 'react-icons/fa';

export default function ChatPage() {
  const { user } = useAuth();
  const { esportes, isLoading: loading } = useEsportes();
  const [searchTerm, setSearchTerm] = useState('');

  // Filtrar esportes com base na busca
  const filteredEsportes = esportes.filter(esporte =>
    esporte.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Separar esportes em que o usuário está inscrito
  const esportesInscritos = filteredEsportes.filter(esporte =>
    esporte.inscricoes?.some(inscricao => 
      inscricao.status === 'aceito' && inscricao.usuario?.nome === user?.nome
    )
  );
  
  const outrosEsportes = filteredEsportes.filter(esporte =>
    !esporte.inscricoes?.some(inscricao => 
      inscricao.status === 'aceito' && inscricao.usuario?.nome === user?.nome
    )
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando chats...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaHome />
            Voltar para Home
          </Link>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center justify-center gap-3">
            <FaComments className="text-red-600" />
            Chat por Esporte
          </h1>
          <p className="text-gray-400">
            Converse com outros atletas em tempo real
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative max-w-md mx-auto mb-8">
          <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Buscar esporte..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-red-500"
          />
        </div>
      </div>

      {/* Chat Geral */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold text-white mb-4">Chat Geral</h2>
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden hover:border-red-500/50 transition-colors">
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                <FaComments className="text-white text-xl" />
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-lg text-white">Chat Geral da Atlética</h3>
                <p className="text-gray-400 text-sm">
                  Converse com toda a comunidade atlética
                </p>
              </div>
              <Link
                href="/chat/0"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Entrar
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Esportes Inscritos */}
      {esportesInscritos.length > 0 && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            <span className="w-3 h-3 bg-green-500 rounded-full"></span>
            Meus Esportes
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {esportesInscritos.map(esporte => (
              <div key={esporte.id} className="bg-gray-800 border border-green-600/30 rounded-lg overflow-hidden hover:border-green-500/50 transition-colors">
                {esporte.fotoUrl && (
                  <div className="h-32 bg-gray-700 relative">
                    <Image 
                      src={esporte.fotoUrl} 
                      alt={esporte.nome}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-white">{esporte.nome}</h3>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    Chat do esporte {esporte.nome}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <FaUsers />
                      <span>{esporte.inscricoes?.length || 0} participantes</span>
                    </div>
                    
                    <Link
                      href={`/chat/${esporte.id}`}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Entrar
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Outros Esportes */}
      {outrosEsportes.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
            Outros Esportes
            <span className="text-sm text-gray-400 font-normal">
              (necessário inscrição aprovada)
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {outrosEsportes.map(esporte => (
              <div key={esporte.id} className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden opacity-75">
                {esporte.fotoUrl && (
                  <div className="h-32 bg-gray-700 relative">
                    <Image 
                      src={esporte.fotoUrl} 
                      alt={esporte.nome}
                      fill
                      className="object-cover"
                    />
                  </div>
                )}
                
                <div className="p-4">
                  <h3 className="font-semibold text-lg mb-2 text-white">{esporte.nome}</h3>
                  
                  <p className="text-gray-400 text-sm mb-4">
                    Chat do esporte {esporte.nome}
                  </p>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-400 text-sm">
                      <FaUsers />
                      <span>{esporte.inscricoes?.length || 0} participantes</span>
                    </div>
                    
                    <Link
                      href={`/sports/${esporte.id}`}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-3 py-1 rounded text-sm transition-colors"
                    >
                      Ver Esporte
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filteredEsportes.length === 0 && (
        <div className="text-center py-12">
          <FaComments className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">
            {searchTerm ? 'Nenhum esporte encontrado' : 'Nenhum esporte disponível'}
          </h3>
          <p className="text-gray-500">
            {searchTerm 
              ? 'Tente buscar por outro termo'
              : 'Aguarde novos esportes serem cadastrados'
            }
          </p>
        </div>
      )}
    </div>
  );
}
