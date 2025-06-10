'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { FaTimes, FaPaperPlane, FaComments } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useMensagens } from '@/hooks/useMensagens';
import { useInscricoes } from '@/hooks/useInscricoes';
import { Esporte } from '@/services/api';

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
  const mensagensRef = useRef<HTMLDivElement>(null);  // Filtrar esportes - apenas os que o usuário está inscrito e aprovado
  const gruposDisponiveis = useMemo(() => {
    console.log('🔍 Calculando grupos disponíveis:', {
      totalEsportes: esportes.length,
      totalInscricoes: minhasInscricoes.length,
      esportes: esportes.map(e => ({ id: e.id, nome: e.nome })),
      inscricoes: minhasInscricoes.map(i => ({ esporteId: i.esporteId, status: i.status }))
    });

    const esportesPermitidos = esportes.filter(esporte => {
      // Verificar se o usuário tem inscrição aprovada neste esporte
      const temInscricao = minhasInscricoes.some(inscricao => 
        inscricao.esporteId === esporte.id.toString() && 
        inscricao.status === 'aceito'
      );
      
      console.log(`🏃 Esporte ${esporte.nome} (ID: ${esporte.id}):`, {
        temInscricao,
        inscricoesDoEsporte: minhasInscricoes.filter(i => i.esporteId === esporte.id.toString())
      });
      
      return temInscricao;
    });

    console.log('✅ Esportes permitidos:', esportesPermitidos.map(e => e.nome));

    // Adicionar grupo geral como primeira opção (sempre disponível)
    const grupos = [
      { id: '0', nome: 'Chat Geral' },
      ...esportesPermitidos
    ];
    
    console.log('📋 Grupos finais disponíveis:', grupos.map(g => g.nome));
    
    return grupos;
  }, [esportes, minhasInscricoes]);
      // Selecionar automaticamente o grupo geral ou primeiro esporte disponível
  useEffect(() => {
    if (isOpen && gruposDisponiveis.length > 0 && !grupoSelecionado) {
      // Sempre começar com o Chat Geral (id: '0')
      setGrupoSelecionado('0');
    }
  }, [isOpen, gruposDisponiveis, grupoSelecionado]);

  // Determina o esporteId baseado no grupo selecionado
  const esporteId = grupoSelecionado;
    const {
    mensagens,
    carregarMensagens,
    enviarMensagem,
    isLoading,
    error,
    setError
  } = useMensagens(esporteId || '');  // Carregar mensagens quando o modal abrir ou o grupo mudar
  useEffect(() => {    console.log('🔄 ModalMensagens: useEffect carregarMensagens', {
      isOpen,
      esporteId,
      gruposDisponiveis: gruposDisponiveis.map(g => g.id),
      grupoExiste: gruposDisponiveis.some(g => g.id.toString() === esporteId)
    });    // Carregar mensagens se modal estiver aberto e tiver esporteId válido
    if (isOpen && esporteId) {
      // Limpar estado anterior ao trocar de grupo
      setError(null);
      console.log(`📞 Chamando carregarMensagens para esporte: ${esporteId}`);
      
      // Forçar limpeza das mensagens antes de carregar novas
      carregarMensagens().catch(err => {
        console.error('💥 Erro ao carregar mensagens no useEffect:', err);
      }).then(() => {
        // Auto-scroll após carregar mensagens
        setTimeout(() => {
          if (mensagensRef.current) {
            mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
          }
        }, 100);
      });
    }
  }, [isOpen, esporteId, carregarMensagens, gruposDisponiveis, setError]);  // Auto-scroll para o final sempre que as mensagens mudarem
  useEffect(() => {
    // Log para debug das mensagens
    if (mensagens.length > 0) {
      console.log('🖥️ Renderizando mensagens:', { 
        total: mensagens.length, 
        esporteId, 
        primeiraMensagem: mensagens[0] 
      });
    }
    
    if (mensagensRef.current && mensagens.length > 0) {
      console.log(`📬 Mensagens carregadas: ${mensagens.length} para grupo: ${esporteId}`);
      // Usar requestAnimationFrame para garantir que o DOM foi atualizado
      requestAnimationFrame(() => {
        if (mensagensRef.current) {
          mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
          console.log(`✅ Auto-scroll executado para ${mensagens.length} mensagens`);
        }
      });
    }
  }, [mensagens, esporteId]);
  // Auto-scroll específico quando trocar de grupo
  useEffect(() => {
    if (mensagensRef.current && esporteId) {
      console.log(`🔄 Fazendo auto-scroll para grupo: ${esporteId}`);
      setTimeout(() => {
        if (mensagensRef.current) {
          const scrollHeight = mensagensRef.current.scrollHeight;
          const clientHeight = mensagensRef.current.clientHeight;
          console.log(`📏 ScrollHeight: ${scrollHeight}, ClientHeight: ${clientHeight}`);
          mensagensRef.current.scrollTop = scrollHeight;
          console.log(`⬇️ ScrollTop definido para: ${scrollHeight}`);
        }
      }, 300); // Timeout maior para garantir que as mensagens foram carregadas
    }
  }, [esporteId]);

  // Auto-scroll quando o modal abrir
  useEffect(() => {
    if (isOpen && mensagensRef.current) {
      // Limpar erro ao abrir o modal
      setError(null);
      setTimeout(() => {
        if (mensagensRef.current) {
          mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
        }
      }, 200); // Aumentar timeout para garantir carregamento
    }
  }, [isOpen, setError]);  const handleEnviarMensagem = async () => {
    console.log('🚀 Tentando enviar mensagem...', { 
      mensagem: novaMensagem.trim(), 
      esporteId, 
      usuario: user?.nome,
      token: !!localStorage.getItem('authToken') || !!localStorage.getItem('athletica_token')
    });

    if (!novaMensagem.trim() || !esporteId) {
      console.log('❌ Validação falhou:', { mensagem: !novaMensagem.trim(), esporteId: !esporteId });
      return;
    }

    try {
      const resultado = await enviarMensagem(novaMensagem);
      console.log('✅ Mensagem enviada com sucesso:', resultado);
      setNovaMensagem('');
      
      // Garantir scroll para o final após enviar mensagem
      setTimeout(() => {
        if (mensagensRef.current) {
          mensagensRef.current.scrollTop = mensagensRef.current.scrollHeight;
        }
      }, 100);
    } catch (error) {
      console.error('❌ Erro ao enviar mensagem:', error);
      // Exibir erro para o usuário se não for um erro esperado
      if (!(error instanceof Error && error.message.includes('não encontrado'))) {
        setError(error instanceof Error ? error.message : 'Erro ao enviar mensagem');
      }
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
          {/* Sidebar - Grupos */}          <div className="w-1/4 border-r border-gray-800 p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">GRUPOS</h3>
              {/* Grupos dos Esportes */}
            <div className="space-y-1">
              {gruposDisponiveis.map((grupo) => (
                <button
                  key={grupo.id}
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
                </button>
              ))}
            </div>

            {/* Mensagem se não há grupos disponíveis */}
            {gruposDisponiveis.length === 1 && (
              <div className="mt-4 p-3 bg-gray-800 rounded-lg">
                <p className="text-xs text-gray-400 text-center">
                  Inscreva-se e seja aprovado em esportes para acessar mais grupos de chat
                </p>
              </div>
            )}
          </div>

          {/* Área principal - Chat */}
          <div className="flex-1 flex flex-col">            {/* Header do chat */}
            <div className="p-4 border-b border-gray-800">
              <h4 className="font-semibold">
                {gruposDisponiveis.find(g => g.id.toString() === grupoSelecionado)?.nome || 'Selecione um grupo'}
              </h4>
            </div>            {/* Mensagens */}
            <div 
              ref={mensagensRef}
              className="flex-1 overflow-y-auto p-4 space-y-3"
              style={{ scrollBehavior: 'smooth' }}
            >              {error && (
                <div className="bg-red-900 border border-red-600 text-red-200 px-3 py-2 rounded text-sm">
                  {error}
                </div>
              )}{isLoading ? (
                <div className="text-center text-gray-400">Carregando mensagens...</div>
              ) : mensagens.length === 0 ? (
                <div className="text-center text-gray-400">
                  Nenhuma mensagem ainda. Seja o primeiro a enviar uma mensagem!
                </div>              ) : (
                mensagens.map((mensagem) => (
                    <div
                      key={mensagem.id}
                      className={`flex ${
                        mensagem.remetenteId === user?.id ? 'justify-end' : 'justify-start'
                      }`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                          mensagem.remetenteId === user?.id
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-800 text-gray-200'
                        }`}
                      >                        {mensagem.remetenteId !== user?.id && (
                          <div className="text-xs text-gray-400 mb-1">
                            {mensagem.remetente?.nome || `Usuário ${mensagem.remetenteId?.substring(0, 8) || 'Anônimo'}`}
                          </div>
                        )}
                        <div className="text-sm">
                          {mensagem.texto?.trim() || mensagem.conteudo?.trim() || 'Mensagem sem conteúdo'}
                        </div>
                        <div className="text-xs opacity-75 mt-1">
                          {formatarData(mensagem.criadaEm)}
                        </div>
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
