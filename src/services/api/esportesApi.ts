// Esportes API Service - Serviço para gerenciar esportes

import AtleticaHubAPI from './baseApi';

export interface Esporte {
  id: string;
  nome: string;
  fotoUrl: string;
  criadoEm: string;
  inscricoes?: {
    id: string;
    status: 'pendente' | 'aceito' | 'rejeitado';
    criadaEm: string;
    usuario: {
      nome: string;
      email: string;
    };
  }[];
}

export interface CreateEsporteData {
  nome: string;
  foto?: File;
}

export interface UpdateEsporteData {
  nome?: string;
  foto?: File;
}

export interface CreateEsporteResponse {
  success: boolean;
  message: string;
  esporte: Esporte;
}

class EsportesService extends AtleticaHubAPI {  // Listar esportes
  async listarEsportes(): Promise<Esporte[]> {
    try {
      console.log('📡 Carregando esportes da API...');
      return await this.request('/api/esportes');
    } catch (error) {
      console.error('❌ Erro ao listar esportes:', error);
      throw new Error('Não foi possível carregar a lista de esportes. Verifique sua conexão e tente novamente.');
    }
  }

  // Buscar esporte por ID (requer autenticação válida)
  async buscarEsporte(id: string): Promise<Esporte> {
    console.log('🔍 EsportesService: Buscando esporte por ID:', id);
    
    try {
      return await this.request(`/api/esportes/${id}`);
    } catch (error) {
      console.error('❌ EsportesService: Erro ao buscar esporte:', error);
      throw error;
    }
  }
  // Criar esporte (admin)
  async criarEsporte(data: CreateEsporteData): Promise<CreateEsporteResponse> {
    const formData = new FormData();
    formData.append('nome', data.nome);
    
    if (data.foto) {
      formData.append('foto', data.foto);
    }

    return this.request('/api/esportes', {
      method: 'POST',
      body: formData
      // Não incluir Content-Type para FormData
      // Authorization será adicionado automaticamente pelo baseApi
    });
  }

  // Atualizar esporte (admin)
  async atualizarEsporte(id: string, data: UpdateEsporteData): Promise<CreateEsporteResponse> {
    const formData = new FormData();
    
    if (data.nome) {
      formData.append('nome', data.nome);
    }
    
    if (data.foto) {
      formData.append('foto', data.foto);
    }

    return this.request(`/api/esportes/${id}`, {
      method: 'PUT',
      body: formData
      // Authorization será adicionado automaticamente pelo baseApi
    });
  }

  // Excluir esporte (admin)
  async excluirEsporte(id: string): Promise<{ success: boolean; message: string }> {
    return this.request(`/api/esportes/${id}`, {
      method: 'DELETE'
    });
  }
}

// Criar instância do serviço de esportes
const esportesService = new EsportesService();

export { esportesService };
export default esportesService;
