'use client';

import { useState, useEffect, useMemo } from 'react';
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
  
  // Filtrar esportes onde o usuário tem inscrição aprovada
  const esportesPermitidos = useMemo(() => {
    if (user?.role === 'admin') {
      // Admin pode ver todos os esportes
      return esportes;
    }
    
    // Filtrar apenas esportes onde o usuário tem inscrição aceita
    return esportes.filter(esporte => {
      const inscricao = minhasInscricoes.find(i => i.esporteId === esporte.id.toString());
      return inscricao?.status === 'aceito';
    });
  }, [esportes, minhasInscricoes, user?.role]);
    
  // Selecionar automaticamente o primeiro esporte disponível
  useEffect(() => {
    if (isOpen && esportesPermitidos.length > 0 && !grupoSelecionado) {
      setGrupoSelecionado(esportesPermitidos[0].id.toString());
    }
  }, [isOpen, esportesPermitidos, grupoSelecionado]);  // Determina o esporteId baseado no grupo selecionado
  const esporteId = grupoSelecionado;
  
  const {
    mensagens,
    carregarMensagens,
    enviarMensagem,
    isLoading,
    error
  } = useMensagens(esporteId || '');
  
  // Ordenar mensagens da mais antiga para a mais nova (cronológica)
  const mensagensOrdenadas = useMemo(() => {
    return [...mensagens].sort((a, b) => 
      new Date(a.criadaEm).getTime() - new Date(b.criadaEm).getTime()
    );
  }, [mensagens]);
  // Carregar mensagens quando o modal abrir ou o grupo mudar
  useEffect(() => {
    if (isOpen && esporteId) {
      carregarMensagens();
    }
  }, [isOpen, esporteId, carregarMensagens]);
  
  const handleEnviarMensagem = async () => {
    if (!novaMensagem.trim() || !esporteId) return;

    try {
      await enviarMensagem(novaMensagem);
      setNovaMensagem('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
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
        </div>        <div className="flex h-[70vh]">
          {/* Sidebar - Grupos */}          <div className="w-1/4 border-r border-gray-800 p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">GRUPOS</h3>
            
            {/* Verificar se há esportes permitidos */}
            {esportesPermitidos.length === 0 ? (
              <div className="text-center text-gray-400 p-4">
                <FaComments className="mx-auto text-3xl mb-2 opacity-50" />
                <p className="text-sm">
                  {user?.role === 'admin' 
                    ? 'Nenhum esporte disponível' 
                    : 'Você não tem inscrições aprovadas em nenhum esporte'
                  }
                </p>
              </div>
            ) : (
              /* Grupos dos Esportes */
              <div className="space-y-1">
                {esportesPermitidos.map((esporte) => (
                  <button
                    key={esporte.id}
                    onClick={() => setGrupoSelecionado(esporte.id.toString())}
                    className={`w-full text-left p-3 rounded-lg flex items-center gap-2 ${
                      grupoSelecionado === esporte.id.toString()
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    }`}
                  >
                    <FaComments />
                    <span className="truncate">{esporte.nome}</span>
                  </button>
                ))}
              </div>
            )}
          </div>          {/* Área principal - Chat */}
          <div className="flex-1 flex flex-col">            {/* Header do chat */}
            <div className="p-4 border-b border-gray-800">
              <h4 className="font-semibold">
                {esportesPermitidos.find(e => e.id.toString() === grupoSelecionado)?.nome || 'Selecione um esporte'}
              </h4>
            </div>

            {/* Verificar se tem esportes permitidos */}
            {esportesPermitidos.length === 0 ? (
              <div className="flex-1 flex items-center justify-center p-4">
                <div className="text-center text-gray-400">
                  <FaComments className="mx-auto text-4xl mb-4 opacity-50" />
                  <p className="mb-2">Chat indisponível</p>
                  <p className="text-sm">
                    {user?.role === 'admin' 
                      ? 'Nenhum esporte disponível para conversar.' 
                      : 'Você precisa estar inscrito e aprovado em um esporte para acessar o chat.'
                    }
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Mensagens */}
                <div 
                  className="flex-1 overflow-y-auto p-4 space-y-3"
                  style={{ scrollBehavior: 'smooth' }}
                  ref={(el) => {
                    // Auto-scroll para a última mensagem quando carregadas
                    if (el && mensagensOrdenadas.length > 0) {
                      el.scrollTop = el.scrollHeight;
                    }
                  }}
                >
                  {error && (
                    <div className="bg-red-900 border border-red-600 text-red-200 px-3 py-2 rounded text-sm">
                      {error}
                    </div>
                  )}

                  {isLoading ? (
                    <div className="text-center text-gray-400">Carregando mensagens...</div>
                  ) : mensagensOrdenadas.length === 0 ? (
                    <div className="text-center text-gray-400">
                      Nenhuma mensagem ainda. Seja o primeiro a enviar uma mensagem!
                    </div>
                  ) : (                    mensagensOrdenadas.map((mensagem) => (
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
                        >
                          {mensagem.remetenteId !== user?.id && (
                            <div className="text-xs text-gray-400 mb-1">
                              {mensagem.remetente?.nome || 'Usuário'}
                            </div>
                          )}
                          <div>{mensagem.conteudo}</div>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
