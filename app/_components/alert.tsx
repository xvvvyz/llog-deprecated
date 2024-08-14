'use client';

import Button from '@/_components/button';
import Modal from '@/_components/modal';
import { ReactNode, useTransition } from 'react';

interface AlertProps {
  cancelText?: string;
  confirmText: string;
  description?: ReactNode;
  isConfirmingText?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm?: () => void;
  title?: string;
}

const Alert = ({
  cancelText = 'Close',
  confirmText,
  description,
  isConfirmingText,
  isOpen,
  onClose,
  onConfirm,
  title = 'Are you sure?',
}: AlertProps) => {
  const [isTransitioning, startTransition] = useTransition();

  return (
    <Modal
      className="max-w-xs p-8 text-center"
      onOpenChange={onClose}
      open={isOpen}
    >
      <h1 className="text-2xl">{title}</h1>
      {description && <p className="mt-2 text-fg-4">{description}</p>}
      <div className="mt-16 flex flex-col-reverse gap-4">
        <Button
          className="m-0 -mb-3 w-full justify-center p-0 py-3"
          onClick={onClose}
          variant="link"
        >
          {cancelText}
        </Button>
        <Button
          className="w-full"
          loading={isTransitioning}
          loadingText={isConfirmingText}
          onClick={() => startTransition(() => onConfirm?.())}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default Alert;
