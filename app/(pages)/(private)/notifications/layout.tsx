import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => (
  <>
    <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
      <h1 className="text-2xl">Notifications</h1>
    </div>
    {children}
  </>
);

export default Layout;
