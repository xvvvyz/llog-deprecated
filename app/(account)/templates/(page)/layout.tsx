import Button from '(components)/button';
import Header from '(components)/header';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <>
    <Header>
      <h1 className="text-2xl">Templates</h1>
      <Button href="/templates/add" size="sm">
        Add template
      </Button>
    </Header>
    <main>{children}</main>
  </>
);

export default Layout;
