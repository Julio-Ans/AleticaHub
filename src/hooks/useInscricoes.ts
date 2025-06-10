// Hook para gerenciar inscrições em esportes

import { useState, useEffect, useCallback } from 'react';
import { inscricoesService, type Inscricao } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useInscricoes = () => {
  const [minhasInscricoes, setMinhasInscricoes] = useState<Inscricao[]>([]);
  const [inscricoesPendentes, setInscricoesPendentes] = useState<Inscricao[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();  // Carregar minhas inscrições
  const carregarMinhasInscricoes = useCallback(async () => {
    // Verificação mais robusta - só carrega se realmente está autenticado E tem usuário
    if (!isAuthenticated || !user?.id) {
      console.log('🚫 useInscricoes: Usuário não autenticado, não carregando inscrições');
      return;
    }
    
    try {
      console.log('📡 useInscricoes: Carregando inscrições para', user.nome);
      setIsLoading(true);
      setError(null);
      const data = await inscricoesService.minhasInscricoes();
      setMinhasInscricoes(data);
      console.log('✅ useInscricoes: Inscrições carregadas:', data.length);
    } catch (err) {
      console.error('❌ useInscricoes: Erro ao carregar inscrições:', err);
      setError(err instanceof Error ? err.message : 'Erro ao carregar inscrições');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, user?.id, user?.nome]);// Carregar inscrições pendentes (admin)
  const carregarInscricoesPendentes = async (esporteId: string | number) => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await inscricoesService.listarInscricoes({ 
        status: 'pendente', 
        esporteId: esporteId.toString() 
      });
      setInscricoesPendentes(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar inscrições pendentes');
    } finally {
      setIsLoading(false);
    }
  };  // Criar inscrição
  const criarInscricao = async (esporteId: string | number) => {
    if (!isAuthenticated || !user?.id) {
      throw new Error('Você precisa estar logado para se inscrever em um esporte');
    }
    
    try {
      console.log('📝 Criando inscrição para o esporte:', esporteId, 'usuário:', user.nome);
      setIsLoading(true);
      setError(null);
      const response = await inscricoesService.inscreverEsporte(esporteId.toString());
      
      // Recarregar minhas inscrições
      await carregarMinhasInscricoes();
      
      console.log('✅ Inscrição criada com sucesso');
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar inscrição';
      console.error('❌ Erro ao criar inscrição:', errorMessage);
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };// Atualizar status da inscrição (admin)
  const atualizarStatusInscricao = async (id: string | number, status: 'aceito' | 'rejeitado') => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await inscricoesService.atualizarStatus(id.toString(), status);
      
      // Recarregar inscrições pendentes se houver
      if (inscricoesPendentes.length > 0) {
        const inscricao = inscricoesPendentes.find(i => i.id === id.toString());
        if (inscricao) {
          await carregarInscricoesPendentes(inscricao.esporteId);
        }
      }
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar status da inscrição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  // Cancelar inscrição (implemented by changing status to 'rejeitado')
  const cancelarInscricao = async (id: string | number) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await inscricoesService.atualizarStatus(id.toString(), 'rejeitado');
      
      // Recarregar minhas inscrições
      await carregarMinhasInscricoes();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao cancelar inscrição';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Verificar se usuário está inscrito em um esporte
  const verificarInscricao = async (esporteId: string | number) => {
    try {
      // Check in local minhasInscricoes instead of API call
      const inscricao = minhasInscricoes.find(i => i.esporteId === esporteId.toString());
      return { inscrito: !!inscricao };
    } catch {
      return { inscrito: false };
    }
  };

  // Verificar status da inscrição em um esporte
  const getStatusInscricao = (esporteId: string | number): 'pendente' | 'aceito' | 'rejeitado' | null => {
    const inscricao = minhasInscricoes.find(i => i.esporteId === esporteId);
    return inscricao?.status || null;
  };
  // Carregar minhas inscrições no mount
  useEffect(() => {
    // Só carregar se realmente está autenticado E tem dados do usuário
    if (isAuthenticated && user?.id) {
      console.log('🚀 useInscricoes: Iniciando carregamento para usuário autenticado');
      carregarMinhasInscricoes();
    } else {
      console.log('⏳ useInscricoes: Aguardando autenticação completa');
    }
  }, [isAuthenticated, user?.id, carregarMinhasInscricoes]);

  return {
    minhasInscricoes,
    inscricoesPendentes,
    isLoading,
    error,
    carregarMinhasInscricoes,
    carregarInscricoesPendentes,
    criarInscricao,
    atualizarStatusInscricao,
    cancelarInscricao,
    verificarInscricao,
    getStatusInscricao,
    isAdmin: user?.role === 'admin'
  };
};
