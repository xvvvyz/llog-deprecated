import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <main className="mx-auto flex min-h-full max-w-lg flex-col items-center justify-center gap-9 px-6 py-12">
    {children}
  </main>
);

export default Layout;
