import { ReactNode } from 'react';
import Nav from './(components)/nav';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <div className="mx-auto max-w-lg px-4 pt-8 pb-16 sm:pt-8">
    <Nav />
    {children}
  </div>
);

export default Layout;
