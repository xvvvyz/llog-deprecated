import Button from '@/_components/button';
import PageModalHeader from '@/_components/page-modal-header';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = async ({ children }: LayoutProps) => (
  <>
    <PageModalHeader title="Account settings" />
    <div className="!border-t-0 px-4 pb-8 sm:px-8">
      <div className="grid w-full grid-cols-3 divide-x divide-alpha-2 rounded border border-alpha-3">
        <Button
          activeClassName="text-fg-2 bg-alpha-2"
          colorScheme="transparent"
          className="rounded-r-none border-0"
          href="/account/profile"
          replace
          scroll={false}
        >
          Profile
        </Button>
        <Button
          activeClassName="text-fg-2 bg-alpha-2"
          colorScheme="transparent"
          className="rounded-none border-0"
          href="/account/email"
          replace
          scroll={false}
        >
          Email
        </Button>
        <Button
          activeClassName="text-fg-2 bg-alpha-2"
          colorScheme="transparent"
          className="rounded-l-none border-0"
          href="/account/password"
          replace
          scroll={false}
        >
          Password
        </Button>
      </div>
    </div>
    {children}
  </>
);

export default Layout;
