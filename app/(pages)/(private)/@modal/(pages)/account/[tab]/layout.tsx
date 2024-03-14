import Button from '@/_components/button';
import PageModalHeader from '@/_components/page-modal-header';
import { ReactNode } from 'react';

interface PageProps {
  children: ReactNode;
}

const Layout = async ({ children }: PageProps) => (
  <>
    <PageModalHeader title="Account settings" />
    <div className="!border-t-0 px-4 pb-8 sm:px-8">
      <div className="grid w-full grid-cols-3 divide-x divide-alpha-3 rounded-sm border border-alpha-3">
        <Button
          activeClassName="text-fg-2 bg-alpha-1"
          className="m-0 justify-center rounded-l-sm py-1.5 hover:bg-alpha-1"
          href="/account/profile"
          replace
          scroll={false}
          variant="link"
        >
          Profile
        </Button>
        <Button
          activeClassName="text-fg-2 bg-alpha-1"
          className="m-0 justify-center py-1.5 hover:bg-alpha-1"
          href="/account/email"
          replace
          scroll={false}
          variant="link"
        >
          Email
        </Button>
        <Button
          activeClassName="text-fg-2 bg-alpha-1"
          className="m-0 justify-center rounded-r-sm py-1.5 hover:bg-alpha-1"
          href="/account/password"
          replace
          scroll={false}
          variant="link"
        >
          Password
        </Button>
      </div>
    </div>
    {children}
  </>
);

export default Layout;
