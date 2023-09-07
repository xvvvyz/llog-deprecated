import Button from '@/_components/button';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => (
  <>
    <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
      <h1 className="text-2xl">Inputs</h1>
      <Button href="/inputs/create" size="sm">
        Create input
      </Button>
    </div>
    {children}
  </>
);

export default Layout;
