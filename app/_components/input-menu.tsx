'use client';

import Alert from '@/_components/alert';
import DropdownMenu from '@/_components/dropdown-menu';
import deleteInput from '@/_mutations/delete-input';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';

interface InputMenuProps {
  inputId: string;
}

const InputMenu = ({ inputId }: InputMenuProps) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);

  return (
    <>
      <DropdownMenu
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
          <DropdownMenu.Button onClick={() => toggleDeleteAlert(true)}>
            <TrashIcon className="w-5 text-fg-4" />
            Delete
          </DropdownMenu.Button>
        </DropdownMenu.Content>
      </DropdownMenu>
      <Alert
        confirmText="Delete input"
        isConfirmingText="Deleting…"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={() => deleteInput(inputId)}
      />
    </>
  );
};

export default InputMenu;
