// Hook para gerenciar carrinho de compras

import { useState, useEffect, useCallback } from 'react';
import { carrinhoService, produtosService, type ItemCarrinho, type AddToCartData, type UpdateCartData } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useCarrinho = () => {
  const [itens, setItens] = useState<ItemCarrinho[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();

  // Carregar itens do carrinho
  const carregarCarrinho = useCallback(async () => {
    // Verificação mais robusta - só carrega se realmente está autenticado E tem usuário
    if (!isAuthenticated || !user?.id) {
      console.log('🚫 useCarrinho: Usuário não autenticado, não carregando carrinho');
      setItens([]);
      return;
    }
      try {
      console.log('📡 useCarrinho: Carregando carrinho para', user.nome);
      setIsLoading(true);
      setError(null);
      const data = await carrinhoService.listarItens();
      setItens(data);
      console.log('✅ useCarrinho: Carrinho carregado:', data.length, 'itens');
    } catch (err) {
      console.error('❌ useCarrinho: Erro ao carregar carrinho:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar carrinho');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, user?.nome]);
  // Adicionar item ao carrinho
  const adicionarItem = async (data: AddToCartData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Verificar estoque antes de adicionar
      const produto = await produtosService.buscarProduto(data.produtoId.toString());
      
      if (produto.estoque < data.quantidade) {
        throw new Error(`Estoque insuficiente. Disponível: ${produto.estoque}`);
      }
      
      await carrinhoService.adicionarItem(data);
      await carregarCarrinho();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao adicionar item';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  // Atualizar quantidade do item
  const atualizarItem = async (itemId: number, data: UpdateCartData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Buscar o item no carrinho para verificar estoque
      const item = itens.find(i => i.id === itemId);
      if (!item) {
        throw new Error('Item não encontrado no carrinho');
      }
        // Verificar estoque antes de atualizar
      const produto = await produtosService.buscarProduto(item.produto.id.toString());
      
      if (produto.estoque < data.quantidade) {
        throw new Error(`Estoque insuficiente. Disponível: ${produto.estoque}`);
      }
      
      await carrinhoService.atualizarQuantidade(itemId, data);
      await carregarCarrinho();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar item';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  // Remover item do carrinho
  const removerItem = async (itemId: number) => {
    try {
      setIsLoading(true);
      setError(null);
      await carrinhoService.removerItem(itemId);
      await carregarCarrinho();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao remover item';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Limpar carrinho
  const limparCarrinho = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await carrinhoService.limparCarrinho();
      setItens([]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao limpar carrinho';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Finalizar pedido
  const finalizarPedido = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await carrinhoService.finalizarPedido();
      
      // Limpar carrinho após finalizar
      setItens([]);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao finalizar pedido';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  // Calcular totais
  const calcularTotais = () => {
    const quantidadeTotal = itens.reduce((acc, item) => acc + item.quantidade, 0);
    const valorTotal = itens.reduce((acc, item) => acc + (item.produto.preco * item.quantidade), 0);
    
    return {
      quantidadeTotal,
      valorTotal
    };
  };

  // Carregar carrinho no mount e quando autenticação mudar
  useEffect(() => {
    carregarCarrinho();
  }, [carregarCarrinho]);

  const { quantidadeTotal, valorTotal } = calcularTotais();

  return {
    itens,
    isLoading,
    error,
    quantidadeTotal,
    valorTotal,
    carregarCarrinho,
    adicionarItem,
    atualizarItem,
    removerItem,
    limparCarrinho,
    finalizarPedido
  };
};
