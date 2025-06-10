'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { FaHome, FaComments } from 'react-icons/fa';

type Chat = {
  id: string;
  nome: string;
  ultimoConteudo?: string;
};

export default function ChatPage() {
  const [chats, setChats] = useState<Chat[]>([]);

  useEffect(() => {
    fetch('/api/chats')
      .then(res => res.json())
      .then(setChats)
      .catch(console.error);
  }, []);

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <Link href="/home" className="inline-flex items-center gap-2 text-red-500 hover:text-red-400">
          <FaHome />
          Voltar para Home
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-6 flex items-center gap-2">
        <FaComments />
        Chat
      </h1>

      {chats.length === 0 ? (
        <p className="text-gray-400">Nenhum grupo de chat disponível.</p>
      ) : (
        <div className="space-y-4 bg-gray-900 p-6 rounded-lg shadow border border-gray-800">
          {chats.map(chat => (
            <Link
              key={chat.id}
              href={`/chat/${chat.id}`}
              className="block p-4 border border-gray-800 rounded-lg hover:border-red-500 transition"
            >
              <h3 className="font-bold">{chat.nome}</h3>
              {chat.ultimoConteudo && (
                <p className="text-gray-400 text-sm truncate">{chat.ultimoConteudo}</p>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
