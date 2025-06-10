'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaCalendar, FaMapMarkerAlt, FaUsers, FaArrowLeft, FaEdit, FaTrash } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { eventosService, type Evento } from '@/services/api';

export default function EventDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { user } = useAuth();
  const [evento, setEvento] = useState<Evento | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const isAdmin = user?.role === 'admin';  const eventoId = typeof params.id === 'string' ? params.id : null;

  const loadEvento = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await eventosService.buscarEvento(eventoId!);
      setEvento(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar evento');
    } finally {
      setLoading(false);
    }
  }, [eventoId]);

  useEffect(() => {
    if (eventoId) {
      loadEvento();
    }
  }, [eventoId, loadEvento]);

  const handleInscricao = async () => {
    if (!eventoId || actionLoading) return;
    
    try {
      setActionLoading(true);
      await eventosService.inscreverEvento(eventoId);
      await loadEvento(); // Recarregar para atualizar dados
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao se inscrever no evento');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancelarInscricao = async () => {
    if (!eventoId || actionLoading) return;
    
    try {
      setActionLoading(true);
      await eventosService.cancelarInscricao(eventoId);
      await loadEvento(); // Recarregar para atualizar dados
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cancelar inscrição');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!eventoId || !confirm('Tem certeza que deseja excluir este evento?')) return;
    
    try {
      setActionLoading(true);
      await eventosService.excluirEvento(eventoId);
      router.push('/events');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir evento');
      setActionLoading(false);
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
          <div className="text-gray-400">Carregando evento...</div>
        </div>
      </div>
    );
  }

  if (error || !evento) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Link href="/events" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaArrowLeft />
            Voltar para Eventos
          </Link>
        </div>
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded">
          {error || 'Evento não encontrado'}
        </div>
      </div>
    );
  }  const isUserInscrito = evento.inscricoes?.some(inscricao => 
    inscricao.nome && user && inscricao.nome === user.nome
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/events" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaArrowLeft />
          Voltar para Eventos
        </Link>
        
        <div className="flex gap-2">
          <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300">
            <FaHome />
            Home
          </Link>
        </div>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      <div className="bg-gray-900 rounded-lg border border-gray-800 overflow-hidden">        {evento.fotoUrl && (
          <div className="h-64 bg-gray-800 relative">
            <Image 
              src={evento.fotoUrl} 
              alt={evento.titulo}
              fill
              className="object-cover"
            />
          </div>
        )}
        
        <div className="p-8">
          <div className="flex justify-between items-start mb-6">
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-4">{evento.titulo}</h1>
              
              <div className="flex flex-wrap gap-6 text-gray-400 mb-6">
                <div className="flex items-center gap-2">
                  <FaCalendar />
                  <span>{formatDate(evento.data)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaMapMarkerAlt />
                  <span>{evento.local}</span>
                </div>
                <div className="flex items-center gap-2">
                  <FaUsers />
                  <span>{evento.inscricoes?.length || 0} participante(s)</span>
                </div>
              </div>
            </div>
            
            {isAdmin && (
              <div className="flex gap-2">                <Link
                  href={`/events/${evento._id}/edit`}
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
          </div>

          <div className="prose prose-invert max-w-none mb-8">
            <p className="text-gray-300 text-lg leading-relaxed">{evento.descricao}</p>
          </div>

          {evento.inscricoes && evento.inscricoes.length > 0 && (
            <div className="border-t border-gray-800 pt-6 mb-6">
              <h3 className="text-lg font-semibold mb-4">Participantes Inscritos</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                {evento.inscricoes.map((inscricao, index) => (
                  <div key={index} className="bg-gray-800 px-3 py-2 rounded text-sm">
                    {inscricao.nome || 'Usuário'}
                  </div>
                ))}
              </div>
            </div>
          )}

          {user && !isAdmin && (
            <div className="border-t border-gray-800 pt-6">
              {isUserInscrito ? (
                <button
                  onClick={handleCancelarInscricao}
                  disabled={actionLoading}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                >
                  {actionLoading ? 'Cancelando...' : 'Cancelar Inscrição'}
                </button>
              ) : (
                <button
                  onClick={handleInscricao}
                  disabled={actionLoading}
                  className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg font-medium disabled:opacity-50"
                >
                  {actionLoading ? 'Inscrevendo...' : 'Inscrever-se no Evento'}
                </button>
              )}
            </div>
          )}

          <div className="border-t border-gray-800 pt-4 mt-6 text-sm text-gray-500">
            Evento criado em {new Date(evento.criadoEm).toLocaleDateString('pt-BR')}
          </div>        </div>
      </div>
    </div>
  );
}
