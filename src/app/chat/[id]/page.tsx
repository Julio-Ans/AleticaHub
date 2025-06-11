'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState, useCallback, useRef } from 'react';
import Link from 'next/link';
import { FaHome, FaTrash, FaEdit, FaThumbsUp } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

type Mensagem = {
  id?: string;
  _id?: string;
  texto?: string;
  conteudo?: string;
  remetente?: { nome: string; id: string };
  remetenteId?: string;
  usuarioId?: string;
  usuarioNome?: string;
  criadaEm: string;
  fixada?: boolean;
  editada?: boolean;
};

export default function ChatPage() {  const { id } = useParams();
  const { user } = useAuth();
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [novaMensagem, setNovaMensagem] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [novoConteudo, setNovoConteudo] = useState('');
  const mensagensRef = useRef<HTMLDivElement>(null);  const [loading, setLoading] = useState(true);
  const [permitido, setPermitido] = useState(false);
  
  const carregarMensagens = useCallback(async () => {
    try {
      const res = await fetch(`/api/mensagens/${id}`);
      if (res.ok) {
        const data = await res.json();
        setMensagens(data);
      }
    } catch (error) {
      console.error('Erro ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  const verificarPermissoes = useCallback(async () => {
    try {
      const tipo = id === '0' ? 'geral' : 'esporte';
      const esporteId = id !== '0' ? id : '';
      
      const res = await fetch(`/api/permissoes-chat?tipo=${tipo}&esporteId=${esporteId}`);
      const data = await res.json();
      setPermitido(data.permitido);
    } catch (error) {
      console.error('Erro ao verificar permissões:', error);
      setPermitido(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      carregarMensagens();
      verificarPermissoes();
    }
  }, [id, carregarMensagens, verificarPermissoes]);

  const enviarMensagem = async () => {
    if (!novaMensagem.trim() || !permitido) return;

    try {      const res = await fetch(`/api/mensagens/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          conteudo: novaMensagem 
        }),
      });

      if (res.ok) {
        const mensagem = await res.json();
        setMensagens(prev => [...prev, mensagem]);
        setNovaMensagem('');
        await carregarMensagens(); // Recarregar para garantir
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };
  const editarMensagem = async (mensagemId: string) => {
    if (!novoConteudo.trim()) return;

    try {
      const res = await fetch(`/api/mensagens/${mensagemId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          conteudo: novoConteudo 
        }),
      });

      if (res.ok) {
        setEditandoId(null);
        setNovoConteudo('');
        await carregarMensagens();
      }
    } catch (error) {
      console.error('Erro ao editar mensagem:', error);
    }
  };

  const excluirMensagem = async (mensagemId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;

    try {
      const res = await fetch(`/api/mensagens/${mensagemId}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMensagens(prev => prev.filter(m => m.id !== mensagemId));
      }
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
    }
  };

  const fixarMensagem = async (mensagemId: string) => {
    if (user?.role !== 'admin') return;

    try {
      const res = await fetch(`/api/mensagens/${mensagemId}/fixar`, {
        method: 'POST',
      });

      if (res.ok) {
        await carregarMensagens();
      }
    } catch (error) {
      console.error('Erro ao fixar mensagem:', error);
    }
  };
  const iniciarEdicao = (mensagem: Mensagem) => {
    const id = mensagem.id || mensagem._id;
    if (!id) return;
    
    setEditandoId(id);
    setNovoConteudo(mensagem.texto || mensagem.conteudo || '');
  };

  const podeEditarExcluir = (mensagem: Mensagem) => {
    const remetenteId = mensagem.remetenteId || mensagem.usuarioId;
    return user && (user.role === 'admin' || user.id === remetenteId);
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Carregando...</p>
        </div>
      </div>
    );
  }

  const nomeGrupo = id === '0' ? 'Chat Geral' : `Chat - Esporte`;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/chat" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Chats
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-4">{nomeGrupo}</h1>      {/* Mensagens */}
      <div className="bg-gray-900 border border-gray-800 rounded-lg p-4 h-96 overflow-y-auto space-y-3 mb-4" ref={mensagensRef}>
        {mensagens.length === 0 ? (
          <p className="text-gray-400 text-center">Nenhuma mensagem ainda</p>
        ) : (
          mensagens.map(mensagem => (
            <div
              key={mensagem.id}
              className={`p-3 rounded-lg ${
                mensagem.fixada 
                  ? 'bg-yellow-900 border border-yellow-600' 
                  : 'bg-gray-800'
              }`}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  {editandoId === (mensagem.id || mensagem._id) ? (
                    <div className="space-y-2">
                      <textarea
                        value={novoConteudo}
                        onChange={(e) => setNovoConteudo(e.target.value)}
                        className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white"
                        rows={2}
                      />                      <div className="flex gap-2">
                        <button
                          onClick={() => {
                            const id = mensagem.id || mensagem._id;
                            if (id) editarMensagem(id);
                          }}
                          className="bg-green-600 hover:bg-green-700 px-3 py-1 rounded text-sm"
                        >
                          Salvar
                        </button>
                        <button
                          onClick={() => setEditandoId(null)}
                          className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-sm"
                        >
                          Cancelar
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>                      <div className="flex items-center gap-2 mb-1">
                        <strong className="text-red-400">
                          {(() => {                            console.log('🔍 Chat individual - Debug nome:', {
                              mensagemId: mensagem.id || mensagem._id,
                              remetente: mensagem.remetente,
                              usuarioNome: mensagem.usuarioNome,
                              remetenteId: mensagem.remetenteId || mensagem.usuarioId,
                              userId: user?.id,
                              userName: user?.nome,
                              todasAsChaves: Object.keys(mensagem)
                            });
                            
                            const nome = mensagem.usuarioNome ||
                                        mensagem.remetente?.nome ||
                                        (user?.id === (mensagem.remetenteId || mensagem.usuarioId) ? user?.nome : null) ||
                                        `Usuário ${(mensagem.remetenteId || mensagem.usuarioId)?.substring(0, 8) || 'Anônimo'}`;
                                        
                            console.log('📝 Chat individual - Nome escolhido:', nome);
                            return nome;
                          })()}
                        </strong>
                        {mensagem.fixada && (
                          <span className="bg-yellow-600 text-yellow-100 px-2 py-1 rounded text-xs">
                            Fixada
                          </span>
                        )}
                        {mensagem.editada && (
                          <span className="text-gray-400 text-xs">(editada)</span>
                        )}
                      </div>
                      <p className="text-white">{mensagem.texto || mensagem.conteudo}</p>
                      <span className="text-gray-400 text-xs">
                        {new Date(mensagem.criadaEm).toLocaleString()}
                      </span>
                    </>
                  )}
                </div>

                {editandoId !== mensagem.id && (
                  <div className="flex gap-2 ml-2">                    {user?.role === 'admin' && (
                      <button
                        onClick={() => {
                          const id = mensagem.id || mensagem._id;
                          if (id) fixarMensagem(id);
                        }}
                        className="text-yellow-500 hover:text-yellow-400"
                        title="Fixar mensagem"
                      >
                        <FaThumbsUp size={14} />
                      </button>
                    )}{podeEditarExcluir(mensagem) && (
                        <>
                          <button
                            onClick={() => {
                              const id = mensagem.id || mensagem._id;
                              if (id) iniciarEdicao(mensagem);
                            }}
                            className="text-blue-500 hover:text-blue-400"
                            title="Editar"
                          >
                            <FaEdit size={14} />
                          </button>
                          <button
                            onClick={() => {
                              const id = mensagem.id || mensagem._id;
                              if (id) excluirMensagem(id);
                            }}
                            className="text-red-500 hover:text-red-400"
                            title="Excluir"
                          >
                            <FaTrash size={14} />
                          </button>
                        </>
                      )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* Campo de nova mensagem */}
      {permitido ? (
        <div className="flex gap-2">
          <input
            value={novaMensagem}
            onChange={(e) => setNovaMensagem(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && enviarMensagem()}
            className="flex-1 p-3 bg-gray-800 border border-gray-700 rounded text-white"
            placeholder="Digite sua mensagem..."
          />
          <button
            onClick={enviarMensagem}
            className="bg-red-600 hover:bg-red-700 px-6 py-3 rounded text-white font-semibold"
          >
            Enviar
          </button>
        </div>
      ) : (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-center">
            {id === '0' 
              ? 'Apenas administradores podem enviar mensagens no chat geral.'
              : 'Você precisa ter a inscrição aprovada neste esporte para enviar mensagens.'
            }
          </p>
        </div>
      )}
    </div>
  );
}
