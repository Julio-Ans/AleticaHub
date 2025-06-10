// Produtos API Service - E-commerce com paginação e busca

import AtleticaHubAPI from './baseApi';

export interface Produto {
  id: string | number; // API retorna number, mas usamos string no frontend
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria?: string; // Opcional pois pode não estar na resposta atual
  fotoUrl?: string;
  imagemUrl?: string; // Campo real da API
  criadoEm?: string;
  createdAt?: string; // Campo real da API
  updatedAt: string;
}

export interface CreateProdutoData {
  nome: string;
  descricao: string;
  preco: number;
  estoque: number;
  categoria: string;
  foto?: File;
}

export interface UpdateProdutoData {
  nome?: string;
  descricao?: string;
  preco?: number;
  estoque?: number;
  categoria?: string;
}

export interface ProdutosResponse {
  produtos: Produto[];
  total: number;
  pagina: number;
  totalPaginas: number;
}

class ProdutosService extends AtleticaHubAPI {  // Listar produtos com paginação e busca
  async listarProdutos(params?: {
    page?: number;
    limit?: number;
    search?: string;
    categoria?: string;
  }): Promise<Produto[] | ProdutosResponse> {
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
    if (params?.categoria) {
      queryParams.append('categoria', params.categoria);
    }

    const query = queryParams.toString();
    const endpoint = query ? `/api/produtos?${query}` : '/api/produtos';
    
    return this.request(endpoint, { auth: false });
  }

  // Buscar produto por ID
  async buscarProduto(id: string): Promise<Produto> {
    return this.request(`/api/produtos/${id}`, { auth: false });
  }

  // Criar produto (admin)
  async criarProduto(data: CreateProdutoData): Promise<Produto> {
    const formData = new FormData();
    formData.append('nome', data.nome);
    formData.append('descricao', data.descricao);
    formData.append('preco', data.preco.toString());
    formData.append('estoque', data.estoque.toString());
    formData.append('categoria', data.categoria);
    
    if (data.foto) {
      formData.append('foto', data.foto);
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
  async atualizarProduto(id: string, data: UpdateProdutoData): Promise<Produto> {
    return this.request(`/api/produtos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Excluir produto (admin)
  async excluirProduto(id: string): Promise<{ message: string }> {
    return this.request(`/api/produtos/${id}`, {
      method: 'DELETE'
    });
  }

  // Listar categorias
  async listarCategorias(): Promise<string[]> {
    return this.request('/api/produtos/categorias', { auth: false });
  }
}

export const produtosService = new ProdutosService();
export default produtosService;