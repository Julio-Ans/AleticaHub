'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaArrowLeft, FaCalendar, FaMapMarkerAlt, FaImage } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useEventos } from '@/hooks/useEventos';
import { useEsportes } from '@/hooks/useEsportes';
import { type Evento } from '@/services/api';

export default function AdminEventosPage() {
  const { user } = useAuth();
  const { esportes } = useEsportes();
  const { 
    eventos, 
    isLoading, 
    error, 
    criarEvento, 
    atualizarEvento, 
    excluirEvento 
  } = useEventos();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEvento, setEditingEvento] = useState<Evento | null>(null);  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    dataEvento: '',
    local: '',
    tipo: 'geral' as 'geral' | 'treino',
    esporteId: '',
    foto: null as File | null
  });

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded">
          Acesso negado. Você precisa ser um administrador para acessar esta página.
        </div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {      const submitData = {
        titulo: formData.titulo,
        descricao: formData.descricao,
        tipo: formData.tipo,
        esporteId: formData.tipo === 'treino' ? formData.esporteId || "" : "0",
        data: formData.dataEvento,
        local: formData.local,
        foto: formData.foto || undefined
      };      if (editingEvento) {
        const eventoId = editingEvento._id;
        if (!eventoId) {
          throw new Error('ID do evento não encontrado');
        }
        await atualizarEvento(eventoId, submitData);
        setEditingEvento(null);
      } else {
        await criarEvento(submitData);
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
      esporteId: '',
      foto: null
    });
  };  const handleEdit = (evento: Evento) => {
    setEditingEvento(evento);
    setFormData({
      titulo: evento.titulo,
      descricao: evento.descricao,
      dataEvento: evento.data.split('T')[0] + 'T' + evento.data.split('T')[1]?.substring(0, 5) || '',
      local: evento.local,
      tipo: evento.tipo === 'treino' ? 'treino' : 'geral',
      esporteId: evento.esporteId || '',
      foto: null
    });
    setShowCreateForm(true);
  };

  const handleDelete = async (id: string | number) => {
    if (confirm('Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita.')) {
      try {
        await excluirEvento(id);
      } catch (error) {
        console.error('Erro ao excluir evento:', error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, foto: file });
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

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-gray-400">Carregando eventos...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link href="/admin-dashboard" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 mb-4">
            <FaArrowLeft />
            Voltar para Dashboard
          </Link>
          <h1 className="text-3xl font-bold">Gerenciar Eventos</h1>
          <p className="text-gray-400">Administre os eventos da atlética</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Novo Evento
        </button>
      </div>

      {error && (
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {/* Create/Edit Form */}
      {showCreateForm && (
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800 mb-6">
          <h3 className="text-lg font-bold mb-4">
            {editingEvento ? 'Editar Evento' : 'Criar Novo Evento'}
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
                />              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Tipo do Evento</label>
                <select
                  value={formData.tipo}
                  onChange={(e) => setFormData({ ...formData, tipo: e.target.value as 'geral' | 'treino' })}
                  className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                  required
                >
                  <option value="geral">Evento Geral</option>
                  <option value="treino">Treino</option>
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
                    <option value="">Selecione um esporte</option>                    {esportes.map((esporte) => (
                      <option key={esporte.id} value={esporte.id}>
                        {esporte.nome}
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">
                <FaImage className="inline mr-2" />
                Foto do Evento (opcional)
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:bg-red-600 file:text-white hover:file:bg-red-700"
              />
              {formData.foto && (
                <p className="text-sm text-gray-400 mt-1">
                  Arquivo selecionado: {formData.foto.name}
                </p>
              )}
            </div>
            <div className="flex gap-2">
              <button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded"
              >
                {editingEvento ? 'Atualizar' : 'Criar'} Evento
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingEvento(null);
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

      {/* Events List */}
      {eventos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhum evento criado ainda.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 text-red-500 hover:text-red-400"
          >
            Criar o primeiro evento
          </button>
        </div>
      ) : (        <div className="space-y-4">
          {eventos.map((evento) => {
            const eventoId = evento._id;
            if (!eventoId) return null;
            
            return (
            <div
              key={eventoId}
              className="bg-gray-900 rounded-lg border border-gray-800 hover:border-red-500 transition overflow-hidden"
            >              {/* Event Image */}
              {evento.fotoUrl && (
                <div className="h-48 bg-gray-700">
                  <Image 
                    src={evento.fotoUrl} 
                    alt={evento.titulo}
                    width={800}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{evento.titulo}</h3>
                    <p className="text-gray-400 mb-3 line-clamp-3">{evento.descricao}</p>
                    
                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">                      <div className="flex items-center gap-2">
                        <FaCalendar />
                        <span>{formatDate(evento.data)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaMapMarkerAlt />
                        <span>{evento.local}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FaUsers />
                        <span>{evento.inscricoes?.length || 0} inscrito(s)</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(evento)}
                      className="text-blue-400 hover:text-blue-300 p-2"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>                    <button
                      onClick={() => handleDelete(eventoId)}
                      className="text-red-400 hover:text-red-300 p-2"
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <Link
                    href={`/events/${eventoId}`}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Ver detalhes                  </Link>
                  
                  <span className="text-xs text-gray-500">
                    Criado em {new Date(evento.criadoEm).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
            </div>
          );})}
        </div>
      )}
    </div>
  );
}
