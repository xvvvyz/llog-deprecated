'use client';

import Button from '@/_components/button';
import { Dialog } from '@headlessui/react';
import { ReactNode } from 'react';

interface AlertProps {
  cancelText?: string;
  confirmText: string;
  description?: ReactNode;
  isConfirming?: boolean;
  isConfirmingText?: string;
  onConfirm?: () => void;
  title?: string;
  toggle: () => void;
  value: boolean;
}

const Alert = ({
  cancelText = 'Cancel',
  confirmText,
  description,
  isConfirming,
  isConfirmingText,
  onConfirm,
  title = 'Are you sure?',
  toggle,
  value,
}: AlertProps) => (
  <Dialog className="relative z-20" onClose={toggle} open={value}>
    <div className="fixed inset-0 bg-alpha-reverse-2 backdrop-blur-sm" />
    <div className="fixed inset-0 overflow-y-auto">
      <div className="flex min-h-full items-center justify-center">
        <Dialog.Panel className="w-full max-w-xs transform rounded border border-alpha-1 bg-bg-2 p-8 text-center shadow-lg transition-all">
          <Dialog.Title className="text-2xl">{title}</Dialog.Title>
          {description && (
            <Dialog.Description className="mt-2 text-fg-4">
              {description}
            </Dialog.Description>
          )}
          <div className="mt-16 flex flex-col-reverse gap-4">
            <Button
              className="m-0 -mb-3 w-full justify-center p-0 py-3"
              onClick={toggle}
              variant="link"
            >
              {cancelText}
            </Button>
            <Button
              className="w-full"
              loading={isConfirming}
              loadingText={isConfirmingText}
              onClick={onConfirm}
            >
              {confirmText}
            </Button>
          </div>
        </Dialog.Panel>
      </div>
    </div>
  </Dialog>
);

export default Alert;
