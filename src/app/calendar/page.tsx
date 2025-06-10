'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FaHome, FaCalendarAlt, FaClock, FaMapMarkerAlt, FaUsers, FaSpinner } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';
import { useEventos } from '@/hooks/useEventos';
import { useInscricoes } from '@/hooks/useInscricoes';

interface EventoCalendario {
  _id: string;
  titulo: string;
  data: string;
  local: string;
  tipo: string;
  esporte?: {
    nome: string;
  };
}

export default function CalendarPage() {
  const { isAuthenticated } = useAuth();
  const { meusEventos, isLoading: eventosLoading } = useEventos();
  const { minhasInscricoes } = useInscricoes();
  const [eventosCalendario, setEventosCalendario] = useState<EventoCalendario[]>([]);

  // Filtrar eventos baseado nas inscrições do usuário
  useEffect(() => {
    if (!isAuthenticated || !meusEventos || !minhasInscricoes) return;

    // Buscar IDs dos esportes em que o usuário está inscrito e aprovado
    const esportesAprovados = minhasInscricoes
      .filter(inscricao => inscricao.status === 'aceito')
      .map(inscricao => inscricao.esporteId);

    // Filtrar eventos: eventos gerais (esporteId === "0") OU eventos dos esportes inscritos
    const eventosFiltrados = meusEventos.filter(evento => 
      evento.esporteId === "0" || esportesAprovados.includes(evento.esporteId)
    );

    setEventosCalendario(eventosFiltrados);
  }, [isAuthenticated, meusEventos, minhasInscricoes]);

  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return {
      data: data.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      hora: data.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const formatarTipoEvento = (tipo: string, esporte?: { nome: string }) => {
    if (tipo === 'geral') return 'Evento Geral';
    if (tipo === 'treino' && esporte) return `Treino - ${esporte.nome}`;
    return tipo;
  };

  if (!isAuthenticated) {
    return (
      <div className="max-w-2xl mx-auto">
        <div className="mb-6">
          <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
            <FaHome />
            Voltar para Home
          </Link>
        </div>

        <div className="bg-yellow-900/20 border border-yellow-500 rounded-lg p-4">
          <p className="text-yellow-500">Você precisa fazer login para ver seu calendário de eventos.</p>
          <Link href="/login" className="text-yellow-400 hover:text-yellow-300 underline">
            Fazer Login
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold flex items-center gap-2">
          <FaCalendarAlt className="text-red-500" />
          Meu Calendário
        </h1>
        <div className="text-sm text-gray-400">
          {eventosCalendario.length} evento(s) encontrado(s)
        </div>
      </div>

      {eventosLoading ? (
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
          <FaSpinner className="animate-spin text-3xl text-red-500 mx-auto mb-4" />
          <p className="text-gray-400">Carregando seus eventos...</p>
        </div>
      ) : eventosCalendario.length === 0 ? (
        <div className="bg-gray-900 p-8 rounded-lg border border-gray-800 text-center">
          <FaCalendarAlt className="text-6xl text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-300 mb-2">Nenhum evento encontrado</h3>
          <p className="text-gray-400 mb-4">
            Você não possui eventos agendados. Inscreva-se em esportes para ver treinos e eventos.
          </p>
          <Link 
            href="/sports"
            className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            <FaUsers />
            Ver Esportes Disponíveis
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {eventosCalendario
            .sort((a, b) => new Date(a.data).getTime() - new Date(b.data).getTime())
            .map((evento) => {
              const { data, hora } = formatarData(evento.data);
              const tipoEvento = formatarTipoEvento(evento.tipo, evento.esporte);
              const isProximo = new Date(evento.data) >= new Date();              return (
                <div 
                  key={evento._id} 
                  className={`bg-gray-900 border rounded-lg p-6 transition-all duration-200 hover:border-red-500 ${
                    isProximo ? 'border-gray-700' : 'border-gray-800 opacity-75'
                  }`}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-white">{evento.titulo}</h3>
                        {!isProximo && (
                          <span className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded">
                            Finalizado
                          </span>
                        )}
                      </div>
                      
                      <p className="text-red-400 text-sm font-medium mb-2">{tipoEvento}</p>
                      
                      <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                        <div className="flex items-center gap-1">
                          <FaCalendarAlt />
                          <span>{data}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <FaClock />
                          <span>{hora}</span>
                        </div>
                        {evento.local && (
                          <div className="flex items-center gap-1">
                            <FaMapMarkerAlt />
                            <span>{evento.local}</span>
                          </div>
                        )}
                      </div>
                    </div>                    <div className="flex gap-2">
                      <Link
                        href={`/events/${evento._id}`}
                        className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm transition-colors"
                      >
                        Ver Detalhes
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}

          {/* Informação adicional */}
          <div className="bg-blue-900/20 border border-blue-500 rounded-lg p-4 mt-6">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-blue-400 font-semibold">💡 Dica</span>
            </div>
            <p className="text-blue-300 text-sm">
              Este calendário mostra eventos gerais e treinos dos esportes em que você está inscrito e aprovado.
              Para ver mais eventos, inscreva-se em novos esportes na{' '}
              <Link href="/sports" className="text-blue-200 underline hover:text-blue-100">
                página de esportes
              </Link>.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}