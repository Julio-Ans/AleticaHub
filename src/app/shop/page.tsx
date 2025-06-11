'use client';

import { useState, useEffect } from 'react';
import { FaHome, FaSearch, FaShoppingCart, FaSpinner, FaPlus, FaMinus, FaTag, FaFilter } from 'react-icons/fa';
import Link from 'next/link';
import Image from 'next/image';
import { useAuth } from '@/context/AuthContext';
import { useProdutos } from '@/hooks/useProdutos';
import { useCarrinho } from '@/hooks/useCarrinho';
import { useToast } from '@/hooks/useToast';
import { ToastContainer } from '@/components/Toast';
import { Produto } from '@/services/api/produtosApi';

export default function ShopPage() {
  const { user } = useAuth();
  const { produtos, isLoading: produtosLoading, error } = useProdutos();
  const { adicionarItem } = useCarrinho();
  const { toasts, removeToast, success, error: showError } = useToast();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [filteredProdutos, setFilteredProdutos] = useState<Produto[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});

  // Categorias disponíveis
  const categorias = ['all', 'equipamentos', 'roupas', 'acessorios', 'nutricao'];
  
  const getCategoriaLabel = (categoria: string) => {
    const labels: Record<string, string> = {
      'all': 'Todas',
      'equipamentos': 'Equipamentos',
      'roupas': 'Roupas',
      'acessorios': 'Acessórios',
      'nutricao': 'Nutrição'
    };
    return labels[categoria] || categoria;
  };

  useEffect(() => {
    if (!produtos) return;
    
    let filtered = produtos;
    
    // Filtrar por categoria
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(produto => 
        produto.categoria && produto.categoria.toLowerCase() === selectedCategory.toLowerCase()
      );
    }
    
    // Filtrar por termo de busca
    if (searchTerm) {
      filtered = filtered.filter(produto =>
        produto.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        produto.descricao.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredProdutos(filtered);
  }, [produtos, searchTerm, selectedCategory]);

  const handleQuantityChange = (produtoId: string, change: number) => {
    setQuantities(prev => {
      const currentQuantity = prev[produtoId] || 1;
      const newQuantity = Math.max(1, currentQuantity + change);
      return { ...prev, [produtoId]: newQuantity };
    });
  };  const handleAddToCart = async (produto: Produto) => {
    const quantity = quantities[produto.id.toString()] || 1;
    
    try {
      // Usar o hook useCarrinho para adicionar item com feedback
      await adicionarItem({
        produtoId: typeof produto.id === 'string' ? parseInt(produto.id) : produto.id,
        quantidade: quantity
      });
      
      // Mostrar toast de sucesso
      success(`${produto.nome} adicionado ao carrinho! (${quantity}x)`);
      
      // Reset quantity after adding to cart
      setQuantities(prev => ({ ...prev, [produto.id.toString()]: 1 }));
    } catch (error) {
      // Mostrar toast de erro
      showError(error instanceof Error ? error.message : 'Erro ao adicionar ao carrinho');
    }
  };

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaHome />
            Voltar para Home
          </Link>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
          <p className="text-yellow-500">Você precisa fazer login para acessar a loja.</p>
          <Link href="/login" className="text-yellow-400 hover:text-yellow-300 underline">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaHome />
            Voltar para Home
          </Link>
        </div>

        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-500">Erro ao carregar produtos: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaShoppingCart className="text-red-500" />
          Loja AtleticaHub
        </h1>
        <Link
          href="/cart"
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
        >
          <FaShoppingCart />
          Ver Carrinho
        </Link>
      </div>

      {/* Filtros */}
      <div className="bg-gray-900 p-4 rounded-lg border border-gray-800 mb-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Busca */}
          <div className="flex-1">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar produtos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          {/* Filtro de categoria */}
          <div className="lg:w-64">
            <div className="relative">
              <FaFilter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                {categorias.map(categoria => (
                  <option key={categoria} value={categoria}>
                    {getCategoriaLabel(categoria)}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>

      {produtosLoading ? (
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
          <FaSpinner className="animate-spin text-3xl text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando produtos...</p>
        </div>
      ) : filteredProdutos.length === 0 ? (
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
          <FaShoppingCart className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhum produto encontrado</h3>
          <p className="text-gray-400">
            {searchTerm || selectedCategory !== 'all' 
              ? 'Tente alterar os filtros de busca.' 
              : 'Não há produtos disponíveis no momento.'
            }
          </p>
        </div>
      ) : (        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProdutos.map((produto) => (
            <div key={produto.id} className="bg-gray-900 border border-gray-800 rounded-lg overflow-hidden hover:border-red-500 transition-all duration-200">
              {/* Imagem do produto */}
              <div className="h-48 bg-gray-800 flex items-center justify-center">
                {(produto.imagemUrl || produto.fotoUrl) ? (
                  <Image 
                    src={produto.imagemUrl || produto.fotoUrl || ''} 
                    alt={produto.nome}
                    width={300}
                    height={200}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <FaTag className="text-4xl text-gray-600" />
                )}
              </div>

              <div className="p-4">
                <div className="mb-2">
                  <h3 className="text-lg font-semibold text-white mb-1">{produto.nome}</h3>
                  {produto.categoria && (
                    <span className="text-xs bg-red-600 text-white px-2 py-1 rounded">
                      {getCategoriaLabel(produto.categoria)}
                    </span>
                  )}
                </div>
                
                <p className="text-gray-400 text-sm mb-3 line-clamp-2">{produto.descricao}</p>
                
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-red-500">
                    R$ {produto.preco.toFixed(2)}
                  </span>
                  <span className="text-sm text-gray-400">
                    Estoque: {produto.estoque}
                  </span>
                </div>

                {produto.estoque > 0 ? (
                  <div className="space-y-3">
                    {/* Controle de quantidade */}
                    <div className="flex items-center justify-center gap-3">
                      <button
                        onClick={() => handleQuantityChange(produto.id.toString(), -1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="text-white font-semibold w-8 text-center">
                        {quantities[produto.id.toString()] || 1}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(produto.id.toString(), 1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    {/* Botão adicionar ao carrinho */}
                    <button
                      onClick={() => handleAddToCart(produto)}
                      className="w-full bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg flex items-center justify-center gap-2 transition-colors"
                    >
                      <FaShoppingCart />
                      Adicionar ao Carrinho
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <span className="text-red-400 font-semibold">Produto Esgotado</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}      {/* Informação sobre o carrinho */}
      <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 mt-6">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-blue-400 font-semibold">💡 Dica</span>
        </div>
        <p className="text-blue-300 text-sm">
          Adicione produtos ao carrinho e finalize sua compra. O carrinho fica salvo enquanto você navega pela loja.
        </p>
      </div>

      {/* Toast Container */}
      <ToastContainer toasts={toasts} onRemoveToast={removeToast} />
    </div>
  );
}