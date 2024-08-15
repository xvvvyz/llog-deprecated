'use client';

import Button from '@/_components/button';
import * as DropdownMenu from '@/_components/dropdown-menu';
import * as Modal from '@/_components/modal';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useTransition } from 'react';

interface AlertProps {
  confirmText: string;
  onConfirm?: () => void;
}

const DropdownMenuDeleteItem = ({ confirmText, onConfirm }: AlertProps) => {
  const [isTransitioning, startTransition] = useTransition();

  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <DropdownMenu.Button>
          <TrashIcon className="w-5 text-fg-4" />
          Delete
        </DropdownMenu.Button>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content className="max-w-xs p-8 text-center">
            <Modal.Title className="text-2xl">Are you sure?</Modal.Title>
            <div className="mt-16 flex flex-col-reverse gap-4">
              <Modal.Close asChild>
                <Button
                  className="m-0 -mb-3 w-full justify-center p-0 py-3"
                  variant="link"
                >
                  Close
                </Button>
              </Modal.Close>
              <Button
                className="w-full"
                loading={isTransitioning}
                loadingText="Deleting…"
                onClick={() => startTransition(() => onConfirm?.())}
              >
                {confirmText}
              </Button>
            </div>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
};

export default DropdownMenuDeleteItem;
