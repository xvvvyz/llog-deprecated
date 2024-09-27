'use client';

import * as Drawer from '@/_components/drawer';
import DrawerDeleteButton from '@/_components/drawer-delete-button';
import IconButton from '@/_components/icon-button';
import deleteEventType from '@/_mutations/delete-event-type';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';

interface EventTypeMenuProps {
  eventTypeId: string;
  isModal?: boolean;
  subjectId: string;
}

const EventTypeMenu = ({
  eventTypeId,
  isModal,
  subjectId,
}: EventTypeMenuProps) => {
  const router = useRouter();

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        {isModal ? (
          <IconButton icon={<EllipsisVerticalIcon className="w-7" />} />
        ) : (
          <div className="group flex items-center justify-center px-2 text-fg-3 transition-colors hover:text-fg-2">
            <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        )}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Event type menu</Drawer.Title>
          <Drawer.Description />
          <Drawer.Button
            href={`/subjects/${subjectId}/event-types/${eventTypeId}/edit`}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit
          </Drawer.Button>
          <Drawer.Button
            href={`/templates/event-types/create/from-event-type/${eventTypeId}`}
          >
            <PlusIcon className="w-5 text-fg-4" />
            New template
          </Drawer.Button>
          <DrawerDeleteButton
            confirmText="Delete event type"
            onConfirm={async () => {
              await deleteEventType(eventTypeId);
              if (isModal) router.back();
            }}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default EventTypeMenu;
