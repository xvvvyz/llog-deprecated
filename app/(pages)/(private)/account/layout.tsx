import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => (
  <>
    <div className="my-16 h-8 px-4">
      <h1 className="text-2xl">Account settings</h1>
    </div>
    {children}
  </>
);

export default Layout;
