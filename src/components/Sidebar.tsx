'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { FaHome, FaStore, FaCalendarAlt, FaComments, FaUserShield, FaRunning, FaCalendar, FaSignOutAlt, FaShoppingBag } from 'react-icons/fa';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();

  if (isLoading) return null;
  if (!user) return null;

  const handleLogout = async () => {
    try {
      await logout();
      router.push('/');
    } catch (error) {
      console.error('Erro ao fazer logout:', error);
    }
  };

  const isActive = (path: string) =>
    pathname.startsWith(path) ? 'text-white font-bold bg-red-900' : 'text-red-200 hover:text-white hover:bg-red-700';
  const menuItems = [
    { href: '/home', icon: FaHome, label: 'Home' },
    { href: '/sports', icon: FaRunning, label: 'Esportes' },
    { href: '/events', icon: FaCalendarAlt, label: 'Eventos' },
    { href: '/shop', icon: FaStore, label: 'Loja' },
    { href: '/chat', icon: FaComments, label: 'Chat' },
    { href: '/calendar', icon: FaCalendar, label: 'Meu Calendário' },
    { href: '/orders', icon: FaShoppingBag, label: 'Meus Pedidos' },
  ];

  const adminMenuItems = [
    { href: '/admin-dashboard', icon: FaUserShield, label: 'Dashboard Admin' },
    { href: '/admin-dashboard/loja', icon: FaStore, label: 'Gerenciar Loja' },
    { href: '/admin-dashboard/eventos', icon: FaCalendarAlt, label: 'Gerenciar Eventos' },
    { href: '/admin-dashboard/usuarios', icon: FaUserShield, label: 'Gerenciar Usuários' },
    { href: '/admin-dashboard/esportes', icon: FaRunning, label: 'Gerenciar Esportes' },
  ];

  return (
    <div className="w-64 fixed h-full bg-red-800 shadow-lg z-10">
      <div className="p-6 border-b border-red-900">
        <Link href="/home">
          <h1 className="text-xl font-bold text-white cursor-pointer hover:text-red-200">
            AtleticaHub
          </h1>
        </Link>
        <p className="text-red-200 capitalize mt-1">
          {user.role === 'admin' ? 'Administrador' : 'Aluno'}
        </p>
        <Link
          href="/profile"
          className="text-white font-medium mt-2 inline-block hover:text-red-200 text-sm"
        >
          Editar perfil
        </Link>
      </div>

      <nav className="p-4 flex-1 overflow-y-auto">
        <ul className="space-y-2">
          {/* Menu comum para todos */}
          {menuItems.map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${isActive(item.href)}`}
              >
                <item.icon size={18} />
                {item.label}
              </Link>
            </li>
          ))}

          {/* Menu específico para admin */}
          {user.role === 'admin' && (
            <>
              <li className="pt-4">
                <div className="border-t border-red-700 mb-4"></div>
                <h3 className="text-red-300 font-semibold text-sm uppercase tracking-wide px-3 mb-2">
                  Administração
                </h3>
              </li>
              {adminMenuItems.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`flex items-center gap-3 px-3 py-2 rounded transition-colors ${isActive(item.href)}`}
                  >
                    <item.icon size={18} />
                    {item.label}
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>
      </nav>

      {/* Botão de sair */}
      <div className="p-4 border-t border-red-900">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2 text-red-200 hover:text-white hover:bg-red-700 rounded transition-colors"
        >
          <FaSignOutAlt size={18} />
          Sair
        </button>
      </div>
    </div>
  );
}
