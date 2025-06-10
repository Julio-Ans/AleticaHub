'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaShoppingCart, FaImage, FaArrowLeft } from 'react-icons/fa';
import { useCart } from '@/context/CartContext';
import { produtosService, type Produto } from '@/services/api';

export default function ProductPage() {
  const params = useParams();
  const [produto, setProduto] = useState<Produto | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const { addToCart } = useCart();

  const productId = Array.isArray(params.ProductId) ? params.ProductId[0] : params.ProductId;

  useEffect(() => {
    const carregarProduto = async () => {
      if (!productId) return;
      
      try {
        setLoading(true);
        setError(null);
        const data = await produtosService.buscarProduto(productId);
        setProduto(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produto');
      } finally {
        setLoading(false);
      }
    };

    carregarProduto();
  }, [productId]);

  if (!productId) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-500">Produto não encontrado</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error || !produto) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/shop" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaArrowLeft />
            Voltar para Loja
          </Link>
        </div>
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4">
          <p className="text-red-500">{error || 'Produto não encontrado'}</p>
        </div>
      </div>
    );
  }  const handleAddToCart = () => {
    if (!selectedSize || !produto) return;
    
    addToCart({
      productId: produto.id.toString(), // Converte para string
      name: produto.nome,
      price: produto.preco,
      size: selectedSize,
      quantity,
    });
  };

  return (
    <div className="max-w-2xl mx-auto">      <div className="mb-6 flex justify-between items-center">
        <Link href="/shop" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaArrowLeft />
          Voltar para Loja
        </Link>
        <div className="flex gap-4">
          <Link href="/home" className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-300">
            <FaHome />
            Home
          </Link>
          <Link href="/cart" className="flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaShoppingCart />
            Carrinho
          </Link>
        </div>
      </div>

      <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-800">        <div className="h-64 bg-gray-800 rounded mb-6 flex items-center justify-center relative overflow-hidden">
          {(produto.fotoUrl || produto.imagemUrl) ? (
            <Image 
              src={produto.fotoUrl || produto.imagemUrl || ''} 
              alt={produto.nome}
              fill
              className="object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <FaImage className="text-6xl text-gray-600" />
          )}
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{produto.nome}</h1>
        <p className="text-red-500 text-xl font-bold mb-4">R$ {produto.preco.toFixed(2)}</p>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Descrição</h3>
          <p className="text-gray-300">{produto.descricao}</p>
        </div>
          <div className="mb-6">
          <h3 className="font-semibold mb-2">Tamanhos</h3>
          <div className="flex flex-wrap gap-2">
            {['P', 'M', 'G', 'GG'].map((size: string) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`w-12 h-12 flex items-center justify-center rounded-md border-2 ${
                  selectedSize === size 
                    ? 'border-red-500 bg-red-900 bg-opacity-30' 
                    : 'border-gray-700 hover:border-red-500'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
        
        <div className="mb-6">
          <h3 className="font-semibold mb-2">Quantidade</h3>
          <div className="flex items-center w-32">
            <button 
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="bg-gray-800 px-3 py-1 rounded-l-md border border-gray-700"
            >
              -
            </button>
            <span className="bg-gray-800 px-4 py-1 border-t border-b border-gray-700 flex-1 text-center">
              {quantity}
            </span>
            <button 
              onClick={() => setQuantity(quantity + 1)}
              className="bg-gray-800 px-3 py-1 rounded-r-md border border-gray-700"
            >
              +
            </button>
          </div>
        </div>
        
        <button
          onClick={handleAddToCart}
          disabled={!selectedSize}
          className={`w-full py-3 rounded-md font-bold ${
            !selectedSize 
              ? 'bg-gray-700 cursor-not-allowed' 
              : 'bg-red-600 hover:bg-red-700'
          }`}
        >
          Adicionar ao Carrinho
        </button>
      </div>
    </div>
  );
}