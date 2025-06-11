'use client';

import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useCallback } from 'react';
import { FaHome, FaCalendar, FaUsers, FaArrowLeft, FaEdit, FaTrash, FaComments, FaPaperPlane } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { esportesService, type Esporte } from '@/services/api';
import { useMensagens } from '@/hooks/useMensagens';
import { useEventos } from '@/hooks/useEventos';
import { useInscricoes } from '@/hooks/useInscricoes';

export default function SportDetailPage() {
  const params = useParams();
  const router = useRouter();  const { user } = useAuth();
  const { getStatusInscricao } = useInscricoes();
  const [esporte, setEsporte] = useState<Esporte | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [newMessage, setNewMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'info' | 'eventos'>('info');
  const isAdmin = user?.role === 'admin';  const esporteId = typeof params.id === 'string' ? params.id : null;
  
  // Verificar se usuário está inscrito e aprovado
  const statusInscricao = esporteId ? getStatusInscricao(esporteId) : null;
  const podeVerMensagens = isAdmin || statusInscricao === 'aceito';  const {
    mensagens,
    isLoading: mensagensLoading,
    enviarMensagem,
    excluirMensagem
  } = useMensagens(esporteId || '');const {
    isLoading: eventosLoading
  } = useEventos();

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
  }, [esporteId]);  useEffect(() => {
    if (esporteId) {
      loadEsporte();
    }
  }, [esporteId, loadEsporte]);

  const handleDelete = async () => {
    if (!esporteId || !confirm('Tem certeza que deseja excluir este esporte?')) return;
    
    try {
      setActionLoading(true);
      await esportesService.excluirEsporte(esporteId);
      router.push('/sports');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir esporte');
      setActionLoading(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !esporteId) return;    try {
      await enviarMensagem(newMessage);
      setNewMessage('');
    } catch (err) {
      console.error('Erro ao enviar mensagem:', err);
    }
  };

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
          <div className="text-gray-400">Carregando esporte...</div>
        </div>
      </div>
    );
  }

  if (error || !esporte) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/sports" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaArrowLeft />
            Voltar para Esportes
          </Link>
        </div>
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded">
          {error || 'Esporte não encontrado'}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/sports" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaArrowLeft />
          Voltar para Esportes
        </Link>
        
        <div className="flex gap-2">
          <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300">
            <FaHome />
            Home
          </Link>
        </div>
      </div>      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sport Information and Events */}
        <div className="lg:col-span-2">
          {/* Tab Navigation */}
          <div className="flex mb-4 bg-gray-900 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('info')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'info'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Informações
            </button>
            <button
              onClick={() => setActiveTab('eventos')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'eventos'
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Eventos
            </button>          </div>

          {/* Tab Content */}
          {activeTab === 'info' && (            <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">
              {esporte.fotoUrl && (
                <div className="h-64 bg-gray-800 relative">
                  <Image 
                    src={esporte.fotoUrl} 
                    alt={esporte.nome}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold mb-4">{esporte.nome}</h1>
                    
                    <div className="flex flex-wrap gap-4 text-gray-400 mb-4">
                      <div className="flex items-center gap-2">
                        <FaCalendar />
                        <span>Criado em {formatDate(esporte.criadoEm)}</span>
                      </div>
                      {esporte.inscricoes && (
                        <div className="flex items-center gap-2">
                          <FaUsers />
                          <span>{esporte.inscricoes.length} inscrito(s)</span>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {isAdmin && (
                    <div className="flex gap-2">                      <Link
                        href={`/sports/${esporte.id}/edit`}
                        className="text-blue-400 hover:text-blue-300 p-2"
                      >
                        <FaEdit />
                      </Link>
                      <button
                        onClick={handleDelete}
                        disabled={actionLoading}
                        className="text-red-400 hover:text-red-300 p-2 disabled:opacity-50"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>                <div className="prose prose-invert max-w-none mb-6">
                  <p className="text-gray-300 text-lg leading-relaxed">
                    {/* Descrição não está mais disponível na nova API */}
                    Esporte {esporte.nome} disponível para inscrições.
                  </p>
                </div>

                {esporte.inscricoes && esporte.inscricoes.length > 0 && (
                  <div className="border-t border-gray-800 pt-6">
                    <h3 className="text-lg font-semibold mb-4">Participantes Inscritos</h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                      {esporte.inscricoes.map((inscricao, index) => (
                        <div key={index} className="bg-gray-800 px-3 py-2 rounded text-sm">
                          {inscricao.usuario?.nome || 'Usuário'}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Events Tab */}
          {activeTab === 'eventos' && (
            <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Eventos do {esporte.nome}</h2>
                {isAdmin && (                  <Link
                    href={`/events/create?esporteId=${esporte.id}`}
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm"
                  >
                    Criar Evento
                  </Link>
                )}
              </div>

              {eventosLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
                  <p className="text-gray-400 mt-2">Carregando eventos...</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* TODO: Implement eventos listing here when useEventos hook is updated */}
                  <div className="text-center py-8 text-gray-400">
                    <FaCalendar className="mx-auto text-4xl mb-4" />
                    <p>Nenhum evento encontrado para este esporte.</p>
                    <p className="text-sm mt-2">Os eventos específicos deste esporte aparecerão aqui.</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Chat Section */}
        <div className="lg:col-span-1">
          <div className="bg-gray-900 rounded-lg border border-gray-800 h-[600px] flex flex-col">
            <div className="p-4 border-b border-gray-800 flex items-center justify-between">
              <h3 className="font-semibold flex items-center gap-2">
                <FaComments />
                Chat do {esporte.nome}
              </h3>
              <button
                onClick={() => setShowChat(!showChat)}
                className="lg:hidden text-gray-400 hover:text-white"
              >
                {showChat ? 'Ocultar' : 'Mostrar'}
              </button>
            </div>            <div className={`flex-1 flex flex-col ${showChat || 'hidden lg:flex'}`}>
              {!podeVerMensagens ? (
                <div className="flex-1 flex items-center justify-center p-4">
                  <div className="text-center text-gray-400">
                    <FaComments className="mx-auto text-4xl mb-4 opacity-50" />
                    <p className="mb-2">Chat restrito</p>
                    <p className="text-sm">
                      {isAdmin ? 'Carregando...' : 'Você precisa estar inscrito e aprovado para ver as mensagens.'}
                    </p>
                  </div>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {mensagensLoading ? (
                      <div className="text-center text-gray-400">Carregando mensagens...</div>
                    ) : mensagens.length === 0 ? (
                      <div className="text-center text-gray-400">Nenhuma mensagem ainda. Seja o primeiro a comentar!</div>                    ) : (                      mensagens.map((mensagem) => {
                        const mensagemId = mensagem.id;
                        if (!mensagemId) return null;
                        
                        return (
                        <div key={mensagemId} className="bg-gray-800 p-3 rounded-lg">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-2">
                              <span className="font-medium text-sm text-red-400">                              {mensagem.remetente.nome}
                              </span>
                            </div>
                            <div className="flex items-center gap-1">
                              <span className="text-xs text-gray-500">
                                {formatDate(mensagem.criadaEm)}
                              </span>
                              {(isAdmin || mensagem.remetente.nome === user?.nome) && (
                                <div className="flex gap-1 ml-2">
                                  <button
                                    onClick={() => excluirMensagem(mensagemId)}
                                    className="text-red-500 hover:text-red-400 text-xs"
                                    title="Excluir"
                                  >
                                    <FaTrash />
                                  </button></div>
                              )}                            </div>
                          </div>
                          <p className="text-sm text-gray-300">{mensagem.texto}</p>
                        </div>
                      );})
                    )}
                  </div>

                  {/* Message Input */}
                  {user && (
                    <div className="p-4 border-t border-gray-800">
                      <form onSubmit={handleSendMessage} className="flex gap-2">
                        <input
                          type="text"
                          value={newMessage}
                          onChange={(e) => setNewMessage(e.target.value)}
                          placeholder="Digite sua mensagem..."
                          className="flex-1 px-3 py-2 bg-gray-800 border border-gray-700 rounded text-sm"
                        />
                        <button
                          type="submit"
                          disabled={!newMessage.trim()}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded disabled:opacity-50"
                        >
                          <FaPaperPlane />
                        </button>
                      </form>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
