// Hook para gerenciar esportes

import { useState, useEffect, useCallback } from 'react';
import { esportesService, type Esporte, type CreateEsporteData } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useEsportes = () => {
  const [esportes, setEsportes] = useState<Esporte[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();  // Carregar esportes
  const carregarEsportes = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const data = await esportesService.listarEsportes();
      setEsportes(data);
      console.log('✅ Esportes recarregados:', data.length);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar esportes';
      setError(errorMessage);
      console.error('❌ Erro ao carregar esportes:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Criar esporte (admin)
  const criarEsporte = async (data: CreateEsporteData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await esportesService.criarEsporte(data);
      
      // Recarregar a lista
      await carregarEsportes();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao criar esporte';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };  // Atualizar esporte (admin)
  const atualizarEsporte = async (id: string, data: CreateEsporteData) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await esportesService.atualizarEsporte(String(id), data);
      
      // Recarregar a lista
      await carregarEsportes();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao atualizar esporte';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Excluir esporte (admin)
  const excluirEsporte = async (id: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await esportesService.excluirEsporte(String(id));
      
      // Recarregar a lista
      await carregarEsportes();
      
      return response;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao excluir esporte';
      setError(errorMessage);
      throw new Error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };  // Carregar esportes no mount
  useEffect(() => {
    console.log('🏃 useEsportes iniciando - carregando esportes');
    
    const loadData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        console.log('📡 Fazendo chamada para API de esportes...');
        const data = await esportesService.listarEsportes();
        console.log('✅ Esportes carregados com sucesso:', data.length, data);
        setEsportes(data);
      } catch (err) {
        console.error('❌ Erro ao carregar esportes:', err);
        const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar esportes';
        setError(errorMessage);
        // Não fazer retry automático para evitar loops infinitos
        // O usuário pode tentar novamente manualmente se necessário
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, []); // Sem dependências para carregar apenas uma vez no mount

  return {
    esportes,
    isLoading,
    error,
    carregarEsportes,
    criarEsporte,
    atualizarEsporte,
    excluirEsporte,
    isAdmin: user?.role === 'admin'
  };
};
