'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { FaPlus, FaEdit, FaTrash, FaUsers, FaArrowLeft, FaImage } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useEsportes } from '@/hooks/useEsportes';
import { type Esporte } from '@/services/api';

export default function AdminEsportesPage() {
  const { user } = useAuth();
  const { 
    esportes, 
    isLoading, 
    error, 
    criarEsporte, 
    atualizarEsporte, 
    excluirEsporte 
  } = useEsportes();
  
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingEsporte, setEditingEsporte] = useState<Esporte | null>(null);  const [formData, setFormData] = useState({
    nome: '',
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
        nome: formData.nome,
        foto: formData.foto || undefined
      };if (editingEsporte) {
        const esporteId = editingEsporte.id;
        if (!esporteId) {
          throw new Error('ID do esporte não encontrado');
        }
        await atualizarEsporte(esporteId, submitData);
        setEditingEsporte(null);
      } else {
        await criarEsporte(submitData);
        setShowCreateForm(false);
      }
      resetForm();
    } catch (error) {
      console.error('Erro ao salvar esporte:', error);
    }
  };
  const resetForm = () => {
    setFormData({
      nome: '',
      foto: null
    });
  };
  const handleEdit = (esporte: Esporte) => {
    setEditingEsporte(esporte);
    setFormData({
      nome: esporte.nome,
      foto: null
    });
    setShowCreateForm(true);
  };  const handleDelete = async (id: string | number) => {
    if (confirm('Tem certeza que deseja excluir este esporte? Esta ação não pode ser desfeita.')) {
      try {
        await excluirEsporte(String(id));
      } catch (error) {
        console.error('Erro ao excluir esporte:', error);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData({ ...formData, foto: file });
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-center items-center min-h-64">
          <div className="text-gray-400">Carregando esportes...</div>
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
          <h1 className="text-3xl font-bold">Gerenciar Esportes</h1>
          <p className="text-gray-400">Administre os esportes disponíveis na plataforma</p>
        </div>
        
        <button
          onClick={() => setShowCreateForm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2"
        >
          <FaPlus />
          Novo Esporte
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
            {editingEsporte ? 'Editar Esporte' : 'Criar Novo Esporte'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">            <div>
              <label className="block text-sm font-medium mb-2">Nome do Esporte</label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full p-2 bg-gray-800 border border-gray-700 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">
                <FaImage className="inline mr-2" />
                Foto do Esporte (opcional)
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
                {editingEsporte ? 'Atualizar' : 'Criar'} Esporte
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowCreateForm(false);
                  setEditingEsporte(null);
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

      {/* Sports List */}
      {esportes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 text-lg">Nenhum esporte cadastrado ainda.</p>
          <button
            onClick={() => setShowCreateForm(true)}
            className="mt-4 text-red-500 hover:text-red-400"
          >
            Criar o primeiro esporte
          </button>
        </div>
      ) : (        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {esportes.map((esporte) => {
            const esporteId = esporte.id;
            if (!esporteId) return null;
            
            return (
            <div
              key={esporteId}
              className="bg-gray-900 rounded-lg border border-gray-800 hover:border-red-500 transition overflow-hidden"
            >
              {/* Sport Image */}              {esporte.fotoUrl && (                <div className="h-48 bg-gray-700">
                  <Image 
                    src={esporte.fotoUrl} 
                    alt={esporte.nome}
                    width={400}
                    height={192}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold mb-2">{esporte.nome}</h3>
                    
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <FaUsers />
                      <span>{esporte.inscricoes?.length || 0} inscrito(s)</span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(esporte)}
                      className="text-blue-400 hover:text-blue-300 p-2"
                      title="Editar"
                    >
                      <FaEdit />
                    </button>                    <button
                      onClick={() => handleDelete(esporteId)}
                      className="text-red-400 hover:text-red-300 p-2"
                      title="Excluir"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-800">
                  <Link
                    href={`/sports/${esporteId}`}
                    className="text-red-400 hover:text-red-300 text-sm"
                  >
                    Ver detalhes
                  </Link>
                  
                  <span className="text-xs text-gray-500">
                    Criado em {new Date(esporte.criadoEm).toLocaleDateString('pt-BR')}
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
