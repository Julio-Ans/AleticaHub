// Hook para gerenciar eventos

import { useState, useEffect, useCallback } from 'react';
import { eventosService, type Evento, type CreateEventoData, type UpdateEventoData } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useEventos = () => {
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [meusEventos, setMeusEventos] = useState<Evento[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();  // Carregar eventos públicos
  const carregarEventos = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      console.log('Carregando eventos...');
      const data = await eventosService.listarEventos();
      console.log('Eventos carregados:', data);
      setEventos(data);
    } catch (err) {
      console.error('Erro ao carregar eventos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos');
    } finally {
      setIsLoading(false);
    }
  }, []);  // Carregar meus eventos
  const carregarMeusEventos = useCallback(async () => {
    // Verificação mais robusta - só carrega se realmente está autenticado E tem usuário
    if (!isAuthenticated || !user?.id) {
      console.log('🚫 useEventos: Usuário não autenticado, não carregando meus eventos');
      return;
    }
    
    try {
      console.log('📡 useEventos: Carregando meus eventos para', user.nome);
      setIsLoading(true);
      setError(null);
      const data = await eventosService.meusEventos();
      setMeusEventos(data);
      console.log('✅ useEventos: Meus eventos carregados:', data.length);
    } catch (err) {
      console.error('❌ useEventos: Erro ao carregar meus eventos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar meus eventos');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, user?.nome]);

  // Criar evento (admin)
  const criarEvento = async (data: CreateEventoData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await eventosService.criarEvento(data);
      
      // Recarregar a lista
      await carregarEventos();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };  // Atualizar evento (admin)
  const atualizarEvento = async (id: string | number, data: UpdateEventoData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await eventosService.atualizarEvento(id.toString(), data);
      
      // Recarregar a lista
      await carregarEventos();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };  // Excluir evento (admin)
  const excluirEvento = async (id: string | number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await eventosService.excluirEvento(id.toString());
      
      // Recarregar a lista
      await carregarEventos();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };  // Inscrever-se em evento
  const inscreverEvento = async (id: string | number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await eventosService.inscreverEvento(id.toString());
      
      // Recarregar eventos e meus eventos
      await Promise.all([carregarEventos(), carregarMeusEventos()]);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao se inscrever no evento';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };  // Cancelar inscrição
  const cancelarInscricaoEvento = async (id: string | number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await eventosService.cancelarInscricao(id.toString());
      
      // Recarregar eventos e meus eventos
      await Promise.all([carregarEventos(), carregarMeusEventos()]);
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar inscrição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };  // Verificar se usuário está inscrito em um evento
  const estaInscrito = (eventoId: string | number): boolean => {
    const id = eventoId.toString();
    return meusEventos.some(evento => evento._id?.toString() === id);
  };  // Carregar eventos no mount
  useEffect(() => {
    carregarEventos();
    // Só carregar meus eventos se realmente está autenticado E tem dados do usuário
    if (isAuthenticated && user?.id) {
      console.log('🚀 useEventos: Carregando meus eventos para usuário autenticado');
      carregarMeusEventos();
    } else {
      console.log('⏳ useEventos: Aguardando autenticação completa para meus eventos');
    }
  }, [isAuthenticated, user?.id, carregarEventos, carregarMeusEventos]);
  // Carregar eventos de um esporte específico
  const carregarEventosPorEsporte = useCallback(async (esporteId: string | number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await eventosService.listarEventosPorEsporte(esporteId.toString());
      return data;
    } catch (err) {
      console.error('Erro ao carregar eventos do esporte:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos do esporte');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);
  // Carregar eventos gerais (sem esporte específico)
  const carregarEventosGerais = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      // Carregar todos os eventos e filtrar os gerais (esporteId === "0")
      const data = await eventosService.listarEventos();
      const eventosGerais = data.filter(evento => evento.esporteId === "0");
      return eventosGerais;
    } catch (err) {
      console.error('Erro ao carregar eventos gerais:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar eventos gerais');
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return {
    eventos,
    meusEventos,
    isLoading,
    error,
    carregarEventos,
    carregarMeusEventos,
    criarEvento,
    atualizarEvento,
    excluirEvento,
    inscreverEvento,
    cancelarInscricaoEvento,
    estaInscrito,
    isAdmin: user?.role === 'admin',
    carregarEventosPorEsporte,
    carregarEventosGerais
  };
};
