'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import IconButton from '@/_components/icon-button';
import deleteEventType from '@/_mutations/delete-event-type';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

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
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        {isModal ? (
          <IconButton icon={<EllipsisVerticalIcon className="w-7" />} />
        ) : (
          <div className="group flex items-center justify-center px-2 text-fg-3 transition-colors hover:text-fg-2">
            <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        )}
      </DropdownMenu.Trigger>
      <DropdownMenu.Portal>
        <DropdownMenu.Content className={twMerge(!isModal && 'mr-1.5')}>
          <DropdownMenu.Button
            href={`/subjects/${subjectId}/event-types/${eventTypeId}/edit`}
            scroll={false}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit
          </DropdownMenu.Button>
          <DropdownMenu.Button
            href={`/templates/event-types/create/from-event-type/${eventTypeId}`}
            scroll={false}
          >
            <PlusIcon className="w-5 text-fg-4" />
            New template
          </DropdownMenu.Button>
          <DropdownMenuDeleteItem
            confirmText="Delete event type"
            onConfirm={async () => {
              await deleteEventType(eventTypeId);
              if (isModal) router.back();
            }}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default EventTypeMenu;
