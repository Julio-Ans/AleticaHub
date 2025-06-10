// useUsuarios Hook - Gerenciamento de estado para usuários

import { useState, useEffect, useCallback } from 'react';
import { usuariosService, Usuario, UpdateUsuarioData } from '../services/api/usuariosApi';
import { inscricoesService, Inscricao } from '../services/api/inscricoesApi';

interface UseUsuariosReturn {
  usuarios: Usuario[];
  inscricoesPendentes: Record<number, Inscricao[]>;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
  atualizarUsuario: (id: number, data: UpdateUsuarioData) => Promise<void>;
  excluirUsuario: (id: number) => Promise<void>;
  aprovarUsuario: (id: number) => Promise<void>;
  suspenderUsuario: (id: number) => Promise<void>;
  promoverAdmin: (id: number) => Promise<void>;
  rebaixarAdmin: (id: number) => Promise<void>;
  aprovarInscricao: (inscricaoId: string) => Promise<void>;
  rejeitarInscricao: (inscricaoId: string) => Promise<void>;
}

export const useUsuarios = (): UseUsuariosReturn => {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [inscricoesPendentes, setInscricoesPendentes] = useState<Record<number, Inscricao[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Buscar usuários
  const fetchUsuarios = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await usuariosService.listarUsuarios();
      setUsuarios(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao carregar usuários');
    } finally {
      setLoading(false);
    }
  }, []);

  // Buscar inscrições pendentes por usuário
  const fetchInscricoesPendentes = useCallback(async () => {
    try {
      // Buscar todas as inscrições para cada usuário (simulação)
      // Na implementação real, você pode ter um endpoint específico
      const inscricoesData: Record<number, Inscricao[]> = {};
      
      // Para cada usuário, buscar suas inscrições pendentes
      for (const usuario of usuarios) {
        try {
          const minhasInscricoes = await inscricoesService.minhasInscricoes();
          const pendentes = minhasInscricoes.filter(i => i.status === 'pendente');
          if (pendentes.length > 0) {
            inscricoesData[usuario.id] = pendentes;
          }
        } catch (err) {
          console.error(`Erro ao buscar inscrições do usuário ${usuario.id}:`, err);
        }
      }
      
      setInscricoesPendentes(inscricoesData);
    } catch (err) {
      console.error('Erro ao carregar inscrições pendentes:', err);
    }
  }, [usuarios]);

  // Refetch data
  const refetch = useCallback(async () => {
    await fetchUsuarios();
  }, [fetchUsuarios]);

  // Atualizar usuário
  const atualizarUsuario = useCallback(async (id: number, data: UpdateUsuarioData) => {
    try {
      setError(null);
      const response = await usuariosService.atualizarUsuario(id, data);
      
      // Atualizar estado local
      setUsuarios(prev => 
        prev.map(usuario => 
          usuario.id === id ? response.usuario : usuario
        )
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao atualizar usuário');
      throw err;
    }
  }, []);

  // Excluir usuário
  const excluirUsuario = useCallback(async (id: number) => {
    try {
      setError(null);
      await usuariosService.excluirUsuario(id);
      
      // Remover do estado local
      setUsuarios(prev => prev.filter(usuario => usuario.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao excluir usuário');
      throw err;
    }
  }, []);

  // Aprovar usuário
  const aprovarUsuario = useCallback(async (id: number) => {
    await atualizarUsuario(id, { status: 'ativo' });
  }, [atualizarUsuario]);

  // Suspender usuário
  const suspenderUsuario = useCallback(async (id: number) => {
    await atualizarUsuario(id, { status: 'suspenso' });
  }, [atualizarUsuario]);

  // Promover a admin
  const promoverAdmin = useCallback(async (id: number) => {
    await atualizarUsuario(id, { role: 'admin' });
  }, [atualizarUsuario]);

  // Rebaixar de admin
  const rebaixarAdmin = useCallback(async (id: number) => {
    await atualizarUsuario(id, { role: 'user' });
  }, [atualizarUsuario]);  // Aprovar inscrição
  const aprovarInscricao = useCallback(async (inscricaoId: string) => {
    try {
      setError(null);
      await inscricoesService.atualizarStatus(inscricaoId, 'aceito');
      
      // Atualizar estado local
      setInscricoesPendentes(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(userId => {
          updated[Number(userId)] = updated[Number(userId)].map(insc =>
            insc.id === inscricaoId ? { ...insc, status: 'aceito' as const } : insc
          ).filter(insc => insc.status === 'pendente'); // Remover aprovadas da lista
        });
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao aprovar inscrição');
      throw err;
    }
  }, []);

  // Rejeitar inscrição
  const rejeitarInscricao = useCallback(async (inscricaoId: string) => {
    try {
      setError(null);
      await inscricoesService.atualizarStatus(inscricaoId, 'rejeitado');
      
      // Atualizar estado local
      setInscricoesPendentes(prev => {
        const updated = { ...prev };
        Object.keys(updated).forEach(userId => {
          updated[Number(userId)] = updated[Number(userId)].map(insc =>
            insc.id === inscricaoId ? { ...insc, status: 'rejeitado' as const } : insc
          ).filter(insc => insc.status === 'pendente'); // Remover rejeitadas da lista
        });
        return updated;
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao rejeitar inscrição');
      throw err;
    }
  }, []);

  // Effects
  useEffect(() => {
    fetchUsuarios();
  }, [fetchUsuarios]);
  useEffect(() => {
    if (usuarios.length > 0) {
      fetchInscricoesPendentes();
    }
  }, [usuarios.length, fetchInscricoesPendentes]);

  return {
    usuarios,
    inscricoesPendentes,
    loading,
    error,
    refetch,
    atualizarUsuario,
    excluirUsuario,
    aprovarUsuario,
    suspenderUsuario,
    promoverAdmin,
    rebaixarAdmin,
    aprovarInscricao,
    rejeitarInscricao,
  };
};
