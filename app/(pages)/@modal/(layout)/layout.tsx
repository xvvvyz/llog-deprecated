'use client';

import * as Modal from '@/_components/modal';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const router = useRouter();

  return (
    <Modal.Root onOpenChange={router.back} open>
      <Modal.Overlay>{children}</Modal.Overlay>
    </Modal.Root>
  );
};

export default Layout;
