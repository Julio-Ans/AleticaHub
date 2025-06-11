'use client';

import { useState } from 'react';
import Image from 'next/image';
import { FaImage, FaTimes, FaShoppingCart, FaPlus, FaMinus } from 'react-icons/fa';
import { useCarrinho } from '@/hooks/useCarrinho';
import { useToast } from '@/hooks/useToast';
import { type Produto } from '@/services/api';

interface ModalProdutoProps {
  isOpen: boolean;
  onClose: () => void;
  produto: Produto | null;
}

export default function ModalProduto({ isOpen, onClose, produto }: ModalProdutoProps) {
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [showSuccess, setShowSuccess] = useState(false);
  const { adicionarItem } = useCarrinho();
  const { success, error: showError } = useToast();

  // Reset state when modal opens/closes
  const handleClose = () => {
    setSelectedSize(null);
    setQuantity(1);
    setShowSuccess(false);
    onClose();
  };
  const handleAddToCart = async () => {
    if (!selectedSize || !produto) return;
    
    try {
      // Usar o hook useCarrinho para adicionar item com feedback
      await adicionarItem({
        produtoId: typeof produto.id === 'string' ? parseInt(produto.id) : produto.id,
        quantidade: quantity
      });
      
      // Mostrar toast de sucesso
      success(`${produto.nome} adicionado ao carrinho! (${quantity}x)`);
      
      setShowSuccess(true);
      setTimeout(() => {
        setShowSuccess(false);
        handleClose();
      }, 1500);
    } catch (error) {
      console.error('Erro ao adicionar ao carrinho:', error);
      showError(error instanceof Error ? error.message : 'Erro ao adicionar ao carrinho');
    }
  };

  if (!isOpen || !produto) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-gray-900 rounded-lg border border-gray-800 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Visualização Rápida</h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <FaTimes size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Imagem do Produto */}
            <div className="h-64 bg-gray-800 rounded-lg flex items-center justify-center relative overflow-hidden">
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

            {/* Informações do Produto */}
            <div className="space-y-4">
              <div>
                <h1 className="text-2xl font-bold text-white mb-2">{produto.nome}</h1>
                <p className="text-red-500 text-xl font-bold">R$ {produto.preco.toFixed(2)}</p>
              </div>

              <div>
                <h3 className="font-semibold text-white mb-2">Descrição</h3>
                <p className="text-gray-300 text-sm">{produto.descricao}</p>
              </div>

              {/* Estoque */}
              <div>
                <p className="text-sm text-gray-400">
                  Estoque: <span className="text-green-400">{produto.estoque} unidades</span>
                </p>
              </div>

              {/* Seleção de Tamanho */}
              <div>
                <h3 className="font-semibold text-white mb-2">Tamanho</h3>
                <div className="flex flex-wrap gap-2">
                  {['P', 'M', 'G', 'GG'].map((size: string) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`w-10 h-10 flex items-center justify-center rounded-md border-2 transition-colors ${
                        selectedSize === size 
                          ? 'border-red-500 bg-red-900 bg-opacity-30 text-white' 
                          : 'border-gray-700 hover:border-red-500 text-gray-300'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
                {!selectedSize && (
                  <p className="text-yellow-400 text-xs mt-1">Selecione um tamanho</p>
                )}
              </div>

              {/* Seleção de Quantidade */}
              <div>
                <h3 className="font-semibold text-white mb-2">Quantidade</h3>
                <div className="flex items-center w-32">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="bg-gray-800 px-3 py-1 rounded-l-md border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <FaMinus size={12} />
                  </button>
                  <span className="bg-gray-800 px-4 py-1 border-t border-b border-gray-700 flex-1 text-center text-white">
                    {quantity}
                  </span>
                  <button 
                    onClick={() => setQuantity(Math.min(produto.estoque, quantity + 1))}
                    className="bg-gray-800 px-3 py-1 rounded-r-md border border-gray-700 hover:bg-gray-700 transition-colors"
                  >
                    <FaPlus size={12} />
                  </button>
                </div>
              </div>

              {/* Botão de Comprar */}
              <div className="pt-4">
                {showSuccess ? (
                  <div className="bg-green-600 text-white py-3 px-4 rounded-lg text-center font-medium">
                    ✓ Produto adicionado ao carrinho!
                  </div>
                ) : (
                  <button
                    onClick={handleAddToCart}
                    disabled={!selectedSize || quantity > produto.estoque}
                    className={`w-full py-3 px-4 rounded-lg font-bold flex items-center justify-center gap-2 transition-colors ${
                      !selectedSize || quantity > produto.estoque
                        ? 'bg-gray-700 cursor-not-allowed text-gray-400' 
                        : 'bg-red-600 hover:bg-red-700 text-white'
                    }`}
                  >
                    <FaShoppingCart />
                    {!selectedSize 
                      ? 'Selecione um tamanho' 
                      : quantity > produto.estoque 
                        ? 'Estoque insuficiente'
                        : 'Comprar Agora'
                    }
                  </button>
                )}
              </div>

              {/* Informação adicional */}
              <div className="text-xs text-gray-500 border-t border-gray-800 pt-4">
                <p>• Frete grátis para compras acima de R$ 100,00</p>
                <p>• Produto da atlética oficial</p>
                <p>• Troca grátis em até 7 dias</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}