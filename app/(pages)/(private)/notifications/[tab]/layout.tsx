import Button from '@/_components/button';
import { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
}

const Layout = ({ children }: PageProps) => (
  <div className="px-4">
    <div className="my-16 flex h-8 items-center justify-between gap-8">
      <h1 className="text-2xl">Notifications</h1>
      <div className="grid w-full max-w-48 grid-cols-2 divide-x divide-alpha-3 rounded-sm border border-alpha-3">
        <Button
          activeClassName="text-fg-2 bg-alpha-1"
          className="m-0 justify-center rounded-l-sm py-1.5 hover:bg-alpha-1"
          href="/notifications/inbox"
          replace
          scroll={false}
          variant="link"
        >
          Inbox
        </Button>
        <Button
          activeClassName="text-fg-2 bg-alpha-1"
          className="m-0 justify-center rounded-r-sm py-1.5 hover:bg-alpha-1"
          href="/notifications/archive"
          replace
          scroll={false}
          variant="link"
        >
          Archive
        </Button>
      </div>
    </div>
    {children}
  </div>
);

export default Layout;
