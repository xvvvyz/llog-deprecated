'use client';

import Alert from '@/_components/alert';
import DropdownMenu from '@/_components/dropdown-menu';
import deleteMission from '@/_mutations/delete-mission';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';

interface MissionMenuProps {
  missionId: string;
  subjectId: string;
}

const MissionMenu = ({ missionId, subjectId }: MissionMenuProps) => {
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
        <DropdownMenu.Content className="-mt-12 mr-1.5">
          <DropdownMenu.Button
            href={`/subjects/${subjectId}/training-plans/${missionId}/edit`}
            scroll={false}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit name
          </DropdownMenu.Button>
          <DropdownMenu.Button onClick={() => toggleDeleteAlert(true)}>
            <TrashIcon className="w-5 text-fg-4" />
            Delete
          </DropdownMenu.Button>
        </DropdownMenu.Content>
      </DropdownMenu>
      <Alert
        confirmText="Delete training plan"
        isConfirmingText="Deleting…"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={() => deleteMission(missionId)}
      />
    </>
  );
};

export default MissionMenu;
