'use client';

import Alert from '@/_components/alert';
import DropdownMenu from '@/_components/dropdown-menu';
import deleteEvent from '@/_mutations/delete-event';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';

interface EventMenuProps {
  eventId: string;
}

const EventMenu = ({ eventId }: EventMenuProps) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);

  return (
    <>
      <DropdownMenu
        trigger={
          <div className="group absolute right-0 top-0 flex items-center justify-center px-2 py-2.5 text-fg-3 hover:text-fg-2 active:text-fg-2">
            <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        }
      >
        <DropdownMenu.Content className="-mt-[3.35rem] mr-1.5">
          <DropdownMenu.Button onClick={() => toggleDeleteAlert(true)}>
            <TrashIcon className="w-5 text-fg-4" />
            Delete
          </DropdownMenu.Button>
        </DropdownMenu.Content>
      </DropdownMenu>
      <Alert
        confirmText="Delete event"
        isConfirmingText="Deleting…"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={() => deleteEvent(eventId)}
      />
    </>
  );
};

export default EventMenu;
