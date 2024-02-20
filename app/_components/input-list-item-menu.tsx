'use client';

import deleteInput from '@/_actions/delete-input';
import Alert from '@/_components/alert';
import Menu from '@/_components/menu';
import MenuButton from '@/_components/menu-button';
import MenuItem from '@/_components/menu-item';
import MenuItems from '@/_components/menu-items';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';

interface InputListItemMenuProps {
  inputId: string;
}

const InputListItemMenu = ({ inputId }: InputListItemMenuProps) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);

  return (
    <>
      <Alert
        confirmText="Delete input"
        isConfirmingText="Deleting…"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={() => deleteInput(inputId)}
      />
      <Menu className="shrink-0">
        <MenuButton className="group flex h-full items-center justify-center px-2 text-fg-3 hover:text-fg-2">
          <div className="rounded-full p-2 group-hover:bg-alpha-1">
            <EllipsisVerticalIcon className="w-5" />
          </div>
        </MenuButton>
        <MenuItems className="mr-2 mt-2">
          <MenuItem
            href={`/inputs/create/from-input/${inputId}?back=/inputs`}
            scroll={false}
          >
            <DocumentDuplicateIcon className="w-5 text-fg-4" />
            Duplicate
          </MenuItem>
          <MenuItem onClick={() => toggleDeleteAlert(true)}>
            <TrashIcon className="w-5 text-fg-4" />
            Delete
          </MenuItem>
        </MenuItems>
      </Menu>
    </>
  );
};

export default InputListItemMenu;
