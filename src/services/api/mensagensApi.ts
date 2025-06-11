// Mensagens API Service - Chat por esporte

import AtleticaHubAPI from './baseApi';

export interface Mensagem {
  id?: string;
  _id?: string;
  remetenteId?: string;
  usuarioId?: string;
  usuarioNome?: string;
  esporteId: string; // "0" para chat geral
  texto?: string;
  conteudo?: string;
  criadaEm: string;
  editada?: boolean;
  fixada?: boolean;
  remetente?: {
    nome: string;
    email?: string;
  };
}

export interface CreateMensagemData {
  esporteId: string;
  conteudo: string;
}

class MensagensService extends AtleticaHubAPI {  // Buscar mensagens de um esporte
  async buscarMensagens(esporteId: string): Promise<Mensagem[]> {
    console.log(`🌐 API: Buscando mensagens para esporte ${esporteId}`);
    try {
      const result = await this.request(`/api/mensagens/${esporteId}`) as Mensagem[];
      console.log(`✅ API: Sucesso ao buscar mensagens do esporte ${esporteId}:`, result.length, 'mensagens');
      return result;
    } catch (error) {
      console.error(`❌ API: Erro ao buscar mensagens do esporte ${esporteId}:`, error);
      throw error;
    }
  }// Enviar mensagem
  async enviarMensagem(data: CreateMensagemData): Promise<Mensagem> {
    const endpoint = `/api/mensagens/${data.esporteId}`;
    console.log('🔄 MensagensService: Iniciando envio de mensagem', {
      data,
      endpoint,
      method: 'POST'
    });

    try {
      // Enviar apenas o conteúdo no body, esporteId vai na URL
      const result = await this.request(endpoint, {
        method: 'POST',
        body: JSON.stringify({ conteudo: data.conteudo })
      });
      
      console.log('✅ MensagensService: Mensagem enviada com sucesso', {
        resultado: result,
        estrutura: result && typeof result === 'object' ? Object.keys(result) : 'not object',
        temId: !!(result as any)?._id
      });
      
      return result as Mensagem;
    } catch (error) {
      console.error('❌ MensagensService: Erro ao enviar mensagem', {
        error,
        errorMessage: error instanceof Error ? error.message : 'unknown',
        stack: error instanceof Error ? error.stack : 'no stack',
        data
      });
      throw error;
    }
  }// Excluir mensagem (admin ou próprio usuário)
  async excluirMensagem(id: string): Promise<{ message: string }> {
    try {
      return await this.request(`/api/mensagens/${id}`, {
        method: 'DELETE'
      });
    } catch (error) {
      // Se o endpoint não existe (404/405), mostrar mensagem apropriada
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('405'))) {
        throw new Error('Funcionalidade de excluir mensagens ainda não implementada no servidor');
      }
      throw error;
    }
  }  // Fixar/desfixar mensagem (apenas admin)
  async fixarMensagem(id: string, fixada: boolean): Promise<Mensagem> {
    try {
      return await this.request(`/api/mensagens/${id}/fixar`, {
        method: 'PATCH', // Corrigido conforme backend
        body: JSON.stringify({ fixada })
      });
    } catch (error) {
      // Se o endpoint não existe (404/405), mostrar mensagem apropriada
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('405'))) {
        throw new Error('Funcionalidade de fixar mensagens ainda não implementada no servidor');
      }
      throw error;
    }
  }  // Editar mensagem (próprio usuário ou admin)
  async editarMensagem(id: string, conteudo: string): Promise<Mensagem> {
    try {
      console.log('🌐 MensagensService: Editando mensagem', { id, conteudo: conteudo.substring(0, 50) + '...' });
      
      const result = await this.request(`/api/mensagens/${id}`, {
        method: 'PUT',
        body: JSON.stringify({ conteudo })
      });
      
      console.log('✅ MensagensService: Mensagem editada com sucesso', {
        resultado: result,
        estrutura: result && typeof result === 'object' ? Object.keys(result) : 'not object',
        temId: !!(result as any)?._id || !!(result as any)?.id,
        editada: !!(result as any)?.editada
      });
      
      return result as Mensagem;
    } catch (error) {
      console.error('❌ MensagensService: Erro ao editar mensagem', { error, id, conteudo });
      
      // Se o endpoint não existe (404/405), mostrar mensagem apropriada
      if (error instanceof Error && (error.message.includes('404') || error.message.includes('405'))) {
        throw new Error('Funcionalidade de editar mensagens ainda não implementada no servidor');
      }
      throw error;
    }
  }
}

export const mensagensService = new MensagensService();
export default mensagensService;