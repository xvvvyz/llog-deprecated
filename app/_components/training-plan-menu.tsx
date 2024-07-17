'use client';

import Alert from '@/_components/alert';
import DropdownMenu from '@/_components/dropdown-menu';
import IconButton from '@/_components/icon-button';
import deleteTrainingPlan from '@/_mutations/delete-training-plan';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';

interface TrainingPlanMenuProps {
  isView?: boolean;
  missionId: string;
  subjectId: string;
}

const TrainingPlanMenu = ({
  isView,
  missionId,
  subjectId,
}: TrainingPlanMenuProps) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);
  const router = useRouter();

  return (
    <>
      <DropdownMenu
        trigger={
          isView ? (
            <IconButton icon={<EllipsisVerticalIcon className="w-7" />} />
          ) : (
            <div className="group flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 active:text-fg-2">
              <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
                <EllipsisVerticalIcon className="w-5" />
              </div>
            </div>
          )
        }
      >
        <DropdownMenu.Content
          className={isView ? '-mr-[3.7rem] -mt-14' : '-mt-12 mr-1.5'}
        >
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
        onConfirm={async () => {
          await deleteTrainingPlan(missionId);
          if (isView) router.replace(`/subjects/${subjectId}`);
        }}
      />
    </>
  );
};

export default TrainingPlanMenu;
