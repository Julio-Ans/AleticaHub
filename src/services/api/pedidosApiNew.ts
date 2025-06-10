// Pedidos API Service - Sistema de gerenciamento de pedidos

import AtleticaHubAPI from './baseApi';

export interface Pedido {
  id: number;
  usuarioId: string;
  total: number;
  status: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
  createdAt: string;
  updatedAt?: string;
  produtos: {
    id: number;
    quantidade: number;
    produto: {
      id: number;
      nome: string;
      preco: number;
      imagemUrl?: string;
    };
  }[];
}

export interface UpdateStatusData {
  status: 'processando' | 'enviado' | 'entregue' | 'cancelado';
}

export interface UpdateStatusResponse {
  message: string;
  pedido: {
    id: number;
    status: string;
    updatedAt: string;
  };
}

class PedidosService extends AtleticaHubAPI {
  // Listar meus pedidos
  async meusPedidos(): Promise<Pedido[]> {
    return this.request('/api/pedidos/usuario');
  }

  // Listar todos os pedidos (admin)
  async listarPedidos(params?: {
    status?: 'pendente' | 'processando' | 'enviado' | 'entregue' | 'cancelado';
    page?: number;
    limit?: number;
  }): Promise<Pedido[]> {
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

  // Buscar pedido por ID
  async buscarPedido(id: number): Promise<Pedido> {
    return this.request(`/api/pedidos/${id}`);
  }

  // Atualizar status do pedido (admin)
  async atualizarStatus(id: number, data: UpdateStatusData): Promise<UpdateStatusResponse> {
    return this.request(`/api/pedidos/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }
  // Verificar se pode alterar status
  canChangeStatus(currentStatus: string, newStatus: string): boolean {
    const statusFlow: Record<string, string[]> = {
      pendente: ['processando', 'cancelado'],
      processando: ['enviado', 'cancelado'],
      enviado: ['entregue'],
      entregue: [],
      cancelado: []
    };

    return statusFlow[currentStatus]?.includes(newStatus) || false;
  }

  // Obter próximos status possíveis
  getNextStatuses(currentStatus: string): string[] {
    const statusFlow: Record<string, string[]> = {
      pendente: ['processando', 'cancelado'],
      processando: ['enviado', 'cancelado'],
      enviado: ['entregue'],
      entregue: [],
      cancelado: []
    };

    return statusFlow[currentStatus] || [];
  }
}

export const pedidosService = new PedidosService();
