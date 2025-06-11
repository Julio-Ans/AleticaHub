'use client';

import { useSearchParams } from 'next/navigation';
import { useState, Suspense } from 'react';

function PaymentContent() {
  const searchParams = useSearchParams();
  const pedidoId = searchParams.get('pedidoId');

  const [metodo, setMetodo] = useState<'pix' | 'dinheiro' | null>(null);
  const [chavePix, setChavePix] = useState<string | null>(null);
  const [pagamentoConfirmado, setPagamentoConfirmado] = useState(false);

  const gerarChavePix = () => {
    const chave = 'chave-pix-' + Math.floor(Math.random() * 1000000000);
    setChavePix(chave);
  };

  const escolherMetodo = (m: 'pix' | 'dinheiro') => {
    setMetodo(m);
    if (m === 'pix') gerarChavePix();
    else setChavePix(null);
  };

  const confirmarPagamento = async () => {
    try {
      await fetch(`/api/pedidos/${pedidoId}/payment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      setPagamentoConfirmado(true);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="bg-gray-900 p-4 border-b border-gray-800">
        <h1 className="text-xl font-bold text-red-500">PAGAMENTO</h1>
      </header>

      <main className="container mx-auto p-4 max-w-2xl">
        <div className="bg-gray-900 p-6 rounded-lg border border-gray-800">
          <h2 className="text-lg font-bold mb-6">FORMA DE PAGAMENTO</h2>

          {!metodo && (
            <div className="flex gap-4">
              <button onClick={() => escolherMetodo('pix')} className="bg-red-600 hover:bg-red-500 px-6 py-3 rounded font-bold">
                Pix
              </button>
              <button onClick={() => escolherMetodo('dinheiro')} className="bg-gray-600 hover:bg-gray-500 px-6 py-3 rounded font-bold">
                Dinheiro
              </button>
            </div>
          )}

          {metodo && (
            <div className="mt-4 space-y-4">
              <p className="text-gray-300">Método escolhido: <span className="font-bold text-red-400 uppercase">{metodo}</span></p>

              {metodo === 'pix' && chavePix && (
                <div>
                  <p className="text-sm text-gray-400 mb-1">Chave Pix gerada:</p>
                  <div className="bg-gray-800 p-2 rounded font-mono text-center">{chavePix}</div>
                </div>
              )}

              {!pagamentoConfirmado ? (
                <button onClick={confirmarPagamento} className="w-full bg-red-700 hover:bg-red-600 py-3 rounded font-bold mt-6">
                  CONFIRMAR PAGAMENTO
                </button>              ) : (
                <p className="text-green-500 text-center font-bold mt-4">Pagamento confirmado com sucesso!</p>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-900 text-white flex items-center justify-center">Carregando...</div>}>
      <PaymentContent />
    </Suspense>
  );
}
