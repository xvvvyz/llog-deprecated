import Button from '@/_components/button';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => (
  <>
    <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
      <h1 className="text-2xl">Subjects</h1>
      <Button href="/subjects/create" scroll={false} size="sm">
        <PlusIcon className="-ml-0.5 w-5" />
        New subject
      </Button>
    </div>
    <div className="space-y-4">{children}</div>
  </>
);

export default Layout;
