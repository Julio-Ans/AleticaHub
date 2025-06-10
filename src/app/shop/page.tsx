'use client';

import Link from 'next/link';
import Image from 'next/image';
import { FaHome, FaShoppingCart, FaImage, FaEye } from 'react-icons/fa';
import { useEffect, useState } from 'react';
import { produtosService, type Produto } from '@/services/api';
import ModalProduto from '@/components/ModalProduto';

export default function ShopPage() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [produtoSelecionado, setProdutoSelecionado] = useState<Produto | null>(null);
  useEffect(() => {
    const carregarProdutos = async () => {      try {
        setLoading(true);
        setError(null);
        const data = await produtosService.listarProdutos();
        // A API retorna um array diretamente, não um objeto com propriedade produtos
        setProdutos(Array.isArray(data) ? data : data.produtos || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
      } finally {
        setLoading(false);
      }
    };

    carregarProdutos();
  }, []);

  const abrirModal = (produto: Produto) => {
    setProdutoSelecionado(produto);
    setModalOpen(true);
  };

  const fecharModal = () => {
    setModalOpen(false);
    setProdutoSelecionado(null);
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-900/20 border border-red-500 rounded-lg p-4 mb-6">
          <p className="text-red-500">Erro: {error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6 flex justify-between items-center">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
        <Link href="/cart" className="flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaShoppingCart />
          Carrinho
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6">Loja da Atlética</h1>      {produtos.length === 0 ? (
        <p className="text-gray-400">Nenhum produto disponível no momento.</p>
      ) : (        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {produtos.map((produto) => {
            const produtoId = produto.id;
            
            return (
              <div
                key={produtoId}
                className="bg-gray-900 p-4 rounded-lg shadow border border-gray-800 hover:border-red-500 transition-colors relative group"
              >
                <div className="h-40 bg-gray-800 rounded mb-3 flex items-center justify-center relative overflow-hidden">
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
                    <FaImage className="text-4xl text-gray-600" />
                  )}                  {/* Botão de visualização rápida */}
                  <button
                    onClick={() => abrirModal(produto)}
                    className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 flex items-center justify-center opacity-0 group-hover:opacity-100 z-20"
                  >
                    <div className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transform scale-90 group-hover:scale-100 transition-transform">
                      <FaEye />
                      Ver Produto
                    </div>
                  </button>
                </div>
                
                <Link href={`/shop/${produtoId}`}>
                  <h2 className="font-bold hover:text-red-400 transition-colors">{produto.nome}</h2>
                  <p className="text-gray-400 text-sm mb-2 line-clamp-2">{produto.descricao}</p>
                  <p className="text-red-500 font-bold text-lg">R$ {produto.preco.toFixed(2)}</p>
                  <div className="text-center text-sm text-gray-400 hover:text-white mt-2">
                    Ver detalhes completos
                  </div>
                </Link>
              </div>
            );
          })}
        </div>      )}
      
      {/* Modal do Produto */}
      <ModalProduto
        isOpen={modalOpen}
        onClose={fecharModal}
        produto={produtoSelecionado}
      />
    </div>
  );
}
