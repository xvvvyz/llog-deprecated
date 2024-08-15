'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import deleteInput from '@/_mutations/delete-input';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';

interface InputMenuProps {
  inputId: string;
}

const InputMenu = ({ inputId }: InputMenuProps) => (
  <DropdownMenu.Root
    trigger={
      <div className="group flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 active:text-fg-2">
        <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
          <EllipsisVerticalIcon className="w-5" />
        </div>
      </div>
    }
  >
    <DropdownMenu.Content className="-mt-[4.35rem] mr-1.5">
      <DropdownMenu.Button
        href={`/inputs/create/from-input/${inputId}`}
        scroll={false}
      >
        <DocumentDuplicateIcon className="w-5 text-fg-4" />
        Duplicate
      </DropdownMenu.Button>
      <DropdownMenuDeleteItem
        confirmText="Delete input"
        onConfirm={() => deleteInput(inputId)}
      />
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

export default InputMenu;
