'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { useAuthGuard } from '@/hooks/useAuthGuard';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Usuario } from '@/services/api/usuariosApi';
import { Trash2, UserCheck, UserX, Shield, ShieldOff, AlertCircle, Users, Clock, CheckCircle } from 'lucide-react';

export default function AdminUsuariosPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { usuarios, inscricoesPendentes, loading, error, aprovarUsuario, suspenderUsuario, promoverAdmin, rebaixarAdmin, excluirUsuario, aprovarInscricao, rejeitarInscricao } = useUsuarios();
  
  const [selectedUser, setSelectedUser] = useState<Usuario | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [filter, setFilter] = useState<'todos' | 'pendentes' | 'ativos' | 'suspensos' | 'admins'>('todos');

  // Verificar se o usuário é admin
  const isAdmin = useAuthGuard({ requiredRole: 'admin' });

  if (!isAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-white mb-2">Acesso Negado</h1>
          <p className="text-gray-400 mb-4">Você precisa ser administrador para acessar esta página.</p>
          <button
            onClick={() => router.push('/admin-dashboard')}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Voltar ao Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Filtrar usuários
  const filteredUsuarios = usuarios.filter(usuario => {
    switch (filter) {
      case 'pendentes':
        return usuario.status === 'pendente';
      case 'ativos':
        return usuario.status === 'ativo';
      case 'suspensos':
        return usuario.status === 'suspenso';
      case 'admins':
        return usuario.role === 'admin';
      default:
        return true;
    }
  });

  // Estatísticas
  const totalUsuarios = usuarios.length;
  const usuariosPendentes = usuarios.filter(u => u.status === 'pendente').length;
  const usuariosAtivos = usuarios.filter(u => u.status === 'ativo').length;
  const totalAdmins = usuarios.filter(u => u.role === 'admin').length;

  // Handlers
  const handleAction = async (action: string, userId: number) => {
    setActionLoading(`${action}-${userId}`);
    try {
      switch (action) {
        case 'aprovar':
          await aprovarUsuario(userId);
          break;
        case 'suspender':
          await suspenderUsuario(userId);
          break;
        case 'promover':
          await promoverAdmin(userId);
          break;
        case 'rebaixar':
          await rebaixarAdmin(userId);
          break;
      }
    } catch (error) {
      console.error(`Erro ao ${action} usuário:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    setActionLoading(`delete-${selectedUser.id}`);
    try {
      await excluirUsuario(selectedUser.id);
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    } finally {
      setActionLoading(null);
    }
  };  const handleInscricaoAction = async (action: 'aprovar' | 'rejeitar', inscricaoId: string) => {
    setActionLoading(`${action}-insc-${inscricaoId}`);
    try {
      if (action === 'aprovar') {
        await aprovarInscricao(inscricaoId);
      } else {
        await rejeitarInscricao(inscricaoId);
      }
    } catch (error) {
      console.error(`Erro ao ${action} inscrição:`, error);
    } finally {
      setActionLoading(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'ativo':
        return 'text-green-400';
      case 'pendente':
        return 'text-yellow-400';
      case 'suspenso':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getRoleColor = (role: string) => {
    return role === 'admin' ? 'text-purple-400' : 'text-blue-400';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Carregando usuários...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Gerenciar Usuários</h1>
              <p className="text-gray-400">Gerencie usuários, permissões e inscrições</p>
            </div>
            <button
              onClick={() => router.push('/admin-dashboard')}
              className="bg-gray-800 hover:bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-700"
            >
              Voltar ao Dashboard
            </button>
          </div>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Total de Usuários</p>
                <p className="text-2xl font-bold text-white">{totalUsuarios}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <Clock className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Pendentes</p>
                <p className="text-2xl font-bold text-white">{usuariosPendentes}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <CheckCircle className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Ativos</p>
                <p className="text-2xl font-bold text-white">{usuariosAtivos}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-6">
            <div className="flex items-center">
              <Shield className="w-8 h-8 text-red-500 mr-3" />
              <div>
                <p className="text-sm text-gray-400">Administradores</p>
                <p className="text-2xl font-bold text-white">{totalAdmins}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filtros */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {[
              { key: 'todos', label: 'Todos' },
              { key: 'pendentes', label: 'Pendentes' },
              { key: 'ativos', label: 'Ativos' },
              { key: 'suspensos', label: 'Suspensos' },
              { key: 'admins', label: 'Administradores' }            ].map(({ key, label }) => (
              <button
                key={key}
                onClick={() => setFilter(key as 'todos' | 'pendentes' | 'ativos' | 'suspensos' | 'admins')}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  filter === key
                    ? 'bg-red-600 border-red-600 text-white'
                    : 'bg-gray-800 border-gray-700 text-gray-300 hover:bg-gray-700'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Lista de Usuários */}
        {error && (
          <div className="bg-red-900/20 border border-red-900/50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
              <p className="text-red-400">{error}</p>
            </div>
          </div>
        )}

        {filteredUsuarios.length === 0 ? (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg">Nenhum usuário encontrado</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredUsuarios.map(usuario => (
              <div key={usuario.id} className="bg-gray-800 border border-gray-700 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-white">{usuario.nome}</h3>
                      <span className={`text-sm font-medium ${getStatusColor(usuario.status)}`}>
                        {usuario.status.toUpperCase()}
                      </span>
                      <span className={`text-sm font-medium ${getRoleColor(usuario.role)}`}>
                        {usuario.role === 'admin' ? 'ADMIN' : 'USUÁRIO'}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-400">
                      <div>
                        <strong>Email:</strong> {usuario.email}
                      </div>
                      {usuario.telefone && (
                        <div>
                          <strong>Telefone:</strong> {usuario.telefone}
                        </div>
                      )}
                      {usuario.curso && (
                        <div>
                          <strong>Curso:</strong> {usuario.curso}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Ações */}
                  <div className="flex items-center gap-2">
                    {usuario.status === 'pendente' && (
                      <button
                        onClick={() => handleAction('aprovar', usuario.id)}
                        disabled={actionLoading === `aprovar-${usuario.id}`}
                        className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <UserCheck className="w-4 h-4" />
                        {actionLoading === `aprovar-${usuario.id}` ? 'Aprovando...' : 'Aprovar'}
                      </button>
                    )}
                    
                    {usuario.status === 'ativo' && (
                      <button
                        onClick={() => handleAction('suspender', usuario.id)}
                        disabled={actionLoading === `suspender-${usuario.id}`}
                        className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <UserX className="w-4 h-4" />
                        {actionLoading === `suspender-${usuario.id}` ? 'Suspendendo...' : 'Suspender'}
                      </button>
                    )}

                    {usuario.role === 'user' && (
                      <button
                        onClick={() => handleAction('promover', usuario.id)}
                        disabled={actionLoading === `promover-${usuario.id}`}
                        className="bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <Shield className="w-4 h-4" />
                        {actionLoading === `promover-${usuario.id}` ? 'Promovendo...' : 'Promover'}
                      </button>
                    )}

                    {usuario.role === 'admin' && usuario.uid !== user?.id && (
                      <button
                        onClick={() => handleAction('rebaixar', usuario.id)}
                        disabled={actionLoading === `rebaixar-${usuario.id}`}
                        className="bg-gray-600 hover:bg-gray-700 disabled:opacity-50 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <ShieldOff className="w-4 h-4" />
                        {actionLoading === `rebaixar-${usuario.id}` ? 'Rebaixando...' : 'Rebaixar'}
                      </button>
                    )}                    {usuario.uid !== user?.id && (
                      <button
                        onClick={() => {
                          setSelectedUser(usuario);
                          setShowDeleteModal(true);
                        }}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm flex items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" />
                        Excluir
                      </button>
                    )}
                  </div>
                </div>

                {/* Inscrições Pendentes */}
                {inscricoesPendentes[usuario.id] && inscricoesPendentes[usuario.id].length > 0 && (
                  <div className="mt-4 p-4 bg-gray-700 rounded-lg">
                    <h4 className="text-sm font-semibold text-yellow-400 mb-3">Inscrições Pendentes</h4>
                    <div className="space-y-2">
                      {inscricoesPendentes[usuario.id].map(inscricao => (
                        <div key={inscricao.id} className="flex items-center justify-between bg-gray-800 p-3 rounded">
                          <div>
                            <span className="text-white font-medium">
                              {inscricao.esporte?.nome || 'Esporte desconhecido'}
                            </span>                            <span className="text-gray-400 text-sm ml-2">
                              - {new Date(inscricao.criadaEm).toLocaleDateString()}
                            </span>
                          </div>
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleInscricaoAction('aprovar', inscricao.id)}
                              disabled={actionLoading === `aprovar-insc-${inscricao.id}`}
                              className="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white px-2 py-1 rounded text-xs"
                            >
                              {actionLoading === `aprovar-insc-${inscricao.id}` ? 'Aprovando...' : 'Aprovar'}
                            </button>
                            <button
                              onClick={() => handleInscricaoAction('rejeitar', inscricao.id)}
                              disabled={actionLoading === `rejeitar-insc-${inscricao.id}`}
                              className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-2 py-1 rounded text-xs"
                            >
                              {actionLoading === `rejeitar-insc-${inscricao.id}` ? 'Rejeitando...' : 'Rejeitar'}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Modal de Confirmação de Exclusão */}
        {showDeleteModal && selectedUser && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-gray-800 border border-gray-700 rounded-lg p-6 max-w-md w-full">
              <div className="flex items-center mb-4">
                <AlertCircle className="w-6 h-6 text-red-500 mr-2" />
                <h3 className="text-lg font-semibold text-white">Confirmar Exclusão</h3>
              </div>
              
              <p className="text-gray-300 mb-6">
                Tem certeza que deseja excluir o usuário <strong>{selectedUser.nome}</strong>? 
                Esta ação não pode ser desfeita.
              </p>
              
              <div className="flex justify-end gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setSelectedUser(null);
                  }}
                  className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={actionLoading === `delete-${selectedUser.id}`}
                  className="bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white px-4 py-2 rounded-lg"
                >
                  {actionLoading === `delete-${selectedUser.id}` ? 'Excluindo...' : 'Excluir'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
