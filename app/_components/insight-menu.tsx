'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import deleteInsight from '@/_mutations/delete-insight';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';

interface InsightMenuProps {
  insightId: string;
  subjectId: string;
}

const InsightMenu = ({ insightId, subjectId }: InsightMenuProps) => (
  <>
    <DropdownMenu.Root
      trigger={
        <div className="group mt-1 flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 active:text-fg-2">
          <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
            <EllipsisVerticalIcon className="w-5" />
          </div>
        </div>
      }
    >
      <DropdownMenu.Content className="-mt-11 mr-1.5">
        <DropdownMenu.Button
          href={`/subjects/${subjectId}/insights/${insightId}/edit`}
          scroll={false}
        >
          <PencilIcon className="w-5 text-fg-4" />
          Edit
        </DropdownMenu.Button>
        <DropdownMenuDeleteItem
          confirmText="Delete insight"
          onConfirm={() => deleteInsight(insightId)}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </>
);

export default InsightMenu;
