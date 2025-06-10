// Hook para gerenciar mensagens (chat por esporte)

import { useState, useEffect, useCallback } from 'react';
import { mensagensService, type Mensagem, type CreateMensagemData } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useMensagens = (esporteId: string) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();
  // Carregar mensagens de um esporte
  const carregarMensagens = useCallback(async () => {
    if (!isAuthenticated || !esporteId) return;
    
    try {
      setIsLoading(true);
      setError(null);
      console.log('📡 useMensagens: Carregando mensagens para esporte:', esporteId);
      const data = await mensagensService.buscarMensagens(esporteId);
      
      // Ordenar mensagens por data de criação (mais antigas primeiro)
      const mensagensOrdenadas = data.sort((a, b) => 
        new Date(a.criadaEm).getTime() - new Date(b.criadaEm).getTime()
      );
      
      setMensagens(mensagensOrdenadas);
      console.log('✅ useMensagens: Mensagens carregadas e ordenadas:', mensagensOrdenadas.length);
    } catch (err) {
      console.error('❌ useMensagens: Erro ao carregar mensagens:', err);
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar mensagens';
      
      // Verificar se é erro de esporte não encontrado
      if (errorMessage.includes('esporte não encontrado') || errorMessage.includes('not found')) {
        setError('Este esporte não está disponível ou você não tem permissão para acessar o chat.');
      } else {
        setError(errorMessage);
      }
    } finally {
      setIsLoading(false);
    }
  }, [esporteId, isAuthenticated]);

  // Enviar nova mensagem
  const enviarMensagem = useCallback(async (conteudo: string) => {
    if (!isAuthenticated || !esporteId || !conteudo.trim()) return;
    
    try {
      const data: CreateMensagemData = {
        esporteId,
        conteudo: conteudo.trim()
      };
        const novaMensagem = await mensagensService.enviarMensagem(data);
      
      // Adicionar nova mensagem mantendo a ordem cronológica
      setMensagens(prev => {
        const novaLista = [...prev, novaMensagem];
        return novaLista.sort((a, b) => 
          new Date(a.criadaEm).getTime() - new Date(b.criadaEm).getTime()
        );
      });
      
      return novaMensagem;
    } catch (err) {
      console.error('❌ useMensagens: Erro ao enviar mensagem:', err);
      setError(err instanceof Error ? err.message : 'Erro ao enviar mensagem');
      throw err;
    }
  }, [esporteId, isAuthenticated]);

  // Excluir mensagem (admin ou próprio usuário)
  const excluirMensagem = useCallback(async (mensagemId: string) => {
    if (!isAuthenticated) return;
    
    try {
      await mensagensService.excluirMensagem(mensagemId);
      setMensagens(prev => prev.filter(msg => msg.id !== mensagemId));
    } catch (err) {
      console.error('Erro ao excluir mensagem:', err);
      setError(err instanceof Error ? err.message : 'Erro ao excluir mensagem');
      throw err;
    }
  }, [isAuthenticated]);

  // Verificar se usuário pode excluir mensagem
  const podeExcluirMensagem = useCallback((mensagem: Mensagem) => {
    if (!user) return false;
    // Admin pode excluir qualquer mensagem, usuário só as próprias
    return user.role === 'admin' || mensagem.remetenteId === user.id;
  }, [user]);

  // Auto-carregar mensagens quando hook é inicializado ou esporteId muda
  useEffect(() => {
    carregarMensagens();
  }, [carregarMensagens]);

  // Auto-recarregar mensagens a cada 30 segundos (polling simples)
  useEffect(() => {
    if (!isAuthenticated || !esporteId) return;

    const interval = setInterval(() => {
      carregarMensagens();
    }, 30000); // 30 segundos

    return () => clearInterval(interval);
  }, [carregarMensagens, isAuthenticated, esporteId]);

  return {
    mensagens,
    isLoading,
    error,
    enviarMensagem,
    excluirMensagem,
    carregarMensagens,
    podeExcluirMensagem,
    setError
  };
};

export default useMensagens;
