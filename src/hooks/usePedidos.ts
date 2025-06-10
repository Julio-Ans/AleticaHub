// Hook para gerenciar pedidos

import { useState, useEffect, useCallback } from 'react';
import { pedidosService, type Pedido, type UpdateStatusData, type PedidoUpdateStatusResponse } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const usePedidos = () => {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [meusPedidos, setMeusPedidos] = useState<Pedido[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  // Carregar meus pedidos
  const carregarMeusPedidos = useCallback(async () => {
    // Verificação mais robusta - só carrega se realmente está autenticado E tem usuário
    if (!isAuthenticated || !user?.id) {
      console.log('🚫 usePedidos: Usuário não autenticado, não carregando meus pedidos');
      setMeusPedidos([]);
      return;
    }
    
    try {
      console.log('📡 usePedidos: Carregando meus pedidos para', user.nome);
      setIsLoading(true);
      setError(null);
      const data = await pedidosService.meusPedidos();
      setMeusPedidos(data);
      console.log('✅ usePedidos: Meus pedidos carregados:', data.length);
    } catch (err) {
      console.error('❌ usePedidos: Erro ao carregar meus pedidos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar meus pedidos');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, user?.nome]);

  // Carregar todos os pedidos (admin)
  const carregarPedidos = useCallback(async (params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) => {
    if (user?.role !== 'admin') return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await pedidosService.listarPedidos(params);
      setPedidos(response.pedidos);
      
      return {
        pedidos: response.pedidos,
        total: response.total,
        pagina: response.pagina,
        totalPaginas: response.totalPaginas
      };
    } catch (err) {
      console.error('Erro ao carregar pedidos:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
    } finally {
      setIsLoading(false);
    }
  }, [user?.role]);

  // Buscar pedido por ID
  const buscarPedido = async (id: string): Promise<Pedido | null> => {
    try {
      setIsLoading(true);
      setError(null);
      const pedido = await pedidosService.buscarPedido(id);
      return pedido;
    } catch (err) {
      console.error('Erro ao buscar pedido:', err);
      setError(err instanceof Error ? err.message : 'Erro ao buscar pedido');
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // Atualizar status do pedido (admin)
  const atualizarStatus = async (id: string, data: UpdateStatusData): Promise<PedidoUpdateStatusResponse | null> => {
    if (user?.role !== 'admin') {
      setError('Apenas administradores podem atualizar status de pedidos');
      return null;
    }
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await pedidosService.atualizarStatus(id, data);
      
      // Atualizar na lista local
      setPedidos(prev => prev.map(pedido => 
        pedido.id === id ? response.pedido : pedido
      ));
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Cancelar pedido
  const cancelarPedido = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await pedidosService.cancelarPedido(id);
      
      // Recarregar listas
      if (user?.role === 'admin') {
        await carregarPedidos();
      } else {
        await carregarMeusPedidos();
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar pedido';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Filtrar pedidos por status
  const filtrarPorStatus = (status: string) => {
    return pedidos.filter(pedido => pedido.status === status);
  };

  // Estatísticas de pedidos (admin)
  const obterEstatisticas = () => {
    if (user?.role !== 'admin') return null;
    
    const total = pedidos.length;
    const pendentes = pedidos.filter(p => p.status === 'pendente').length;
    const confirmados = pedidos.filter(p => p.status === 'confirmado').length;
    const enviados = pedidos.filter(p => p.status === 'enviado').length;
    const entregues = pedidos.filter(p => p.status === 'entregue').length;
    const cancelados = pedidos.filter(p => p.status === 'cancelado').length;
    
    const valorTotal = pedidos
      .filter(p => p.status !== 'cancelado')
      .reduce((acc, pedido) => acc + pedido.total, 0);
    
    return {
      total,
      pendentes,
      confirmados,
      enviados,
      entregues,
      cancelados,
      valorTotal
    };
  };
  // Carregar dados iniciais
  useEffect(() => {
    // Só carregar se realmente está autenticado E tem dados do usuário
    if (isAuthenticated && user?.id) {
      if (user?.role === 'admin') {
        console.log('🚀 usePedidos: Carregando todos os pedidos para admin');
        carregarPedidos();
      } else {
        console.log('🚀 usePedidos: Carregando meus pedidos para usuário autenticado');
        carregarMeusPedidos();
      }
    } else {
      console.log('⏳ usePedidos: Aguardando autenticação completa');
    }
  }, [isAuthenticated, user?.id, user?.role, carregarPedidos, carregarMeusPedidos]);

  return {
    pedidos,
    meusPedidos,
    isLoading,
    error,
    carregarMeusPedidos,
    carregarPedidos,
    buscarPedido,
    atualizarStatus,
    cancelarPedido,
    filtrarPorStatus,
    obterEstatisticas,
    isAdmin: user?.role === 'admin'
  };
};
