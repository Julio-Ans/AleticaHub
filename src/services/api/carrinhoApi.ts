// Carrinho API Service - Sistema de carrinho de compras

import AtleticaHubAPI from './baseApi';
import { Produto } from './produtosApi';

export interface ItemCarrinho {
  id: number;
  studentEmail: string;
  quantidade: number;
  createdAt: string;
  produto: Produto;
}

export interface AddToCartData {
  produtoId: number;
  quantidade: number;
}

export interface UpdateCartData {
  quantidade: number;
}

export interface FinalizarPedidoResponse {
  id: number;
  usuarioId: string;
  total: number;
  status: 'pendente';
  createdAt: string;
  produtos: {
    produtoId: number;
    quantidade: number;
    produto: {
      nome: string;
      preco: number;
    };
  }[];
}

class CarrinhoService extends AtleticaHubAPI {
  // Listar itens do carrinho
  async listarItens(): Promise<ItemCarrinho[]> {
    return this.request('/api/cart');
  }

  // Adicionar item ao carrinho
  async adicionarItem(data: AddToCartData): Promise<ItemCarrinho> {
    return this.request('/api/cart', {
      method: 'POST',
      body: JSON.stringify(data)
    });
  }

  // Atualizar quantidade do item
  async atualizarQuantidade(id: number, data: UpdateCartData): Promise<ItemCarrinho> {
    return this.request(`/api/cart/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Remover item do carrinho
  async removerItem(id: number): Promise<{ message: string }> {
    return this.request(`/api/cart/${id}`, {
      method: 'DELETE'
    });
  }

  // Finalizar pedido
  async finalizarPedido(): Promise<FinalizarPedidoResponse> {
    return this.request('/api/cart/finalizar', {
      method: 'POST'
    });
  }

  // Limpar carrinho
  async limparCarrinho(): Promise<{ message: string }> {
    return this.request('/api/cart', {
      method: 'DELETE'
    });
  }

  // Calcular total do carrinho
  calcularTotal(itens: ItemCarrinho[]): number {
    return itens.reduce((total, item) => {
      return total + (item.produto.preco * item.quantidade);
    }, 0);
  }
}

export const carrinhoService = new CarrinhoService();
