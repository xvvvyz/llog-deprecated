import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <>
    <h1 className="px-4 py-16 text-2xl">Inputs</h1>
    {children}
  </>
);

export default Layout;
