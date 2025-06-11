'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaShoppingCart, FaImage } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

type Produto = {
  id: string;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagemUrl?: string;
  categoria?: string;
};

type ItemCarrinho = {
  id: string;
  produto: Produto;
  quantidade: number;
};

export default function ShopPage() {
  const { user } = useAuth();
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carrinho, setCarrinho] = useState<ItemCarrinho[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [busca, setBusca] = useState('');
  const [categoria, setCategoria] = useState('');
  const [categorias, setCategorias] = useState<string[]>([]);

  const carregarProdutos = useCallback(async () => {
    try {
      const res = await fetch('/api/produtos');
      if (res.ok) {
        const data = await res.json();
        setProdutos(data);
        
        // Extrair categorias únicas
        const cats = [...new Set(data.map((p: Produto) => p.categoria).filter(Boolean))] as string[];
        setCategorias(cats);
      }
    } catch (error) {
      console.error('Erro ao carregar produtos:', error);
      setError('Erro ao carregar produtos');
    }
  }, []);

  const carregarCarrinho = useCallback(async () => {
    if (!user) return;
    
    try {
      const res = await fetch('/api/cart');
      if (res.ok) {
        const data = await res.json();
        setCarrinho(data);
      }
    } catch (error) {
      console.error('Erro ao carregar carrinho:', error);
    }
  }, [user]);

  useEffect(() => {
    const carregarDados = async () => {
      setLoading(true);
      await Promise.all([
        carregarProdutos(),
        carregarCarrinho(),
      ]);
      setLoading(false);
    };

    carregarDados();
  }, [carregarProdutos, carregarCarrinho]);

  const adicionarAoCarrinho = async (produtoId: string, quantidade: number = 1) => {
    if (!user) {
      alert('Você precisa fazer login para adicionar produtos ao carrinho');
      return;
    }

    try {
      const res = await fetch('/api/cart', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ produtoId, quantidade }),
      });

      if (res.ok) {
        await carregarCarrinho();
        alert('Produto adicionado ao carrinho!');
      }
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      alert('Erro ao adicionar produto ao carrinho');
    }
  };

  const filtrarProdutos = () => {
    const buscarTexto = busca.toLowerCase();
    return produtos.filter(produto => {
      const matchBusca = !busca || 
        produto.nome.toLowerCase().includes(buscarTexto) ||
        produto.descricao.toLowerCase().includes(buscarTexto);
      const matchCategoria = !categoria || produto.categoria === categoria;
      return matchBusca && matchCategoria;
    });
  };

  const produtosFiltrados = filtrarProdutos();
  const totalItens = carrinho.reduce((sum, item) => sum + item.quantidade, 0);

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto"></div>
          <p className="text-gray-400 mt-2">Carregando loja...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaHome />
            Voltar para Home
          </Link>
        </div>
        
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <h3 className="text-red-400 font-semibold mb-2">Erro ao carregar loja</h3>
          <p className="text-red-300">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
        
        {user && (
          <Link 
            href="/cart" 
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg"
          >
            <FaShoppingCart />
            Carrinho ({totalItens})
          </Link>
        )}
      </div>

      <h1 className="text-3xl font-bold mb-6 text-red-500">Loja AtléticaHub</h1>

      {/* Filtros */}
      <div className="bg-gray-900 rounded-lg border border-gray-800 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="flex-1 min-w-64 p-2 bg-gray-800 border border-gray-700 rounded text-white"
          />
          <select
            value={categoria}
            onChange={(e) => setCategoria(e.target.value)}
            className="p-2 bg-gray-800 border border-gray-700 rounded text-white"
          >
            <option value="">Todas as categorias</option>
            {categorias.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Produtos */}
      {produtosFiltrados.length === 0 ? (
        <div className="text-center py-12">
          <FaImage className="mx-auto text-6xl text-gray-600 mb-4" />
          <p className="text-gray-400 text-lg">Nenhum produto encontrado.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {produtosFiltrados.map((produto) => (
            <div
              key={produto.id}
              className="bg-gray-900 rounded-lg border border-gray-800 hover:border-red-500 transition-colors overflow-hidden"
            >
              {/* Imagem */}
              <div className="h-48 bg-gray-800 flex items-center justify-center relative overflow-hidden">
                {produto.imagemUrl ? (
                  <Image 
                    src={produto.imagemUrl} 
                    alt={produto.nome}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : (
                  <FaImage className="text-4xl text-gray-600" />
                )}
              </div>

              {/* Conteúdo */}
              <div className="p-4">
                {produto.categoria && (
                  <span className="bg-red-800 text-red-100 px-2 py-1 rounded text-xs mb-2 inline-block">
                    {produto.categoria}
                  </span>
                )}
                
                <h3 className="font-bold text-lg mb-2 text-white">{produto.nome}</h3>
                <p className="text-gray-300 text-sm mb-3 line-clamp-2">{produto.descricao}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-red-400">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400">
                    Estoque: {produto.estoque}
                  </span>
                </div>

                {produto.estoque > 0 ? (
                  <button
                    onClick={() => adicionarAoCarrinho(produto.id)}
                    className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded font-semibold"
                    disabled={!user}
                  >
                    {!user ? 'Login para Comprar' : 'Adicionar ao Carrinho'}
                  </button>
                ) : (
                  <button
                    disabled
                    className="w-full bg-gray-600 text-gray-400 py-2 px-4 rounded font-semibold cursor-not-allowed"
                  >
                    Esgotado
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {!user && (
        <div className="mt-8 bg-blue-900/20 border border-blue-500 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-blue-400 font-semibold">ℹ️ Informação</span>
          </div>
          <p className="text-blue-300 text-sm">
            Para realizar compras, é necessário{' '}
            <Link href="/login" className="text-blue-200 underline hover:text-blue-100">
              fazer login
            </Link> ou{' '}
            <Link href="/register" className="text-blue-200 underline hover:text-blue-100">
              criar uma conta
            </Link>.
          </p>
        </div>
      )}
    </div>
  );
}
