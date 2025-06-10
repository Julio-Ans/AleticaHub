// Eventos API Service - Sistema inteligente de eventos (gerais + treinos por esporte)

import AtleticaHubAPI from './baseApi';

export interface Evento {
  _id: string; // MongoDB ObjectId
  titulo: string;
  descricao: string;
  tipo: 'treino' | 'festa' | 'reuniao' | 'confraternizacao' | 'palestra' | 'workshop' | 'assembleia' | 'outro';
  data: string;
  local: string;
  esporteId: string; // "0" para eventos gerais, UUID para treinos
  criadorId: string;
  fotoUrl?: string;
  criadoEm: string;
  updatedAt: string;
  inscricoes: {
    usuarioId: string;
    nome: string;
    email: string;
    dataInscricao: string;
  }[];
}

export interface CreateEventoData {
  titulo: string;
  descricao: string;
  tipo: string;
  data: string;
  local: string;
  esporteId: string;
  foto?: File;
}

export interface UpdateEventoData {
  titulo?: string;
  descricao?: string;
  data?: string;
  local?: string;
}

class EventosService extends AtleticaHubAPI {  // Listar todos os eventos
  async listarEventos(): Promise<Evento[]> {
    try {
      console.log('📡 Carregando eventos da API...');
      return await this.request('/api/eventos');
    } catch (error) {
      console.error('❌ Erro ao listar eventos:', error);
      throw new Error('Não foi possível carregar a lista de eventos. Verifique sua conexão e tente novamente.');
    }
  }

  // Listar eventos permitidos para usuário (baseado em permissões)
  async listarEventosPermitidos(): Promise<Evento[]> {
    return this.request('/api/eventos/permitidos');
  }

  // Listar eventos por esporte
  async listarEventosPorEsporte(esporteId: string): Promise<Evento[]> {
    return this.request(`/api/eventos/esporte/${esporteId}`, { auth: false });
  }

  // Buscar evento por ID
  async buscarEvento(id: string): Promise<Evento> {
    return this.request(`/api/eventos/${id}`, { auth: false });
  }

  // Criar evento (admin)
  async criarEvento(data: CreateEventoData): Promise<Evento> {
    const formData = new FormData();
    formData.append('titulo', data.titulo);
    formData.append('descricao', data.descricao);
    formData.append('tipo', data.tipo);
    formData.append('data', data.data);
    formData.append('local', data.local);
    formData.append('esporteId', data.esporteId);
    
    if (data.foto) {
      formData.append('foto', data.foto);
    }

    return this.request('/api/eventos', {
      method: 'POST',
      body: formData,
      headers: {
        'Authorization': `Bearer ${this.token}`
      }
    });
  }

  // Atualizar evento (admin)
  async atualizarEvento(id: string, data: UpdateEventoData): Promise<Evento> {
    return this.request(`/api/eventos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data)
    });
  }

  // Excluir evento (admin)
  async excluirEvento(id: string): Promise<{ message: string }> {
    return this.request(`/api/eventos/${id}`, {
      method: 'DELETE'
    });
  }

  // Inscrever-se em evento
  async inscreverEvento(id: string): Promise<{ message: string }> {
    return this.request(`/api/eventos/${id}/inscrever`, {
      method: 'POST'
    });
  }

  // Cancelar inscrição
  async cancelarInscricao(id: string): Promise<{ message: string }> {
    return this.request(`/api/eventos/${id}/inscrever`, {
      method: 'DELETE'
    });
  }

  // Meus eventos (usuário)
  async meusEventos(): Promise<Evento[]> {
    return this.request('/api/eventos/minhas/inscricoes');
  }
}

export const eventosService = new EventosService();
export default eventosService;