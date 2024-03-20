'use client';

import Alert from '@/_components/alert';
import Menu from '@/_components/menu';
import deleteEventType from '@/_mutations/delete-event-type';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';

interface EventTypeLinkListItemMenuProps {
  eventTypeId: string;
  subjectId: string;
}

const EventTypeLinkListItemMenu = ({
  eventTypeId,
  subjectId,
}: EventTypeLinkListItemMenuProps) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);

  return (
    <>
      <Alert
        confirmText="Delete event type"
        isConfirmingText="Deleting…"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={() => deleteEventType(eventTypeId)}
      />
      <Menu className="shrink-0">
        <Menu.Button className="group flex h-full items-center justify-center px-2 text-fg-3 hover:text-fg-2">
          <div className="rounded-full p-2 group-hover:bg-alpha-1">
            <EllipsisVerticalIcon className="w-5" />
          </div>
        </Menu.Button>
        <Menu.Items className="mr-2 mt-2">
          <Menu.Item
            href={`/subjects/${subjectId}/event-types/${eventTypeId}/edit`}
            scroll={false}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit
          </Menu.Item>
          <Menu.Item
            href={`/templates/create/from-event-type/${eventTypeId}`}
            scroll={false}
          >
            <DocumentDuplicateIcon className="w-5 text-fg-4" />
            Create template
          </Menu.Item>
          <Menu.Item onClick={() => toggleDeleteAlert(true)}>
            <TrashIcon className="w-5 text-fg-4" />
            Delete
          </Menu.Item>
        </Menu.Items>
      </Menu>
    </>
  );
};

export default EventTypeLinkListItemMenu;
