import { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
}

const Layout = ({ children }: PageProps) => (
  <>
    <h1 className="px-4 py-16 text-2xl">Inbox</h1>
    {children}
  </>
);

export default Layout;
