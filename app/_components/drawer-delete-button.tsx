'use client';

import Button from '@/_components/button';
import * as Drawer from '@/_components/drawer';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useTransition } from 'react';

interface AlertProps {
  confirmText: string;
  onConfirm?: () => void;
}

const DrawerDeleteButton = ({ confirmText, onConfirm }: AlertProps) => {
  const [isTransitioning, startTransition] = useTransition();

  return (
    <Drawer.NestedRoot>
      <Drawer.Trigger asChild>
        <Drawer.Button>
          <TrashIcon className="w-5 text-fg-4" />
          Delete
        </Drawer.Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title className="not-sr-only text-center text-2xl">
            Are you sure?
          </Drawer.Title>
          <div className="mt-16 flex flex-col-reverse gap-4">
            <Drawer.Close asChild>
              <Button
                className="m-0 -mb-3 w-full justify-center p-0 py-3"
                variant="link"
              >
                Cancel
              </Button>
            </Drawer.Close>
            <Button
              loading={isTransitioning}
              loadingText="Deleting…"
              onClick={() => startTransition(() => onConfirm?.())}
            >
              {confirmText}
            </Button>
          </div>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.NestedRoot>
  );
};

export default DrawerDeleteButton;
