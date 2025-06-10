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
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar esportes';
      setError(errorMessage);
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
  };  // Carregar esportes no mount - é público, não precisa de auth
  useEffect(() => {
    console.log('🏃 useEsportes iniciando - carregando esportes');
    carregarEsportes();
  }, [carregarEsportes]);

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
