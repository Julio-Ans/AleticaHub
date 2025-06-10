'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect } from 'react';
// import { useAuth } from '@/context/AuthContext';
import { useEsportes } from '@/hooks/useEsportes';
import { ArrowLeft, MessageCircle, Users } from 'lucide-react';
import Link from 'next/link';

export default function ChatRedirectPage() {
  const { id } = useParams();
  const router = useRouter();
  // const { user } = useAuth(); // TODO: Implementar lógica de chat
  const { esportes, isLoading } = useEsportes();
    const esporteId = Array.isArray(id) ? id[0] : id;
  const esporte = esportes.find(e => e.id === esporteId);

  useEffect(() => {
    // Redirect to the sport detail page with chat anchor
    if (esporteId && !isLoading) {
      router.push(`/sports/${esporteId}#chat`);
    }
  }, [esporteId, isLoading, router]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-400">Redirecionando para o chat...</p>
        </div>
      </div>
    );
  }

  if (!esporte) {
    return (
      <div className="min-h-screen bg-gray-900 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <MessageCircle className="w-16 h-16 text-gray-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-white mb-2">Chat não encontrado</h1>
            <p className="text-gray-400 mb-6">O esporte solicitado não existe ou foi removido.</p>
            
            <Link
              href="/chat"
              className="bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-lg inline-flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para Chats
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // This component mainly serves as a redirect, but we'll show a loading state
  return (
    <div className="min-h-screen bg-gray-900 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <h1 className="text-2xl font-bold text-white mb-2">Acessando Chat</h1>
          <p className="text-gray-400 mb-4">
            Redirecionando para o chat do {esporte.nome}...
          </p>
          
          <div className="bg-gray-800 border border-gray-700 rounded-lg p-4 inline-block">
            <div className="flex items-center gap-3">
              <MessageCircle className="w-5 h-5 text-red-500" />
              <span className="text-white font-medium">{esporte.nome}</span>
              <div className="flex items-center gap-1 text-gray-400 text-sm">
                <Users className="w-4 h-4" />
                {esporte.inscricoes?.length || 0}
              </div>
            </div>
          </div>
          
          <div className="mt-6">
            <Link
              href={`/sports/${esporte.id}`}
              className="text-red-400 hover:text-red-300"
            >
              Clique aqui se o redirecionamento não funcionar
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
