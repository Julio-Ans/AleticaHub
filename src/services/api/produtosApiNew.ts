// Produtos API Service - Sistema de E-commerce

import AtleticaHubAPI from './baseApi';

export interface Produto {
  id: number;
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagemUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProdutoData {
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  imagem?: File;
}

export interface UpdateProdutoData {
  nome?: string;
  descricao?: string;
  preco?: number;
  estoque?: number;
  imagem?: File;
}

export interface ProdutosResponse {
  produtos: Produto[];
  total: number;
  page: number;
  totalPages: number;
}

class ProdutosService extends AtleticaHubAPI {
  // Listar produtos (público)
  async listarProdutos(params?: {
    page?: number;
    limit?: number;
    search?: string;
  }): Promise<ProdutosResponse> {
    const queryParams = new URLSearchParams();
    
    if (params?.page) {
      queryParams.append('page', params.page.toString());
    }
    if (params?.limit) {
      queryParams.append('limit', params.limit.toString());
    }
    if (params?.search) {
      queryParams.append('search', params.search);
    }

    const query = queryParams.toString();
    const endpoint = query ? `/api/produtos?${query}` : '/api/produtos';
    
    return this.request(endpoint, { auth: false });
  }

  // Buscar produto por ID (público)
  async buscarProduto(id: number): Promise<Produto> {
    return this.request(`/api/produtos/${id}`, { auth: false });
  }

  // Criar produto (admin)
  async criarProduto(data: CreateProdutoData): Promise<Produto> {
    const formData = new FormData();
    formData.append('nome', data.nome);
    formData.append('descricao', data.descricao);
    formData.append('preco', data.preco.toString());
    formData.append('estoque', data.estoque.toString());
    
    if (data.imagem) {
      formData.append('imagem', data.imagem);
    }

    return this.request('/api/produtos', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  // Atualizar produto (admin)
  async atualizarProduto(id: number, data: UpdateProdutoData): Promise<Produto> {
    const formData = new FormData();
    
    if (data.nome) formData.append('nome', data.nome);
    if (data.descricao) formData.append('descricao', data.descricao);
    if (data.preco) formData.append('preco', data.preco.toString());
    if (data.estoque !== undefined) formData.append('estoque', data.estoque.toString());
    if (data.imagem) formData.append('imagem', data.imagem);

    return this.request(`/api/produtos/${id}`, {
      method: 'PUT',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  // Excluir produto (admin)
  async excluirProduto(id: number): Promise<{ message: string }> {
    return this.request(`/api/produtos/${id}`, {
      method: 'DELETE'
    });
  }
}

export const produtosService = new ProdutosService();
