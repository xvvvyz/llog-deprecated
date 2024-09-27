'use client';

import * as Drawer from '@/_components/drawer';
import DrawerDeleteButton from '@/_components/drawer-delete-button';
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
    <Drawer.Root>
      <Drawer.Trigger>
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
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Event menu</Drawer.Title>
          <Drawer.Description />
          <DrawerDeleteButton
            confirmText="Delete event"
            onConfirm={async () => {
              await deleteEvent(eventId);
              if (isModal) router.back();
            }}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default EventMenu;
