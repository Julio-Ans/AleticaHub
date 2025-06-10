'use client';

import { usePathname } from 'next/navigation';
import Sidebar from '@/components/Sidebar';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

export default function LayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideSidebarRoutes = ['/', '/login', '/register', '/home'];
  const shouldShowSidebar = !hideSidebarRoutes.includes(pathname);

  return (
    <AuthProvider>
      <CartProvider>
        {shouldShowSidebar && <Sidebar />}
        <main className={shouldShowSidebar ? 'flex-1 p-8 ml-64' : 'w-full p-4'}>
          {children}
        </main>
      </CartProvider>
    </AuthProvider>
  );
}
