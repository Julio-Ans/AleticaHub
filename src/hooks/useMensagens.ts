// Hook para gerenciar mensagens (chat por esporte)

import { useState, useEffect, useCallback } from 'react';
import { mensagensService, type Mensagem, type CreateMensagemData } from '../services/api';
import { useAuth } from '../context/AuthContext';

export const useMensagens = (esporteId: string) => {
  const [mensagens, setMensagens] = useState<Mensagem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, isAuthenticated } = useAuth();  // Carregar mensagens de um esporte
  const carregarMensagens = useCallback(async () => {
    console.log('🔄 useMensagens: carregarMensagens chamado', {
      isAuthenticated,
      esporteId,
      temUsuario: !!user
    });

    if (!isAuthenticated || !esporteId) {
      console.log('❌ useMensagens: Condições não atendidas', {
        isAuthenticated,
        esporteId
      });
      return;
    }
    
    try {
      setIsLoading(true);
      setError(null);      console.log(`🔄 Carregando mensagens para esporte: ${esporteId} (Chat Geral: ${esporteId === '0'})`);
        const data = await mensagensService.buscarMensagens(esporteId);      console.log(`📨 Mensagens recebidas para esporte ${esporteId}:`, {
        total: data.length,
        isChatGeral: esporteId === '0',
        rawData: data,
        mensagens: data.map(msg => ({
          id: msg.id,
          texto: msg.texto,
          remetente: msg.remetente,
          remetenteId: msg.remetenteId,
          esporteId: msg.esporteId,
          allKeys: Object.keys(msg)
        }))
      });
      
      // Ordenar mensagens por data (mais antigas primeiro)
      const mensagensOrdenadas = data.sort((a, b) => 
        new Date(a.criadaEm).getTime() - new Date(b.criadaEm).getTime()
      );
      setMensagens(mensagensOrdenadas);    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar mensagens';
      console.error(`❌ Erro ao carregar mensagens para esporte ${esporteId}:`, err);
      
      // Verificar se é erro de "sem mensagens" (404) - isso é normal
      if (errorMessage.includes('404') || errorMessage.includes('não encontrado')) {
        console.log('📝 Nenhuma mensagem encontrada para este esporte (normal)');
        setMensagens([]);
        setError(null); // Não mostrar erro para situação normal
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        console.log('🔒 Acesso negado para este esporte (usuário não inscrito)');
        setMensagens([]);
        setError(null); // Não mostrar erro para situação normal
      } else {
        // Erro real que deve ser exibido
        console.error('💥 Erro real ao carregar mensagens:', errorMessage);
        setError(errorMessage);
        setMensagens([]);
      }} finally {
      setIsLoading(false);
    }
  }, [esporteId, isAuthenticated, user]);// Enviar nova mensagem
  const enviarMensagem = useCallback(async (conteudo: string) => {
    console.log('📤 useMensagens: Enviando mensagem', { esporteId, conteudo: conteudo?.substring(0, 50) + '...' });

    if (!isAuthenticated || !esporteId || !conteudo.trim()) {
      const motivo = !isAuthenticated ? 'não autenticado' : !esporteId ? 'sem esporteId' : 'conteúdo vazio';
      console.log('❌ useMensagens: Envio cancelado -', motivo);
      return;
    }
    
    try {
      const data: CreateMensagemData = {
        esporteId,
        texto: conteudo.trim() // Corrigido para enviar 'texto'
      };
      
      const novaMensagem = await mensagensService.enviarMensagem(data);
      console.log('✅ useMensagens: Mensagem enviada, atualizando lista');
      setMensagens(prev => [...prev, novaMensagem]);
      return novaMensagem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      
      // Silenciar erros de "não encontrado" 
      if (!errorMessage.includes('não encontrado')) {
        console.error('Erro ao enviar mensagem:', err);
        setError(errorMessage);
      }
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

  // Fixar/desfixar mensagem (apenas admin)
  const fixarMensagem = useCallback(async (mensagemId: string, fixada: boolean) => {
    if (!isAuthenticated || user?.role !== 'admin') return;
    
    try {
      const mensagemAtualizada = await mensagensService.fixarMensagem(mensagemId, !fixada);
      setMensagens(prev => prev.map(msg => 
        msg.id === mensagemId ? mensagemAtualizada : msg
      ));
    } catch (err) {
      console.error('Erro ao fixar mensagem:', err);
      setError(err instanceof Error ? err.message : 'Erro ao fixar mensagem');
      throw err;
    }
  }, [isAuthenticated, user?.role]);

  // Editar mensagem (próprio usuário ou admin)
  const editarMensagem = useCallback(async (mensagemId: string, texto: string) => {
    if (!isAuthenticated) return;
    
    try {
      const mensagemAtualizada = await mensagensService.editarMensagem(mensagemId, texto);
      setMensagens(prev => prev.map(msg => 
        msg.id === mensagemId ? mensagemAtualizada : msg
      ));
    } catch (err) {
      console.error('Erro ao editar mensagem:', err);
      setError(err instanceof Error ? err.message : 'Erro ao editar mensagem');
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
    // Limpar mensagens ao trocar de esporte
    setMensagens([]);
    setError(null);
    
    if (esporteId) {
      carregarMensagens();
    }
  }, [esporteId, carregarMensagens]);

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
    fixarMensagem,
    editarMensagem,
    carregarMensagens,
    podeExcluirMensagem,
    setError
  };
};

export default useMensagens;
