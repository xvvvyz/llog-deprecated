'use client';

import Modal from '@/_components/modal';
import { useRouter } from 'next/navigation';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface PageModalProps {
  children: ReactNode;
  className?: string;
}

const PageModal = ({ children, className }: PageModalProps) => {
  const router = useRouter();

  return (
    <Modal
      className={twMerge(
        'relative w-full max-w-lg rounded border-y border-alpha-1 bg-bg-2 outline-none drop-shadow-2xl sm:border-x',
        className,
      )}
      onOpenChange={router.back}
      open
    >
      {children}
    </Modal>
  );
};

export default PageModal;
