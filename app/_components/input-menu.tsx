'use client';

import * as Drawer from '@/_components/drawer';
import DrawerDeleteButton from '@/_components/drawer-delete-button';
import deleteInput from '@/_mutations/delete-input';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';

interface InputMenuProps {
  inputId: string;
}

const InputMenu = ({ inputId }: InputMenuProps) => (
  <Drawer.Root>
    <Drawer.Trigger>
      <div className="group flex items-center justify-center px-2 text-fg-3 transition-colors hover:text-fg-2">
        <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
          <EllipsisVerticalIcon className="w-5" />
        </div>
      </div>
    </Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Title>Input menu</Drawer.Title>
        <Drawer.Description />
        <Drawer.Button href={`/inputs/create/from-input/${inputId}`}>
          <DocumentDuplicateIcon className="w-5 text-fg-4" />
          Duplicate
        </Drawer.Button>
        <DrawerDeleteButton
          confirmText="Delete input"
          onConfirm={() => deleteInput(inputId)}
        />
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
);

export default InputMenu;
