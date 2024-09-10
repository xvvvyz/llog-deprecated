'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import IconButton from '@/_components/icon-button';
import deleteEvent from '@/_mutations/delete-event';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

interface EventMenuProps {
  className?: string;
  eventId: string;
  isModal?: boolean;
}

const EventMenu = ({ className, eventId, isModal }: EventMenuProps) => {
  const router = useRouter();

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {isModal ? (
          <IconButton icon={<EllipsisVerticalIcon className="w-7" />} />
        ) : (
          <div
            className={twMerge(
              'group absolute right-0 top-0 flex items-center justify-center px-2 py-2.5 text-fg-3 hover:text-fg-2',
              className,
            )}
          >
            <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={twMerge(!isModal && 'mr-1.5')}>
          <DropdownMenuDeleteItem
            confirmText="Delete event"
            onConfirm={async () => {
              await deleteEvent(eventId);
              if (isModal) router.back();
            }}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default EventMenu;
