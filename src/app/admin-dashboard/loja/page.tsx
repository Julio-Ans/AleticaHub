'use client';

import { useEffect, useState } from 'react';

type Produto = {
  id: string;
  nome: string;
  preco: number;
  estoque: number;
};

export default function LojaAdminPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [form, setForm] = useState({ nome: '', preco: '', estoque: '' });
  const [editandoId, setEditandoId] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/produtos')
      .then(res => res.json())
      .then(setProdutos)
      .catch(console.error);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const limparFormulario = () => {
    setForm({ nome: '', preco: '', estoque: '' });
    setEditandoId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const produto = {
      nome: form.nome,
      preco: parseFloat(form.preco),
      estoque: parseInt(form.estoque),
    };

    if (editandoId) {
      // Atualizar produto existente
      const res = await fetch(`/api/produtos/${editandoId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });

      const atualizado = await res.json();
      setProdutos(prev =>
        prev.map(p => (p.id === atualizado.id ? atualizado : p))
      );
    } else {
      // Criar novo produto
      const res = await fetch('/api/produtos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(produto),
      });

      const criado = await res.json();
      setProdutos([...produtos, criado]);
    }

    limparFormulario();
  };

  const iniciarEdicao = (produto: Produto) => {
    setEditandoId(produto.id);
    setForm({
      nome: produto.nome,
      preco: produto.preco.toString(),
      estoque: produto.estoque.toString(),
    });
  };

  const excluirProduto = async (id: string) => {
    await fetch(`/api/produtos/${id}`, { method: 'DELETE' });
    setProdutos(produtos.filter(p => p.id !== id));
  };

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

        <div className="flex gap-4">
          <button type="submit" className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-bold">
            {editandoId ? 'Salvar Alterações' : 'Adicionar Produto'}
          </button>
          {editandoId && (
            <button type="button" onClick={limparFormulario} className="bg-gray-600 hover:bg-gray-500 text-white py-2 px-4 rounded font-bold">
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* Lista de produtos */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-red-500">Produtos Cadastrados</h2>
        {produtos.length === 0 ? (
          <p className="text-gray-400">Nenhum produto cadastrado ainda.</p>
        ) : (
          produtos.map(prod => (
            <div key={prod.id} className="bg-gray-900 p-4 border border-gray-800 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-bold">{prod.nome}</h3>
                <p className="text-gray-400">R$ {prod.preco.toFixed(2)} • Estoque: {prod.estoque}</p>
              </div>
              <div className="flex gap-3">
                <button onClick={() => iniciarEdicao(prod)} className="text-blue-400 hover:text-blue-300">Editar</button>
                <button onClick={() => excluirProduto(prod.id)} className="text-red-500 hover:text-red-400">Excluir</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
