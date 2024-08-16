'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import IconButton from '@/_components/icon-button';
import deleteTrainingPlan from '@/_mutations/delete-training-plan';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import { useRouter } from 'next/navigation';

interface TrainingPlanMenuProps {
  isModal?: boolean;
  missionId: string;
  subjectId: string;
}

const TrainingPlanMenu = ({
  isModal,
  missionId,
  subjectId,
}: TrainingPlanMenuProps) => {
  const router = useRouter();

  return (
    <>
      <DropdownMenu.Root
        trigger={
          isModal ? (
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
          className={isModal ? '-mr-[3.7rem] -mt-14' : '-mt-12 mr-1.5'}
        >
          <DropdownMenu.Button
            href={`/subjects/${subjectId}/training-plans/${missionId}/edit`}
            scroll={false}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit name
          </DropdownMenu.Button>
          <DropdownMenuDeleteItem
            confirmText="Delete training plan"
            onConfirm={async () => {
              await deleteTrainingPlan(missionId);
              if (isModal) router.back();
            }}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </>
  );
};

export default TrainingPlanMenu;
