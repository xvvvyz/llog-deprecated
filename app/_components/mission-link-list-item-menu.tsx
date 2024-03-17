'use client';

import deleteMission from '@/_actions/delete-mission';
import Alert from '@/_components/alert';
import Menu from '@/_components/menu';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';

interface EventTypeLinkListItemMenuProps {
  missionId: string;
  subjectId: string;
}

const MissionLinkListItemMenu = ({
  missionId,
  subjectId,
}: EventTypeLinkListItemMenuProps) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);

  return (
    <>
      <Alert
        confirmText="Delete training plan"
        isConfirmingText="Deleting…"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={() => deleteMission(missionId)}
      />
      <Menu className="shrink-0">
        <Menu.Button className="group flex h-full items-center justify-center px-2 text-fg-3 hover:text-fg-2">
          <div className="rounded-full p-2 group-hover:bg-alpha-1">
            <EllipsisVerticalIcon className="w-5" />
          </div>
        </Menu.Button>
        <Menu.Items className="mr-2 mt-2">
          <Menu.Item
            href={`/subjects/${subjectId}/training-plans/${missionId}/edit`}
            scroll={false}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit name
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

export default MissionLinkListItemMenu;
