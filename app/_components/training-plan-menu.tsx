'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import IconButton from '@/_components/icon-button';
import deleteTrainingPlan from '@/_mutations/delete-training-plan';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

interface TrainingPlanMenuProps {
  isModal?: boolean;
  subjectId: string;
  trainingPlanId: string;
}

const TrainingPlanMenu = ({
  isModal,
  subjectId,
  trainingPlanId,
}: TrainingPlanMenuProps) => {
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
            href={`/subjects/${subjectId}/training-plans/${trainingPlanId}/edit`}
            scroll={false}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit name
          </DropdownMenu.Button>
          <DropdownMenu.Button
            href={`/templates/training-plans/create/from-training-plan/${trainingPlanId}`}
            scroll={false}
          >
            <PlusIcon className="w-5 text-fg-4" />
            New template
          </DropdownMenu.Button>
          <DropdownMenuDeleteItem
            confirmText="Delete training plan"
            onConfirm={async () => {
              await deleteTrainingPlan(trainingPlanId);
              if (isModal) router.back();
            }}
          />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
};

export default TrainingPlanMenu;
