'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useProdutos } from '@/hooks/useProdutos';
import { useAuth } from '@/context/AuthContext';



export default function LojaAdminPage() {
  const { user } = useAuth();
  const {
    produtos,
    criarProduto, // Usado para criar novos produtos
    atualizarProduto,
    excluirProduto,
    isLoading,
    error,
    carregarProdutos
  } = useProdutos();

  const [form, setForm] = useState({
    nome: '',
    descricao: '',
    preco: '',
    estoque: '',
    tamanho: '',
    foto: null as File | null,
  });

  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    carregarProdutos();
  }, [carregarProdutos]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;
    if (name === 'foto' && files) {
      setForm({ ...form, foto: files[0] });
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const limparFormulario = () => {
    setForm({ nome: '', descricao: '', preco: '', estoque: '', tamanho: '', foto: null });
    setEditandoId(null);
  };  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editandoId) {
        await atualizarProduto(editandoId, {
          nome: form.nome,
          descricao: form.descricao,
          preco: parseFloat(form.preco),
          estoque: parseInt(form.estoque),
          categoria: 'geral'
        });
      } else {
        await criarProduto({
          nome: form.nome,
          descricao: form.descricao,
          preco: parseFloat(form.preco),
          estoque: parseInt(form.estoque),
          categoria: 'geral',
          foto: form.foto || undefined
        });
      }
      limparFormulario();
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
      alert(`Erro ao salvar produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };
  const iniciarEdicao = (produto: { 
    id: string | number; 
    nome: string; 
    descricao: string; 
    preco: number; 
    estoque: number; 
    tamanho?: string; 
  }) => {
    setEditandoId(produto.id.toString());
    setForm({
      nome: produto.nome,
      descricao: produto.descricao,
      preco: produto.preco.toString(),
      estoque: produto.estoque.toString(),
      tamanho: produto.tamanho || '',
      foto: null
    });
  };  const handleExcluir = async (id: string) => {
    try {
      await excluirProduto(id);
    } catch (error) {
      console.error('Erro ao excluir produto:', error);
      alert(`Erro ao excluir produto: ${error instanceof Error ? error.message : 'Erro desconhecido'}`);
    }
  };

  // Verificar se o usuário é admin
  if (user && user.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-900 border border-red-700 text-red-200 p-4 rounded-lg">
          ❌ Acesso negado. Apenas administradores podem gerenciar a loja.
        </div>
      </div>
    );
  }
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Loja</h1>

      <form onSubmit={handleSubmit} className="bg-gray-900 p-6 border border-gray-800 rounded-lg mb-6 space-y-4">
        <h2 className="text-xl font-bold text-red-500">
          {editandoId ? 'Editar Produto' : 'Novo Produto'}
        </h2>

        <input
          type="text"
          name="nome"
          placeholder="Nome do produto"
          value={form.nome}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />

        <textarea
          name="descricao"
          placeholder="Descrição do produto"
          value={form.descricao}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />

        <input
          type="number"
          name="preco"
          placeholder="Preço (R$)"
          value={form.preco}
          onChange={handleChange}
          required
          step="0.01"
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />

        <input
          type="number"
          name="estoque"
          placeholder="Quantidade de estoque"
          value={form.estoque}
          onChange={handleChange}
          required
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />

        <input
          type="text"
          name="tamanho"
          placeholder="Tamanho (opcional)"
          value={form.tamanho}
          onChange={handleChange}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />

        <input
          type="file"
          name="foto"
          accept="image/*"
          onChange={handleChange}
          required={!editandoId}
          className="w-full p-3 rounded bg-gray-800 border border-gray-700 text-white"
        />        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={isLoading}
            className="bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white py-2 px-4 rounded font-bold"
          >
            {isLoading ? 'Salvando...' : (editandoId ? 'Salvar Alterações' : 'Adicionar Produto')}
          </button>
          {editandoId && (
            <button 
              type="button" 
              onClick={limparFormulario} 
              className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded font-bold"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>      <div className="space-y-4">
        <h2 className="text-xl font-bold text-red-500">Produtos Cadastrados</h2>
        {isLoading && <p className="text-blue-400">Carregando produtos...</p>}
        {error && <p className="text-red-400">Erro: {error}</p>}
        {produtos.length === 0 && !isLoading ? (
          <p className="text-gray-400">Nenhum produto cadastrado ainda.</p>
        ) : (
          produtos.map(prod => (
            <div key={prod.id} className="bg-gray-900 p-4 border border-gray-800 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">{prod.nome}</h3>
                <p className="text-gray-400">R$ {prod.preco.toFixed(2)} • Estoque: {prod.estoque}</p>                {prod.imagemUrl && (
                  <Image 
                    src={prod.imagemUrl} 
                    alt={prod.nome} 
                    width={64}
                    height={64}
                    className="mt-2 h-16 w-16 object-cover rounded" 
                  />
                )}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => iniciarEdicao(prod)} 
                  className="text-red-400 hover:text-red-300"
                  disabled={isLoading}
                >
                  Editar
                </button>
                <button 
                  onClick={() => handleExcluir(prod.id.toString())} 
                  className="text-red-500 hover:text-red-400"
                  disabled={isLoading}
                >
                  Excluir
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
