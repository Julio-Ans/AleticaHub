'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaUsers, FaCalendarAlt, FaRunning, FaChartBar, FaHome, FaComments } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useEsportes } from '@/hooks/useEsportes';
import { useEventos } from '@/hooks/useEventos';
import { useInscricoes } from '@/hooks/useInscricoes';
import ModalMensagens from '@/components/ModalMensagens';
import ModalEsportes from '@/components/ModalEsportes';
import { testApiConnectivity } from '@/utils/testApi';

export default function AdminDashboardHome() {  
  const { user } = useAuth();  const { esportes } = useEsportes();
  const { eventos } = useEventos();
  const { minhasInscricoes } = useInscricoes();
  const [isModalMensagensOpen, setIsModalMensagensOpen] = useState(false);
  const [isModalEsportesOpen, setIsModalEsportesOpen] = useState(false);

  // Debug function
  const handleTestApi = async () => {
    console.log('=== API CONNECTIVITY TEST ===');
    await testApiConnectivity();
    console.log('=== END TEST ===');
  };

  // Redirect if not admin
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="bg-red-900 border border-red-600 text-red-200 px-4 py-3 rounded">
          Acesso negado. Você precisa ser um administrador para acessar esta página.
        </div>
      </div>
    );
  }

  const pendingInscricoes = minhasInscricoes.filter((i: { status: string }) => i.status === 'pendente');

  return (
    <div className="max-w-6xl mx-auto">      <div className="mb-6">        <div className="flex justify-between items-center">
          <div>
            <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 mb-4">
              <FaHome />
              Voltar para Home
            </Link>
            <h1 className="text-3xl font-bold mb-2">Painel do Administrador</h1>
            <p className="text-gray-400">Bem-vindo, {user.nome}. Gerencie o sistema AtleticaHub.</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleTestApi}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
            >
              Test API
            </button>
            <button
              onClick={() => setIsModalMensagensOpen(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaComments />
              Mensagens
            </button>
          </div>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Esportes</p>
              <p className="text-2xl font-bold text-red-500">{esportes.length}</p>
            </div>
            <FaRunning className="text-red-500 text-2xl" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Eventos</p>
              <p className="text-2xl font-bold text-blue-500">{eventos.length}</p>
            </div>
            <FaCalendarAlt className="text-blue-500 text-2xl" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Inscrições Pendentes</p>
              <p className="text-2xl font-bold text-yellow-500">{pendingInscricoes.length}</p>
            </div>
            <FaUsers className="text-yellow-500 text-2xl" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Inscrições</p>
              <p className="text-2xl font-bold text-green-500">{minhasInscricoes.length}</p>
            </div>
            <FaChartBar className="text-green-500 text-2xl" />
          </div>
        </div>
      </div>      {/* Management Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setIsModalEsportesOpen(true)}
          className="text-left bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500 transition-colors w-full"
        >
          <div className="flex items-center gap-4 mb-4">
            <FaRunning className="text-red-500 text-2xl" />
            <h2 className="font-bold text-lg text-red-500">Gerenciar Esportes</h2>
          </div>
          <p className="text-gray-400">Cadastrar esportes, editar informações e acompanhar inscrições dos participantes.</p>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>{esportes.length} esporte(s) cadastrado(s)</span>
            <span className="text-red-400">Gerenciar →</span>
          </div>
        </button>

        <Link href="/admin-dashboard/eventos" className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-blue-500 transition">
          <div className="flex items-center gap-4 mb-4">
            <FaCalendarAlt className="text-blue-500 text-2xl" />
            <h2 className="font-bold text-lg text-blue-500">Gerenciar Eventos</h2>
          </div>
          <p className="text-gray-400">Criar eventos, definir datas, locais e acompanhar as inscrições dos participantes.</p>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>{eventos.length} evento(s) criado(s)</span>
            <span className="text-blue-400">Gerenciar →</span>
          </div>
        </Link>

        <Link href="/admin-dashboard/usuarios" className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-green-500 transition">
          <div className="flex items-center gap-4 mb-4">
            <FaUsers className="text-green-500 text-2xl" />
            <h2 className="font-bold text-lg text-green-500">Gerenciar Usuários</h2>
          </div>
          <p className="text-gray-400">Aceitar cadastros, gerenciar permissões e aprovar inscrições em esportes.</p>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>{pendingInscricoes.length} inscrição(ões) pendente(s)</span>
            <span className="text-green-400">Gerenciar →</span>
          </div>
        </Link>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6 opacity-50">
          <div className="flex items-center gap-4 mb-4">
            <FaChartBar className="text-gray-500 text-2xl" />
            <h2 className="font-bold text-lg text-gray-500">Relatórios</h2>
          </div>
          <p className="text-gray-400">Visualizar estatísticas detalhadas e gerar relatórios do sistema.</p>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>Em desenvolvimento</span>
            <span>Em breve →</span>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      {pendingInscricoes.length > 0 && (
        <div className="mt-8 bg-yellow-900 border border-yellow-600 rounded-lg p-6">
          <h3 className="font-bold text-lg text-yellow-400 mb-4">Ações Requeridas</h3>
          <p className="text-yellow-200 mb-4">
            Você tem {pendingInscricoes.length} inscrição(ões) pendente(s) aguardando aprovação.
          </p>
          <Link 
            href="/admin-dashboard/usuarios"
            className="bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded font-medium"
          >
            Revisar Inscrições
          </Link>        </div>
      )}      
      <ModalMensagens
        isOpen={isModalMensagensOpen}
        onClose={() => setIsModalMensagensOpen(false)}
        esportes={esportes}
      />
      
      <ModalEsportes
        isOpen={isModalEsportesOpen}
        onClose={() => setIsModalEsportesOpen(false)}
      />
    </div>
  );
}
