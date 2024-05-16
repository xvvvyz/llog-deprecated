import PageModal from '@/_components/page-modal';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Template = ({ children }: LayoutProps) => (
  <PageModal>{children}</PageModal>
);

export default Template;
