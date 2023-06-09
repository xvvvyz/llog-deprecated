import Nav from '@/(account)/_components/nav';
import SupabaseProvider from '@/(account)/_components/supabase-provider';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => (
  <div className="mx-auto max-w-lg pb-20">
    <SupabaseProvider>
      <Nav />
      {children}
    </SupabaseProvider>
  </div>
);

export default Layout;
