'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaHome, FaPlus, FaCalendar, FaMapMarkerAlt, FaUsers, FaEdit, FaTrash } from 'react-icons/fa';
import { useEventos } from '@/hooks/useEventos';
import { useEsportes } from '@/hooks/useEsportes';
import { useAuth } from '@/context/AuthContext';
import { Evento } from '@/services/api';

export default function EventsPage() {
  const { user } = useAuth();
  const { esportes } = useEsportes();
  const { 
    eventos, 
    isLoading: loading, 
    error, 
    criarEvento, 
    atualizarEvento, 
    excluirEvento,
    inscreverEvento,
    cancelarInscricaoEvento,
    estaInscrito
  } = useEventos();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Evento | null>(null);
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataEvento: '',
    local: '',
    tipo: 'geral' as 'geral' | 'treino',
    esporteId: ''
  });

  const isAdmin = user?.role === 'admin';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const eventData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        data: formData.dataEvento,
        local: formData.local,
        tipo: formData.tipo,
        esporteId: formData.tipo === 'geral' ? '0' : formData.esporteId
      };

      if (editingEvent) {
        await atualizarEvento(editingEvent._id, eventData);
        setEditingEvent(null);
      } else {
        await criarEvento(eventData);
        setShowCreateForm(false);
      }
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar evento:', error);
    }
  };

  const resetForm = () => {
    setFormData({
      titulo: '',
      descricao: '',
      dataEvento: '',
      local: '',
      tipo: 'geral',
      esporteId: ''
    });
  };

  const handleEdit = (evento: Evento) => {
    setEditingEvent(evento);
    setFormData({
      titulo: evento.titulo,
      descricao: evento.descricao,
      dataEvento: evento.data.split('T')[0] + (evento.data.includes('T') ? 'T' + evento.data.split('T')[1]?.substring(0, 5) : ''),
      local: evento.local,
      tipo: evento.tipo === 'treino' ? 'treino' : 'geral',
      esporteId: evento.esporteId || ''
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Tem certeza que deseja excluir este evento?')) {
      try {
        await excluirEvento(id);
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
      }
    }
  };

  const handleInscricao = async (eventoId: string | number, isInscrito: boolean) => {
    try {
      if (isInscrito) {
        await cancelarInscricaoEvento(eventoId);
      } else {
        await inscreverEvento(eventoId);
      }
    } catch (error) {
      console.error('Erro ao gerenciar inscrição:', error);
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

  const getEventTypeLabel = (tipo: string) => {
    return tipo === 'treino' ? 'Treino' : 'Geral';
  };

  const getSportName = (esporteId?: string) => {
    if (!esporteId) return '';
    const esporte = esportes.find(e => e.id === esporteId);
    return esporte ? esporte.nome : '';
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-gray-400">Carregando eventos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
        
        {isAdmin && (
          <button
            onClick={() => setShowCreateForm(true)}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
          >
            <FaPlus />
            Novo Evento
          </button>
        )}
      </div>

      <h1 className="text-2xl font-bold mb-6">Eventos</h1>

      {error && (
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
          <h3 className="text-lg font-bold mb-4">
            {editingEvent ? 'Editar Evento' : 'Criar Novo Evento'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Título do Evento</label>
              <input
                type="text"
                value={formData.titulo}
                onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded h-24"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Data e Hora</label>
                <input
                  type="datetime-local"
                  value={formData.dataEvento}
                  onChange={(e) => setFormData({ ...formData, dataEvento: e.target.value })}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Local</label>
                <input
                  type="text"
                  value={formData.local}
                  onChange={(e) => setFormData({ ...formData, local: e.target.value })}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                  required
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo de Evento</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ 
                    ...formData, 
                    tipo: e.target.value as 'geral' | 'treino',
                    esporteId: e.target.value === 'geral' ? '' : formData.esporteId
                  })}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                  required
                >
                  <option value="geral">Evento Geral</option>
                  <option value="treino">Treino de Esporte</option>
                </select>
              </div>
              
              {formData.tipo === 'treino' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Esporte</label>
                  <select
                    value={formData.esporteId}
                    onChange={(e) => setFormData({ ...formData, esporteId: e.target.value })}
                    className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                    required
                  >
                    <option value="">Selecione um esporte</option>
                    {esportes.map((esporte) => (
                      <option key={esporte.id} value={esporte.id}>
                        {esporte.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                {editingEvent ? 'Atualizar' : 'Criar'} Evento
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingEvent(null);
                  resetForm();
                }}
                className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {eventos.length === 0 ? (
        <p className="text-gray-400">Nenhum evento disponível no momento.</p>
      ) : (
        <div className="space-y-4">
          {eventos.map((evento) => {
            const eventoId = evento._id;
            const isInscrito = estaInscrito(eventoId);
            
            return (
              <div
                key={eventoId}
                className="bg-gray-900 p-6 rounded-lg shadow border border-gray-800 hover:border-red-500 transition"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h2 className="text-xl font-bold">{evento.titulo}</h2>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        evento.tipo === 'treino' 
                          ? 'bg-blue-900 text-blue-200' 
                          : 'bg-green-900 text-green-200'
                      }`}>
                        {getEventTypeLabel(evento.tipo || 'geral')}
                      </span>
                      {evento.esporteId && (
                        <span className="px-2 py-1 text-xs rounded-full bg-purple-900 text-purple-200">
                          {getSportName(evento.esporteId)}
                        </span>
                      )}
                    </div>
                    
                    <p className="text-gray-300 mb-3">{evento.descricao}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-400">
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
                  
                  {isAdmin && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(evento)}
                        className="text-blue-400 hover:text-blue-300 p-2"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(eventoId)}
                        className="text-red-400 hover:text-red-300 p-2"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  )}
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <Link
                    href={`/events/${eventoId}`}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Ver detalhes
                  </Link>
                  
                  {user && !isAdmin && (
                    <button
                      onClick={() => handleInscricao(eventoId, isInscrito)}
                      className={`px-4 py-2 rounded text-sm font-medium ${
                        isInscrito
                          ? 'bg-gray-600 hover:bg-gray-700 text-white'
                          : 'bg-red-600 hover:bg-red-700 text-white'
                      }`}
                    >
                      {isInscrito ? 'Cancelar Inscrição' : 'Inscrever-se'}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}