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
        primeiraMensagem: data[0] ? {
          id: data[0].id,
          texto: data[0].texto,
          remetente: data[0].remetente,
          remetenteId: data[0].remetenteId,
          esporteId: data[0].esporteId,
          todasAsChaves: Object.keys(data[0]),
          estruturaCompleta: JSON.stringify(data[0], null, 2)
        } : 'Nenhuma mensagem',
        todasAsMensagens: data.map((msg, index) => ({
          index,
          id: msg.id,
          texto: msg.texto?.substring(0, 30) + '...',
          remetente: msg.remetente,
          remetenteId: msg.remetenteId,
          temNome: !!msg.remetente?.nome,
          nomeEncontrado: msg.remetente?.nome || 'SEM NOME'
        }))
      });
      
      // Ordenar mensagens por data (mais antigas primeiro)
      const mensagensOrdenadas = data.sort((a, b) => 
        new Date(a.criadaEm).getTime() - new Date(b.criadaEm).getTime()
      );
      setMensagens(mensagensOrdenadas);    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao carregar mensagens';
      console.error(`❌ Erro ao carregar mensagens para esporte ${esporteId}:`, {
        error: err,
        errorMessage,
        stack: err instanceof Error ? err.stack : 'no stack',
        esporteId,
        isChatGeral: esporteId === '0'
      });
      
      // Verificar se é erro de "sem mensagens" (404) - isso é normal
      if (errorMessage.includes('404') || errorMessage.includes('não encontrado')) {
        console.log('📝 Nenhuma mensagem encontrada para este esporte (normal)');
        setMensagens([]);
        setError(null); // Não mostrar erro para situação normal
      } else if (errorMessage.includes('403') || errorMessage.includes('Forbidden')) {
        console.log('🔒 Acesso negado para este esporte (usuário não inscrito)');
        setMensagens([]);
        setError('Você não tem permissão para acessar este chat. Verifique se está inscrito no esporte.');
      } else {
        // Erro real que deve ser exibido
        console.error('💥 Erro real ao carregar mensagens:', errorMessage);
        setError(errorMessage);
        setMensagens([]);
      }} finally {
      setIsLoading(false);
    }
  }, [esporteId, isAuthenticated, user]);  // Enviar nova mensagem
  const enviarMensagem = useCallback(async (conteudo: string) => {
    console.log('📤 useMensagens: Enviando mensagem', { 
      esporteId, 
      conteudo: conteudo?.substring(0, 50) + '...',
      isAuthenticated,
      temUser: !!user,
      userId: user?.id,
      userRole: user?.role
    });

    if (!isAuthenticated || !esporteId || !conteudo.trim()) {
      const motivo = !isAuthenticated ? 'não autenticado' : !esporteId ? 'sem esporteId' : 'conteúdo vazio';
      console.log('❌ useMensagens: Envio cancelado -', motivo);
      return;
    }
      try {      const data: CreateMensagemData = {
        esporteId,
        conteudo: conteudo.trim()
      };
      
      console.log('🌐 useMensagens: Dados sendo enviados para API:', data);
        const novaMensagem = await mensagensService.enviarMensagem(data);
      console.log('✅ useMensagens: Mensagem enviada, resposta da API:', {
        resultado: novaMensagem,
        estrutura: novaMensagem && typeof novaMensagem === 'object' ? Object.keys(novaMensagem) : 'not object',
        temId: !!(novaMensagem as Mensagem)?._id || !!(novaMensagem as Mensagem)?.id,
        conteudo: (novaMensagem as Mensagem)?.conteudo || (novaMensagem as Mensagem)?.texto,
        esporteIdResposta: (novaMensagem as Mensagem)?.esporteId,
        usuarioNome: (novaMensagem as Mensagem)?.usuarioNome
      });
      
      console.log('✅ useMensagens: Atualizando lista de mensagens');
      setMensagens(prev => [...prev, novaMensagem]);
      return novaMensagem;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao enviar mensagem';
      
      console.error('❌ useMensagens: Erro ao enviar mensagem:', {
        error: err,
        errorMessage,
        errorStack: err instanceof Error ? err.stack : 'No stack',
        esporteId,
        conteudo: conteudo?.substring(0, 50) + '...'
      });
      
      // Silenciar erros de "não encontrado" 
      if (!errorMessage.includes('não encontrado')) {
        setError(errorMessage);
      }
      throw err;
    }
  }, [esporteId, isAuthenticated, user]);
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
  }, [isAuthenticated, user?.role]);  // Editar mensagem (próprio usuário ou admin)
  const editarMensagem = useCallback(async (mensagemId: string, conteudo: string) => {
    if (!isAuthenticated) return;
    
    try {
      console.log('📝 useMensagens: Editando mensagem', { mensagemId, conteudo: conteudo.substring(0, 50) + '...' });
      
      const mensagemAtualizada = await mensagensService.editarMensagem(mensagemId, conteudo);
      
      console.log('✅ useMensagens: Mensagem editada, atualizando estado', {
        mensagemAtualizada,
        mensagemId,
        estruturaRetorno: mensagemAtualizada ? Object.keys(mensagemAtualizada) : 'null'
      });
      
      // Atualizar mensagem no estado local usando tanto id quanto _id para comparação
      setMensagens(prev => prev.map(msg => {
        const msgId = msg.id || msg._id;
        const isMatch = msgId === mensagemId;
        
        if (isMatch) {
          console.log('🔄 useMensagens: Substituindo mensagem no estado', {
            msgIdOriginal: msgId,
            mensagemIdBuscado: mensagemId,
            mensagemOriginal: msg,
            mensagemAtualizada
          });
        }
        
        return isMatch ? mensagemAtualizada : msg;
      }));
      
      console.log('✅ useMensagens: Estado das mensagens atualizado');
    } catch (err) {
      console.error('❌ useMensagens: Erro ao editar mensagem:', err);
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
