// Pedidos API Service - Gerenciamento de pedidos e-commerce

import AtleticaHubAPI from './baseApi';

export interface Pedido {
  id: string;
  usuarioId: string;
  status: 'pendente' | 'confirmado' | 'enviado' | 'entregue' | 'cancelado';
  total: number;
  criadoEm: string;
  updatedAt: string;
  itens: {
    produtoId: string;
    nome: string;
    preco: number;
    quantidade: number;
    subtotal: number;
  }[];
  usuario?: {
    nome: string;
    email: string;
  };
}

export interface UpdateStatusData {
  status: 'confirmado' | 'enviado' | 'entregue' | 'cancelado';
}

export interface UpdateStatusResponse {
  message: string;
  pedido: Pedido;
}

class PedidosService extends AtleticaHubAPI {
  // Listar meus pedidos
  async meusPedidos(): Promise<Pedido[]> {
    return this.request('/api/pedidos/meus');
  }

  // Buscar pedido por ID
  async buscarPedido(id: string): Promise<Pedido> {
    return this.request(`/api/pedidos/${id}`);
  }

  // Listar todos os pedidos (admin)
  async listarPedidos(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }): Promise<{
    pedidos: Pedido[];
    total: number;
    pagina: number;
    totalPaginas: number;
  }> {
    const queryParams = new URLSearchParams();
    
    if (params?.status) {
      queryParams.append('status', params.status);
    }
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }

    const query = queryParams.toString();
    const endpoint = query ? `/api/pedidos?${query}` : '/api/pedidos';
    
    return this.request(endpoint);
  }

  // Atualizar status do pedido (admin)
  async atualizarStatus(id: string, data: UpdateStatusData): Promise<UpdateStatusResponse> {
    return this.request(`/api/pedidos/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Cancelar pedido (usuário ou admin)
  async cancelarPedido(id: string): Promise<{ message: string }> {
    return this.request(`/api/pedidos/${id}/cancelar`, {
      method: 'PUT'
    });
  }
}

export const pedidosService = new PedidosService();
export default pedidosService;