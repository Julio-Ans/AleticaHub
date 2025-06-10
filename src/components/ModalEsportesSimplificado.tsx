// Modal Esportes - Componente para gerenciar esportes no dashboard administrativo

'use client';

import React, { useState, useEffect } from 'react';
import { FaTimes, FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';
import { useEsportes } from '../hooks/useEsportes';
import { type Esporte } from '../services/api';

interface ModalEsportesProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ModalEsportes({ isOpen, onClose }: ModalEsportesProps) {
  const { esportes, isLoading, error, criarEsporte, atualizarEsporte, excluirEsporte } = useEsportes();
  
  const [activeTab, setActiveTab] = useState<'listar' | 'criar'>('listar');
  const [editingEsporte, setEditingEsporte] = useState<Esporte | null>(null);
  const [formData, setFormData] = useState({
    nome: '',
    foto: undefined as File | undefined
  });

  useEffect(() => {
    if (editingEsporte) {
      setFormData({
        nome: editingEsporte.nome,
        foto: undefined
      });
    } else {
      setFormData({
        nome: '',
        foto: undefined
      });
    }
  }, [editingEsporte]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingEsporte) {
        await atualizarEsporte(editingEsporte.id, formData);
      } else {
        await criarEsporte(formData);
      }
      
      // Reset form
      setFormData({ nome: '', foto: undefined });
      setEditingEsporte(null);
      setActiveTab('listar');
    } catch (error) {
      console.error('Erro ao salvar esporte:', error);
    }
  };

  const handleDelete = async (esporteId: string) => {
    if (confirm('Tem certeza que deseja excluir este esporte?')) {
      try {
        await excluirEsporte(esporteId);
      } catch (error) {
        console.error('Erro ao excluir esporte:', error);
      }
    }
  };

  const handleEdit = (esporte: Esporte) => {
    setEditingEsporte(esporte);
    setActiveTab('criar');
  };

  const handleCancelEdit = () => {
    setEditingEsporte(null);
    setFormData({ nome: '', foto: undefined });
    setActiveTab('listar');
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || undefined;
    setFormData(prev => ({ ...prev, foto: file }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">Gerenciar Esportes</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <FaTimes size={24} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab('listar')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'listar'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            Lista de Esportes
          </button>
          <button
            onClick={() => setActiveTab('criar')}
            className={`px-6 py-3 font-medium transition-colors ${
              activeTab === 'criar'
                ? 'text-red-600 border-b-2 border-red-600'
                : 'text-gray-600 hover:text-gray-800'
            }`}
          >
            {editingEsporte ? 'Editar Esporte' : 'Criar Esporte'}
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Lista de Esportes */}
          {activeTab === 'listar' && (
            <div>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
                </div>
              ) : error ? (
                <div className="text-center py-8">
                  <p className="text-red-600">Erro: {error}</p>
                </div>
              ) : esportes.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-600">Nenhum esporte cadastrado</p>
                  <button
                    onClick={() => setActiveTab('criar')}
                    className="mt-4 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <FaPlus className="inline mr-2" />
                    Criar Primeiro Esporte
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {esportes.map((esporte) => (
                    <div key={esporte.id} className="border rounded-lg p-4 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        {esporte.fotoUrl ? (
                          <img
                            src={esporte.fotoUrl}
                            alt={esporte.nome}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                            <FaImage className="text-gray-400" />
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold text-lg">{esporte.nome}</h3>
                          <p className="text-gray-600">
                            Criado em: {new Date(esporte.criadoEm).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => handleEdit(esporte)}
                          className="bg-yellow-600 text-white px-3 py-2 rounded-lg hover:bg-yellow-700 transition-colors"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDelete(esporte.id)}
                          className="bg-red-600 text-white px-3 py-2 rounded-lg hover:bg-red-700 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Criar/Editar Esporte */}
          {activeTab === 'criar' && (
            <div>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nome do Esporte
                  </label>
                  <input
                    type="text"
                    value={formData.nome}
                    onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Ex: Futebol, Basquete, Vôlei..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Foto do Esporte
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                  <p className="text-sm text-gray-500 mt-1">
                    Formatos aceitos: JPG, PNG, GIF (máx. 5MB)
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? 'Salvando...' : editingEsporte ? 'Atualizar' : 'Criar'} Esporte
                  </button>
                  {editingEsporte && (
                    <button
                      type="button"
                      onClick={handleCancelEdit}
                      className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
