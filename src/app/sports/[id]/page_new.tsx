'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { FaHome, FaCalendar, FaUsers, FaArrowLeft, FaEdit, FaTrash, FaComments, FaPaperPlane, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { esportesService, eventosService, type Esporte, type Evento } from '@/services/api';
import { useMensagens } from '@/hooks/useMensagens';
import { useInscricoes } from '@/hooks/useInscricoes';

export default function SportDetailPage() {
  const params = useParams();
  // const router = useRouter(); // TODO: Implementar navegação se necessário
  const { user } = useAuth();
  const [esporte, setEsporte] = useState<Esporte | null>(null);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // const [actionLoading, setActionLoading] = useState(false); // TODO: Implementar loading de ações
  const [activeTab, setActiveTab] = useState<'mensagens' | 'eventos'>('mensagens');
  const [newMessage, setNewMessage] = useState('');

  const isAdmin = user?.role === 'admin';
  const esporteId = typeof params.id === 'string' ? params.id : null;
  const { getStatusInscricao } = useInscricoes();
  const {
    mensagens,
    isLoading: mensagensLoading,
    enviarMensagem,
    excluirMensagem,
    podeExcluirMensagem
  } = useMensagens(esporteId || '');
  // Verificar se usuário está inscrito neste esporte
  const isInscrito = esporteId ? getStatusInscricao(esporteId) === 'aceito' : false;
  const loadEsporte = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await esportesService.buscarEsporte(esporteId!);
      setEsporte(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar esporte');
    } finally {
      setLoading(false);
    }
  }, [esporteId]);

  const loadEventos = useCallback(async () => {
    try {
      // Carregar todos os eventos e filtrar por esporte se necessário
      const allEventos = await eventosService.listarEventos();
      // Aqui você pode filtrar eventos por esporte se a API suportar
      setEventos(allEventos);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
    }
  }, []);

  useEffect(() => {
    if (esporteId) {
      loadEsporte();
      loadEventos();
    }
  }, [esporteId, loadEsporte, loadEventos]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !esporteId) return;

    try {
      await enviarMensagem(newMessage);
      setNewMessage('');
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
    }
  };
  const handleDeleteMessage = async (messageId: string) => {
    if (confirm('Tem certeza que deseja excluir esta mensagem?')) {
      try {
        await excluirMensagem(messageId);
      } catch (error) {
        console.error('Erro ao excluir mensagem:', error);
      }
    }  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-gray-400">Carregando...</div>
        </div>
      </div>
    );
  }

  if (error || !esporte) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded">
          {error || 'Esporte não encontrado'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-6 flex justify-between items-center">
        <Link href="/sports" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaArrowLeft />
          Voltar para Esportes
        </Link>
        
        <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300">
          <FaHome />
          Home
        </Link>
      </div>

      {/* Esporte Info */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 mb-6 overflow-hidden">
        <div className="h-48 bg-gray-800 flex items-center justify-center relative">          {esporte.fotoUrl ? (
            <Image 
              src={esporte.fotoUrl}
              alt={esporte.nome}
              fill
              className="object-cover"
              onError={(e) => {
                console.log('Erro ao carregar imagem do esporte:', esporte.fotoUrl);
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <FaImage className="text-6xl text-gray-600" />
          )}
        </div>
        
        <div className="p-6">
          <div className="flex justify-between items-start mb-4">            <div>
              <h1 className="text-3xl font-bold text-white mb-2">{esporte.nome}</h1>
              
              <div className="flex items-center gap-1 text-gray-400">
                <FaUsers />
                <span>{esporte.inscricoes?.filter(i => i.status === 'aceito').length || 0} membros</span>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex gap-2">
                <Link
                  href={`/admin-dashboard/esportes`}
                  className="text-blue-400 hover:text-blue-300 p-2"
                >
                  <FaEdit />
                </Link>
              </div>
            )}
          </div>

          {!isInscrito && !isAdmin && (
            <div className="bg-yellow-900 border border-yellow-600 text-yellow-200 px-4 py-3 rounded mb-4">
              Você precisa estar inscrito neste esporte para acessar mensagens e eventos específicos.
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      {(isInscrito || isAdmin) && (
        <div className="mb-6">
          <div className="flex space-x-1 bg-gray-900 p-1 rounded-lg border border-gray-800">
            <button
              onClick={() => setActiveTab('mensagens')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'mensagens'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <FaComments className="inline mr-2" />
              Mensagens
            </button>
            <button
              onClick={() => setActiveTab('eventos')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'eventos'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800'
              }`}
            >
              <FaCalendar className="inline mr-2" />
              Eventos
            </button>
          </div>
        </div>
      )}

      {/* Content */}
      {(isInscrito || isAdmin) && (
        <div className="bg-gray-900 rounded-lg border border-gray-800">
          {activeTab === 'mensagens' && (
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Chat do {esporte.nome}</h3>
              
              {/* Mensagens */}
              <div className="h-96 overflow-y-auto mb-4 space-y-3 bg-gray-800 rounded-lg p-4">
                {mensagensLoading ? (
                  <div className="text-center text-gray-400">Carregando mensagens...</div>
                ) : mensagens.length === 0 ? (
                  <div className="text-center text-gray-400">
                    Nenhuma mensagem ainda. Seja o primeiro a enviar uma mensagem!
                  </div>
                ) : (                  mensagens.map((mensagem) => (
                    <div
                      key={mensagem.id}
                      className={`flex ${mensagem.remetenteId === user?.id ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg relative ${
                          mensagem.remetenteId === user?.id
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-700 text-gray-200'
                        }`}
                      >
                        {mensagem.remetenteId !== user?.id && (
                          <div className="text-xs text-gray-400 mb-1">
                            {mensagem.remetente?.nome || 'Usuário'}
                          </div>                )}

                <div>{mensagem.texto}</div>

                <div className="text-xs opacity-75 mt-1 flex justify-between items-center">
                          <span>{formatDate(mensagem.criadaEm)}</span>
                          
                          {podeExcluirMensagem(mensagem) && (
                            <div className="flex gap-1 ml-2">
                              <button
                                onClick={() => handleDeleteMessage(mensagem.id)}
                                className="text-red-400 hover:text-red-300"
                                title="Excluir"
                              >
                                <FaTrash className="text-xs" />
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              {/* Input para nova mensagem */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                  placeholder="Digite sua mensagem..."
                  className="flex-1 p-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400"
                />
                <button
                  onClick={handleSendMessage}
                  disabled={!newMessage.trim()}
                  className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2"
                >
                  <FaPaperPlane />
                </button>
              </div>
            </div>
          )}

          {activeTab === 'eventos' && (
            <div className="p-6">
              <h3 className="text-xl font-bold mb-4">Eventos de {esporte.nome}</h3>
              
              {eventos.length === 0 ? (
                <div className="text-center py-12">
                  <FaCalendar className="mx-auto text-6xl text-gray-600 mb-4" />
                  <p className="text-gray-400 text-lg">Nenhum evento disponível para este esporte.</p>
                </div>
              ) : (
                <div className="space-y-4">                  {eventos.map((evento) => (
                    <div
                      key={evento._id}
                      className="bg-gray-800 p-4 rounded-lg border border-gray-700 hover:border-red-500 transition-colors"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex-1">
                          <h4 className="text-lg font-bold text-white mb-1">{evento.titulo}</h4>
                          <p className="text-gray-300 text-sm mb-2">{evento.descricao}</p>
                          
                          <div className="flex flex-wrap gap-3 text-sm text-gray-400">
                            <div className="flex items-center gap-1">
                              <FaCalendar />
                              {formatDate(evento.data)}
                            </div>
                            <div className="flex items-center gap-1">
                              <FaMapMarkerAlt />
                              {evento.local}
                            </div>
                            <div className="flex items-center gap-1">
                              <FaUsers />
                              {evento.inscricoes?.length || 0} participante(s)
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex justify-between items-center pt-3 border-t border-gray-700">
                        <Link
                          href={`/events/${evento._id}`}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Ver detalhes
                        </Link>
                        
                        <button
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                        >
                          Participar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
