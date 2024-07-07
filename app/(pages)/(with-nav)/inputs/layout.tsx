import Button from '@/_components/button';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <>
    <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
      <h1 className="text-2xl">Inputs</h1>
      <Button href="/inputs/create" scroll={false} size="sm">
        <PlusIcon className="w-5" />
        New input
      </Button>
    </div>
    {children}
  </>
);

export default Layout;
