'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FaTimes, FaPaperPlane, FaComments } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useMensagens } from '@/hooks/useMensagens';
import { useInscricoes } from '@/hooks/useInscricoes';
import { Esporte } from '@/services/api';

interface Mensagem {
  id?: string;
  _id?: string;
  texto?: string;
  conteudo?: string;
  remetente?: { nome: string };
  usuario?: { nome: string };
  remetenteId?: string;
  usuarioId?: string;
  usuarioNome?: string;
  criadaEm: string;
  editada?: boolean;
  fixada?: boolean;
}

interface ModalMensagensProps {
  isOpen: boolean;
  onClose: () => void;
  esportes: Esporte[];
}

export default function ModalMensagens({ isOpen, onClose, esportes }: ModalMensagensProps) {
  const { user } = useAuth();
  const { minhasInscricoes } = useInscricoes();
  const [grupoSelecionado, setGrupoSelecionado] = useState<string>('');
  const [novaMensagem, setNovaMensagem] = useState('');
  const [editandoId, setEditandoId] = useState<string | null>(null);
  const [conteudoEditando, setConteudoEditando] = useState('');
  const mensagensRef = useRef<HTMLDivElement>(null);  // Filtrar esportes - apenas os que o usuário está inscrito e aprovado, ou admin acessa todos
  const gruposDisponiveis = useMemo(() => {
    const esportesPermitidos = esportes.filter(esporte => {
      // Filtrar o esporte "Geral" (id: 0) para evitar duplicação
      if (!esporte || !esporte.id || esporte.id.toString() === '0') {
        return false;
      }

      // Admins podem acessar todos os esportes
      if (user?.role === 'admin') {
        return true;
      }

      // Usuários normais apenas esportes com inscrição aprovada
      return minhasInscricoes.some(inscricao => 
        inscricao.esporteId === esporte.id.toString() && 
        inscricao.status === 'aceito'
      );
    });

    // Adicionar grupo geral como primeira opção (sempre disponível)
    const grupos = [
      { id: '0', nome: 'Chat Geral' },
      // Transformar esportes em grupos com IDs como string
      ...esportesPermitidos.map(esporte => ({
        id: esporte.id.toString(),
        nome: esporte.nome
      }))
    ];
    
    return grupos;
  }, [esportes, minhasInscricoes, user?.role]);

  // Selecionar automaticamente o grupo geral ou primeiro esporte disponível
  useEffect(() => {
    if (isOpen && gruposDisponiveis.length > 0 && !grupoSelecionado) {
      // Sempre começar com o Chat Geral (id: '0')
      setGrupoSelecionado('0');
    }
  }, [isOpen, gruposDisponiveis, grupoSelecionado]);

  // Determina o esporteId baseado no grupo selecionado
  const esporteId = grupoSelecionado;    const {
    mensagens,
    carregarMensagens,
    enviarMensagem,
    excluirMensagem,
    fixarMensagem,
    isLoading,
    error,
    setError,
    editarMensagem
  } = useMensagens(esporteId || '');// Carregar mensagens quando o modal abrir ou o grupo mudar
  useEffect(() => {
    if (isOpen && esporteId) {
      console.log('🔄 ModalMensagens: Carregando mensagens para grupo:', {
        esporteId,
        grupoSelecionado,
        isChatGeral: esporteId === '0',
        gruposDisponiveis: gruposDisponiveis.map(g => ({ id: g.id, nome: g.nome }))
      });
      
      setError(null);
      carregarMensagens().catch(err => {
        console.error('Erro ao carregar mensagens:', err);
        // Não mostrar erro para usuário se for "esporte não encontrado"
        // pois pode ser normal (esporte ainda não configurado para chat)
        if (!(err instanceof Error && err.message.includes('não encontrado'))) {
          setError(err instanceof Error ? err.message : 'Erro ao carregar mensagens');
        }
      });
    }
  }, [isOpen, esporteId, carregarMensagens, setError, grupoSelecionado, gruposDisponiveis]);
  // Auto-scroll para o final quando as mensagens mudarem
  useEffect(() => {
    if (mensagensRef.current && mensagens.length > 0) {
      // Usar setTimeout para garantir que o DOM foi atualizado
      setTimeout(() => {
        if (mensagensRef.current) {
          mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
        }
      }, 100);
    }
  }, [mensagens]);

  // Auto-scroll inicial quando o modal abrir
  useEffect(() => {
    if (isOpen && mensagensRef.current) {
      setTimeout(() => {
        if (mensagensRef.current) {
          mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
        }
      }, 200);
    }
  }, [isOpen, grupoSelecionado]);
  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim() || !esporteId) {
      return;
    }

    try {
      await enviarMensagem(novaMensagem);
      setNovaMensagem('');
      
      // Garantir scroll para o final após enviar mensagem
      setTimeout(() => {
        if (mensagensRef.current) {
          mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
        }
      }, 150);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      // Exibir erro para o usuário apenas se não for um erro esperado
      if (error instanceof Error) {
        if (error.message.includes('não encontrado')) {
          // Se o esporte não foi encontrado, pode ser que o chat não esteja configurado ainda
          setError('Chat não disponível para este esporte no momento. Tente novamente mais tarde.');
        } else if (!error.message.includes('Forbidden') && !error.message.includes('403')) {
          // Mostrar outros erros, exceto os de permissão que são esperados
          setError(error.message);
        }
      } else {
        setError('Erro ao enviar mensagem. Tente novamente.');
      }
    }
  };

  // Função para excluir mensagem
  const handleExcluirMensagem = async (mensagemId: string) => {
    if (!confirm('Tem certeza que deseja excluir esta mensagem?')) return;
    
    try {
      await excluirMensagem(mensagemId);
      // Recarregar mensagens após exclusão
      carregarMensagens();
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
      setError('Erro ao excluir mensagem. Tente novamente.');
    }
  };

  // Função para iniciar edição de mensagem
  const handleIniciarEdicao = (mensagem: Mensagem) => {
    const id = mensagem.id || mensagem._id;
    if (!id) return;
    
    setEditandoId(id);
    setConteudoEditando(obterTextoMensagem(mensagem));
  };
  // Função para salvar edição de mensagem
  const handleSalvarEdicao = async () => {
    if (!editandoId || !conteudoEditando.trim()) return;
    
    try {
      console.log('📝 ModalMensagens: Salvando edição', { editandoId, conteudo: conteudoEditando.substring(0, 50) + '...' });
      
      await editarMensagem(editandoId, conteudoEditando.trim());
      
      console.log('✅ ModalMensagens: Edição salva, limpando estados e recarregando');
      
      setEditandoId(null);
      setConteudoEditando('');
      
      // Recarregar mensagens para garantir que a edição apareça
      await carregarMensagens();
      
      // Garantir scroll para o final após editar mensagem
      setTimeout(() => {
        if (mensagensRef.current) {
          mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
        }
      }, 150);
    } catch (error) {
      console.error('❌ ModalMensagens: Erro ao editar mensagem:', error);
      setError('Erro ao editar mensagem. Tente novamente.');
    }
  };

  // Função para cancelar edição
  const handleCancelarEdicao = () => {
    setEditandoId(null);
    setConteudoEditando('');
  };

  // Verificar se usuário pode editar mensagem (próprio usuário ou admin)
  const podeEditarMensagem = (mensagem: Mensagem) => {
    if (!user) return false;
    // Admin pode editar qualquer mensagem, usuário só as próprias
    return user.role === 'admin' || (mensagem.remetenteId || mensagem.usuarioId) === user.id;
  };

  // Função para fixar/desfixar mensagem (admin)
  const handleFixarMensagem = async (mensagemId: string, fixada: boolean) => {
    if (user?.role !== 'admin') return;
    
    try {
      await fixarMensagem(mensagemId, fixada);
    } catch (error) {
      console.error('Erro ao fixar mensagem:', error);
      setError('Erro ao fixar mensagem. Tente novamente.');
    }
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };  // Helper function to get message text with fallbacks
  const obterTextoMensagem = (mensagem: Mensagem) => {
    return mensagem.texto?.trim() || 
           mensagem.conteudo?.trim() || 
           'Mensagem sem conteúdo';
  };  // Helper function to get sender name with fallbacks
  const obterNomeRemetente = (mensagem: Mensagem) => {
    console.log('🔍 obterNomeRemetente - Debug da mensagem:', {
      id: mensagem.id || mensagem._id,
      remetente: mensagem.remetente,
      usuario: mensagem.usuario,
      usuarioNome: mensagem.usuarioNome,
      remetenteId: mensagem.remetenteId || mensagem.usuarioId,
      todasAsChaves: Object.keys(mensagem),
      estruturaCompleta: mensagem
    });
    
    // Tentar múltiplas formas de obter o nome baseado na estrutura real da API
    const nome = mensagem.usuarioNome ||                    // 👈 CAMPO CORRETO DA API
                 mensagem.remetente?.nome || 
                 mensagem.usuario?.nome || 
                 (user?.id === (mensagem.remetenteId || mensagem.usuarioId) ? user?.nome : null) ||
                 `Usuário ${(mensagem.remetenteId || mensagem.usuarioId)?.substring(0, 8) || 'Anônimo'}`;
                 
    console.log('📝 Nome final escolhido:', nome);
    return nome;
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-gray-900 rounded-lg w-full max-w-4xl max-h-[80vh] border border-gray-800">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <FaComments />
            Central de Mensagens
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white p-1"
          >
            <FaTimes />
          </button>
        </div>

        <div className="flex h-[70vh]">
          {/* Sidebar - Grupos */}
          <div className="w-1/4 border-r border-gray-800 p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">GRUPOS</h3>            {/* Grupos dos Esportes */}
            <div className="space-y-1">
              {gruposDisponiveis.map((grupo) => (
                <button
                  key={`grupo-${grupo.id}`}
                  onClick={() => setGrupoSelecionado(grupo.id.toString())}
                  className={`w-full text-left p-3 rounded-lg flex items-center gap-2 ${
                    grupoSelecionado === grupo.id.toString()
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <FaComments />
                  <span className="truncate">{grupo.nome}</span>
                  {grupo.id === '0' && (
                    <span className="text-xs bg-blue-600 px-1 rounded">GERAL</span>
                  )}
                  {user?.role === 'admin' && grupo.id !== '0' && (
                    <span className="text-xs bg-green-600 px-1 rounded">ADMIN</span>
                  )}
                </button>
              ))}
            </div>

            {/* Mensagem se não há grupos disponíveis */}
            {gruposDisponiveis.length === 1 && user?.role !== 'admin' && (
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 text-center">
                  Inscreva-se e seja aprovado em esportes para acessar mais grupos de chat
                </p>
              </div>
            )}
          </div>

          {/* Área principal - Chat */}
          <div className="flex-1 flex flex-col">
            {/* Header do chat */}
            <div className="p-4 border-b border-gray-800">
              <h4 className="font-semibold">
                {gruposDisponiveis.find(g => g.id.toString() === grupoSelecionado)?.nome || 'Selecione um grupo'}
              </h4>
            </div>

            {/* Mensagens */}
            <div 
              ref={mensagensRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ scrollBehavior: 'smooth' }}
            >              {error && !error.includes('não encontrado') && (
                <div className="bg-red-900 border border-red-600 text-red-200 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}

              {isLoading ? (
                <div className="text-center text-gray-400">Carregando mensagens...</div>
              ) : mensagens.length === 0 ? (
                <div className="text-center text-gray-400">
                  {grupoSelecionado === '0' 
                    ? 'Nenhuma mensagem no chat geral ainda. Seja o primeiro a enviar uma mensagem!'
                    : 'Nenhuma mensagem neste esporte ainda. Seja o primeiro a enviar uma mensagem!'
                  }
                </div>) : (                mensagens.map((mensagem, index) => (
                  <div
                    key={`mensagem-${mensagem.id || mensagem._id || index}`}
                    className={`flex ${
                      (mensagem.remetenteId || mensagem.usuarioId) === user?.id ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div className="max-w-[80%] group">
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                          (mensagem.remetenteId || mensagem.usuarioId) === user?.id
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800 text-gray-200'
                        } ${mensagem.fixada ? 'ring-2 ring-yellow-500' : ''}`}
                      >
                        {mensagem.fixada && (
                          <div className="text-xs text-yellow-300 mb-1 flex items-center gap-1">
                            📌 Mensagem fixada
                          </div>
                        )}
                        {(mensagem.remetenteId || mensagem.usuarioId) !== user?.id && (
                          <div className="text-xs text-gray-400 mb-1">
                            {obterNomeRemetente(mensagem)}
                          </div>                        )}
                        
                        {/* Modo de edição */}
                        {editandoId === (mensagem.id || mensagem._id) ? (
                          <div className="space-y-2">                            <textarea
                              value={conteudoEditando}
                              onChange={(e) => setConteudoEditando(e.target.value)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter' && !e.shiftKey) {
                                  e.preventDefault();
                                  handleSalvarEdicao();
                                } else if (e.key === 'Escape') {
                                  e.preventDefault();
                                  handleCancelarEdicao();
                                }
                              }}
                              className="w-full p-2 bg-gray-700 border border-gray-600 rounded text-white text-sm resize-none"
                              rows={2}
                              placeholder="Digite o novo conteúdo..."
                            />
                            <div className="flex gap-2 justify-end">
                              <button
                                onClick={handleSalvarEdicao}
                                disabled={!conteudoEditando.trim()}
                                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 px-3 py-1 rounded text-xs text-white"
                              >
                                Salvar
                              </button>
                              <button
                                onClick={handleCancelarEdicao}
                                className="bg-gray-600 hover:bg-gray-700 px-3 py-1 rounded text-xs text-white"
                              >
                                Cancelar
                              </button>
                            </div>
                          </div>
                        ) : (
                          <>
                            <div className="text-sm">
                              {obterTextoMensagem(mensagem)}
                            </div>
                            <div className="text-xs opacity-75 mt-1">
                              {formatarData(mensagem.criadaEm)}
                              {mensagem.editada && <span className="ml-1">(editada)</span>}
                            </div>
                          </>                        )}
                      </div>
                        {/* Botões de ação - só mostrar quando não está editando */}
                      {editandoId !== (mensagem.id || mensagem._id) && (
                        <div className="flex gap-1 mt-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
                          {/* Apenas admins podem fixar mensagens */}
                          {user?.role === 'admin' && (
                            <button
                              onClick={() => handleFixarMensagem(mensagem.id || mensagem._id || '', mensagem.fixada || false)}
                              className="text-yellow-500 hover:text-yellow-400 text-xs p-1"
                              title={mensagem.fixada ? "Desfixar mensagem" : "Fixar mensagem"}
                            >
                              📌
                            </button>
                          )}
                          {/* Usuário pode editar suas próprias mensagens, admin pode editar qualquer uma */}
                          {podeEditarMensagem(mensagem) && (
                            <button
                              onClick={() => handleIniciarEdicao(mensagem)}
                              className="text-blue-500 hover:text-blue-400 text-xs p-1"
                              title="Editar mensagem"
                            >
                              ✏️
                            </button>
                          )}
                          {/* Usuário pode excluir suas próprias mensagens, admin pode excluir qualquer uma */}
                          {((mensagem.remetenteId || mensagem.usuarioId) === user?.id || user?.role === 'admin') && (
                            <button
                              onClick={() => handleExcluirMensagem(mensagem.id || mensagem._id || '')}
                              className="text-red-500 hover:text-red-400 text-xs p-1"
                              title="Excluir mensagem"
                            >
                              🗑️
                            </button>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Input de nova mensagem */}
            <div className="p-4 border-t border-gray-800">
              <div className="flex gap-2">
                <input
                  type="text"
                  value={novaMensagem}
                  onChange={(e) => setNovaMensagem(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleEnviarMensagem()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                />
                <button
                  onClick={handleEnviarMensagem}
                  disabled={!novaMensagem.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
