'use client';

import Button from '@/_components/button';
import { ReactNode, useTransition } from 'react';

import {
  Description,
  Dialog,
  DialogPanel,
  DialogTitle,
} from '@headlessui/react';

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
    <Dialog onClose={onClose} open={isOpen}>
      <div className="fixed inset-0 z-20 bg-alpha-reverse-1 backdrop-blur-sm" />
      <div className="fixed inset-0 z-30 overflow-y-auto p-4">
        <div className="flex min-h-full items-center justify-center">
          <DialogPanel className="w-full max-w-xs rounded border border-alpha-1 bg-bg-2 p-8 text-center drop-shadow">
            <DialogTitle className="text-2xl">{title}</DialogTitle>
            {description && (
              <Description className="mt-2 text-fg-4">
                {description}
              </Description>
            )}
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
          </DialogPanel>
        </div>
      </div>
    </Dialog>
  );
};

export default Alert;
