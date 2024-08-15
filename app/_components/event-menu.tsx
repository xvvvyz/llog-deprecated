'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import deleteEvent from '@/_mutations/delete-event';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';

interface EventMenuProps {
  eventId: string;
}

const EventMenu = ({ eventId }: EventMenuProps) => (
  <DropdownMenu.Root
    trigger={
      <div className="group absolute right-0 top-0 flex items-center justify-center px-2 py-2.5 text-fg-3 hover:text-fg-2 active:text-fg-2">
        <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
          <EllipsisVerticalIcon className="w-5" />
        </div>
      </div>
    }
  >
    <DropdownMenu.Content className="-mt-[3.35rem] mr-1.5">
      <DropdownMenuDeleteItem
        confirmText="Delete event"
        onConfirm={() => deleteEvent(eventId)}
      />
    </DropdownMenu.Content>
  </DropdownMenu.Root>
);

export default EventMenu;
