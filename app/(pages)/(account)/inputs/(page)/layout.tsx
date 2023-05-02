import Button from '(components)/button';
import Header from '(components)/header';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <>
    <Header>
      <h1 className="text-2xl">Inputs</h1>
      <Button href="/inputs/create" size="sm">
        Create input
      </Button>
    </Header>
    <main>{children}</main>
  </>
);

export default Layout;
