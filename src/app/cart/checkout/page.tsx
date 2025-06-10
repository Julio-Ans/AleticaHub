'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { FaHome, FaArrowLeft } from 'react-icons/fa';
import { useState } from 'react';

export default function CheckoutPage() {
  const [email, setEmail] = useState('');
  const [erro, setErro] = useState('');
  const router = useRouter();

  const finalizarCompra = async () => {
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentEmail: email }),
      });

      if (!res.ok) throw new Error('Erro ao finalizar compra');
      const data = await res.json();
      router.push(`/payment?pedidoId=${data.id}`);
    } catch (err) {
      console.error(err);
      setErro('Não foi possível finalizar a compra. Verifique seus dados.');
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <Link href="/cart" className="text-red-500 hover:text-red-400">
          <FaArrowLeft />
        </Link>
        Finalizar Compra
      </h1>

      <div className="bg-gray-900 p-6 rounded-lg shadow border border-gray-800">
        <label className="block text-gray-300 mb-2">E-mail do aluno</label>
        <input
          type="email"
          className="w-full p-3 bg-gray-800 border border-gray-700 rounded text-white mb-4"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        {erro && <p className="text-red-500 mb-4">{erro}</p>}

        <button
          onClick={finalizarCompra}
          className="w-full bg-red-700 hover:bg-red-600 text-white py-3 rounded font-bold"
        >
          Confirmar e Ir para Pagamento
        </button>
      </div>
    </div>
  );
}
