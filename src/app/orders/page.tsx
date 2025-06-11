'use client';

import { FaHome, FaSpinner, FaShoppingBag } from 'react-icons/fa';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { usePedidos } from '@/hooks/usePedidos';

export default function OrdersPage() {
  const { isAuthenticated } = useAuth();
  const { meusPedidos, isLoading: pedidosLoading } = usePedidos();

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaHome />
            Voltar para Home
          </Link>
        </div>
        <div className="bg-gray-900 p-6 rounded-lg text-center">
          <p className="text-gray-400 mb-4">Você precisa estar logado para ver seus pedidos.</p>
          <Link href="/login" className="text-red-500 hover:text-red-400 underline">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  // Função para formatar status dos pedidos
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pendente': return 'bg-yellow-500 text-black';
      case 'processando': return 'bg-blue-500 text-white';
      case 'entregue': return 'bg-green-500 text-white';
      case 'cancelado': return 'bg-red-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const formatStatus = (status: string) => {
    switch (status) {
      case 'pendente': return 'Pendente';
      case 'processando': return 'Processando';
      case 'entregue': return 'Entregue';
      case 'cancelado': return 'Cancelado';
      default: return status;
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <div className="bg-gray-900 rounded-lg border border-gray-800 p-6">
        <h1 className="text-3xl font-bold text-white mb-6 flex items-center gap-2">
          <FaShoppingBag className="text-red-500" />
          Meus Pedidos
        </h1>

        {pedidosLoading ? (
          <div className="text-center py-8">
            <FaSpinner className="animate-spin text-3xl text-red-500 mx-auto mb-4" />
            <p className="text-gray-400">Carregando pedidos...</p>
          </div>
        ) : meusPedidos.length === 0 ? (
          <div className="text-center py-8">
            <FaShoppingBag className="text-gray-500 text-5xl mx-auto mb-4" />
            <p className="text-gray-400 mb-4">Você ainda não fez nenhum pedido.</p>
            <Link 
              href="/shop" 
              className="text-red-500 hover:text-red-400 underline"
            >
              Ir às compras
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {meusPedidos.map((pedido) => (
              <div key={pedido.id} className="bg-gray-800 p-4 rounded-lg border border-gray-700">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-white font-semibold">Pedido #{pedido.id}</h3>
                    <p className="text-gray-400 text-sm">
                      {new Date(pedido.criadoEm).toLocaleDateString('pt-BR')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(pedido.status)}`}>
                      {formatStatus(pedido.status)}
                    </span>
                    <p className="text-white font-bold mt-1">
                      R$ {pedido.total.toFixed(2)}
                    </p>
                  </div>
                </div>

                {pedido.itens && pedido.itens.length > 0 && (
                  <div className="border-t border-gray-700 pt-3">
                    <h4 className="text-gray-300 text-sm font-medium mb-2">Itens:</h4>
                    <div className="space-y-1">
                      {pedido.itens.map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                          <span className="text-gray-400">
                            {item.nome} (x{item.quantidade})
                          </span>
                          <span className="text-gray-300">
                            R$ {item.subtotal.toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {pedido.status === 'pendente' && (
                  <div className="mt-3 p-3 bg-yellow-900/20 border border-yellow-500 rounded">
                    <p className="text-yellow-400 text-sm">
                      ⏳ Seu pedido está aguardando confirmação do administrador.
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
