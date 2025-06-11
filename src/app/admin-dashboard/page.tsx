'use client';

import Link from 'next/link';
import { useState } from 'react';
import { FaUsers, FaCalendarAlt, FaRunning, FaChartBar, FaHome, FaComments, FaStore } from 'react-icons/fa';
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

  const handleTestApi = async () => {
    console.log('=== API CONNECTIVITY TEST ===');
    await testApiConnectivity();
    console.log('=== END TEST ===');
  };

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
    <div className="max-w-6xl mx-auto">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <div>
            <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400 mb-4">
              <FaHome className="text-red-500" />
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
              className="bg-black-300 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
            >
              <FaComments className="text-red-500" />
              Mensagens
            </button>
          </div>
        </div>
      </div>

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
              <p className="text-2xl font-bold text-red-500">{eventos.length}</p>
            </div>
            <FaCalendarAlt className="text-red-500 text-2xl" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Inscrições Pendentes</p>
              <p className="text-2xl font-bold text-red-500">{pendingInscricoes.length}</p>
            </div>
            <FaUsers className="text-red-500 text-2xl" />
          </div>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-lg p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">Total de Inscrições</p>
              <p className="text-2xl font-bold text-red-500">{minhasInscricoes.length}</p>
            </div>
            <FaChartBar className="text-red-500 text-2xl" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Link href="/admin-dashboard/esportes" className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500 transition">
          <div className="flex items-center gap-4 mb-4">
            <FaRunning className="text-red-500 text-2xl" />
            <h2 className="font-bold text-lg text-red-500">Gerenciar Esportes</h2>
          </div>
          <p className="text-gray-400">Cadastrar esportes, editar informações e acompanhar inscrições dos participantes.</p>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>{esportes.length} esporte(s) cadastrado(s)</span>
            <span className="text-red-400">Gerenciar →</span>
          </div>
        </Link>

        <Link href="/admin-dashboard/eventos" className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500 transition">
          <div className="flex items-center gap-4 mb-4">
            <FaCalendarAlt className="text-red-500 text-2xl" />
            <h2 className="font-bold text-lg text-red-500">Gerenciar Eventos</h2>
          </div>
          <p className="text-gray-400">Criar eventos, definir datas, locais e acompanhar as inscrições dos participantes.</p>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>{eventos.length} evento(s) criado(s)</span>
            <span className="text-red-400">Gerenciar →</span>
          </div>
        </Link>

        <Link href="/admin-dashboard/usuarios" className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500 transition">
          <div className="flex items-center gap-4 mb-4">
            <FaUsers className="text-red-500 text-2xl" />
            <h2 className="font-bold text-lg text-red-500">Gerenciar Usuários</h2>
          </div>
          <p className="text-gray-400">Aceitar cadastros, gerenciar permissões e aprovar inscrições em esportes.</p>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>{pendingInscricoes.length} inscrição(ões) pendente(s)</span>
            <span className="text-red-400">Gerenciar →</span>
          </div>
        </Link>

        <Link href="/admin-dashboard/loja" className="block bg-gray-900 border border-gray-800 rounded-lg p-6 hover:border-red-500 transition">
          <div className="flex items-center gap-4 mb-4">
            <FaStore className="text-red-500 text-2xl" />
            <h2 className="font-bold text-lg text-red-500">Gerenciar Loja</h2>
          </div>
          <p className="text-gray-400">Criar, editar produtos e acompanhar as vendas realizadas no sistema.</p>
          <div className="mt-4 flex justify-between text-sm text-gray-500">
            <span>Produtos e pedidos</span>
            <span className="text-red-400">Gerenciar →</span>
          </div>
        </Link>
      </div>

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
          </Link>
        </div>
      )}

      <ModalMensagens
        isOpen={isModalMensagensOpen}
        onClose={() => setIsModalMensagensOpen(false)}
        esportes={esportes}
      />

    </div>
  );
}
