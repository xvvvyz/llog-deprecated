import PageModal from '@/_components/page-modal';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Template = ({ children }: LayoutProps) => (
  <PageModal className="fixed bottom-0 left-0 right-0 top-0 flex max-w-full flex-col rounded-none border-0">
    {children}
  </PageModal>
);

export default Template;
