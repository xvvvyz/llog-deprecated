import Button from '@/_components/button';
import { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
}

const Layout = ({ children }: PageProps) => (
  <div className="px-4">
    <div className="my-16 flex h-8 items-center justify-between gap-8">
      <h1 className="text-2xl">Notifications</h1>
      <div className="flex divide-x divide-alpha-2 rounded-sm border border-alpha-3">
        <Button
          activeClassName="text-fg-2 bg-alpha-2"
          colorScheme="transparent"
          className="rounded-r-none border-0"
          href="/notifications/inbox"
          replace
          scroll={false}
          size="sm"
        >
          Inbox
        </Button>
        <Button
          activeClassName="text-fg-2 bg-alpha-2"
          colorScheme="transparent"
          className="rounded-l-none border-0"
          href="/notifications/archive"
          replace
          scroll={false}
          size="sm"
        >
          Archive
        </Button>
      </div>
    </div>
    {children}
  </div>
);

export default Layout;
