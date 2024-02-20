import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
  modal: ReactNode;
}

const Layout = ({ children, modal }: LayoutProps) => (
  <>
    {children}
    {modal}
  </>
);

export default Layout;
