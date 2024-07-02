import PageModal from '@/_components/page-modal';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => (
  <PageModal className="max-w-4xl">{children}</PageModal>
);

export default Layout;
