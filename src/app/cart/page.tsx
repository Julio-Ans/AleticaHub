'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaArrowLeft, FaTrash, FaSpinner, FaPlus, FaMinus, FaShoppingCart } from 'react-icons/fa';
import { useCarrinho } from '@/hooks/useCarrinho';
import { useAuth } from '@/context/AuthContext';

export default function CartPage() {
  const { user } = useAuth();
  const { 
    itens, 
    isLoading, 
    error, 
    valorTotal,
    atualizarItem, 
    removerItem, 
    limparCarrinho
  } = useCarrinho();

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaHome />
            Voltar para Home
          </Link>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg text-center">
          <p className="text-gray-400 mb-4">Você precisa estar logado para ver seu carrinho.</p>
          <Link href="/login" className="text-red-500 hover:text-red-400 underline">
            Fazer Login
          </Link>
        </div>
      </div>
    );  }

  const total = valorTotal;

  const handleQuantityChange = async (itemId: number, novaQuantidade: number) => {
    if (novaQuantidade < 1) return;
    
    try {
      await atualizarItem(itemId, { quantidade: novaQuantidade });
    } catch (error) {
      console.error('Erro ao atualizar quantidade:', error);
    }
  };

  const handleRemoveItem = async (itemId: number) => {
    if (confirm('Tem certeza que deseja remover este item do carrinho?')) {
      try {
        await removerItem(itemId);
      } catch (error) {
        console.error('Erro ao remover item:', error);
      }
    }
  };

  const handleClearCart = async () => {
    if (confirm('Tem certeza que deseja limpar todo o carrinho?')) {
      try {
        await limparCarrinho();
      } catch (error) {
        console.error('Erro ao limpar carrinho:', error);
      }
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <Link href="/shop" className="text-red-500 hover:text-red-400">
            <FaArrowLeft />
          </Link>
          <FaShoppingCart className="text-red-500" />
          Seu Carrinho
        </h1>
        {itens.length > 0 && (
          <button
            onClick={handleClearCart}
            className="text-red-500 hover:text-red-400 text-sm"
          >
            Limpar Carrinho
          </button>
        )}
      </div>

      {error && (
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-500">Erro: {error}</p>
        </div>
      )}

      <div className="bg-gray-900 rounded-lg border border-gray-800">
        {isLoading ? (
          <div className="p-8 text-center">
            <FaSpinner className="animate-spin text-3xl text-red-500 mx-auto mb-4" />
            <p className="text-gray-400">Carregando carrinho...</p>
          </div>
        ) : itens.length === 0 ? (
          <div className="p-8 text-center">
            <FaShoppingCart className="text-6xl text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-300 mb-2">Seu carrinho está vazio</h3>
            <p className="text-gray-400 mb-4">Adicione alguns produtos da nossa loja!</p>
            <Link 
              href="/shop" 
              className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg transition-colors"
            >
              <FaShoppingCart />
              Ir para a Loja
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-gray-800">
              {itens.map((item) => (
                <div key={item.id} className="p-6 flex gap-4">
                  {/* Imagem do produto */}
                  <div className="w-20 h-20 bg-gray-800 rounded-lg flex-shrink-0 overflow-hidden">
                    {item.produto.imagemUrl ? (
                      <Image
                        src={item.produto.imagemUrl}
                        alt={item.produto.nome}
                        width={80}
                        height={80}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                        <FaShoppingCart className="text-gray-500" />
                      </div>
                    )}
                  </div>

                  {/* Informações do produto */}
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">{item.produto.nome}</h3>
                    <p className="text-gray-400 text-sm mb-2">{item.produto.descricao}</p>
                    <p className="text-red-400 font-semibold">
                      R$ {item.produto.preco.toFixed(2)} cada
                    </p>
                  </div>

                  {/* Controles de quantidade */}
                  <div className="flex flex-col items-center gap-2">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantidade - 1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                        disabled={item.quantidade <= 1}
                      >
                        <FaMinus className="text-xs" />
                      </button>
                      <span className="text-white font-semibold w-8 text-center">
                        {item.quantidade}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantidade + 1)}
                        className="w-8 h-8 bg-gray-700 hover:bg-gray-600 text-white rounded-full flex items-center justify-center transition-colors"
                      >
                        <FaPlus className="text-xs" />
                      </button>
                    </div>

                    {/* Subtotal do item */}
                    <p className="text-white font-bold">
                      R$ {(item.produto.preco * item.quantidade).toFixed(2)}
                    </p>

                    {/* Botão remover */}
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-400 p-1"
                      title="Remover item"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="p-6 border-t border-gray-800">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xl font-semibold text-white">Total:</span>
                <span className="text-2xl font-bold text-red-400">
                  R$ {total.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-4">
                <Link
                  href="/shop"
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Continuar Comprando
                </Link>
                <Link
                  href="/cart/checkout"
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white py-3 px-6 rounded-lg text-center transition-colors"
                >
                  Finalizar Compra
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}