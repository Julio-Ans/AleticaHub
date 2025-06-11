'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHome, FaComments } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { esportesService, inscricoesService } from '@/services/api';

type Chat = {
  id: string;
  nome: string;
  ultimoConteudo?: string;
  temPermissao: boolean;
};

export default function ChatPage() {
  const { user } = useAuth();
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarChats = async () => {
      try {
        setLoading(true);
        
        // Buscar todos os esportes
        const todosEsportes = await esportesService.listarEsportes();
        
        // Buscar minhas inscrições
        const minhasInscricoes = await inscricoesService.minhasInscricoes();
        
        // Construir lista de chats
        const chatsDisponiveis: Chat[] = [];
        
        // Adicionar chat geral (sempre disponível)
        chatsDisponiveis.push({
          id: '0',
          nome: 'Chat Geral',
          temPermissao: true
        });
        
        // Adicionar chats de esportes
        for (const esporte of todosEsportes) {
          if (esporte.id === '0') continue; // Pular o esporte "Geral" duplicado
          
          // Verificar se tem permissão
          const temInscricaoAceita = minhasInscricoes.some(
            inscricao => inscricao.esporteId === esporte.id && inscricao.status === 'aceito'
          );
          
          // Admin pode acessar todos os chats
          const temPermissao = user?.role === 'admin' || temInscricaoAceita;
          
          chatsDisponiveis.push({
            id: esporte.id.toString(),
            nome: esporte.nome,
            temPermissao
          });
        }
        
        setChats(chatsDisponiveis);
      } catch (error) {
        console.error('Erro ao carregar chats:', error);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      carregarChats();
    }
  }, [user]);
  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Carregando chats...</p>
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

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaComments />
        Chat
      </h1>

      {chats.length === 0 ? (
        <p className="text-gray-400">Nenhum grupo de chat disponível.</p>
      ) : (
        <div className="space-y-4 bg-gray-900 p-6 rounded-lg shadow border border-gray-800">
          {chats.map(chat => (
            <div key={chat.id} className="relative">
              <Link
                href={`/chat/${chat.id}`}
                className={`block p-4 border rounded-lg transition ${
                  chat.temPermissao 
                    ? 'border-gray-800 hover:border-red-500' 
                    : 'border-gray-700 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <h3 className="font-bold">{chat.nome}</h3>
                  {!chat.temPermissao && (
                    <span className="text-xs bg-yellow-600 text-yellow-100 px-2 py-1 rounded">
                      Sem permissão
                    </span>
                  )}
                  {chat.id === '0' && (
                    <span className="text-xs bg-blue-600 text-blue-100 px-2 py-1 rounded">
                      GERAL
                    </span>
                  )}
                </div>
                {chat.ultimoConteudo && (
                  <p className="text-gray-400 text-sm truncate mt-1">{chat.ultimoConteudo}</p>
                )}
                {!chat.temPermissao && (
                  <p className="text-gray-500 text-xs mt-1">
                    Você precisa ter inscrição aprovada neste esporte para participar do chat
                  </p>
                )}
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
