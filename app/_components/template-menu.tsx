'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import deleteTemplate from '@/_mutations/delete-template';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';

interface TemplateMenuProps {
  templateId: string;
}

const TemplateMenu = ({ templateId }: TemplateMenuProps) => (
  <>
    <DropdownMenu.Root
      trigger={
        <div className="group flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 active:text-fg-2">
          <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
            <EllipsisVerticalIcon className="w-5" />
          </div>
        </div>
      }
    >
      <DropdownMenu.Content className="-mt-12 mr-1.5">
        <DropdownMenuDeleteItem
          confirmText="Delete template"
          onConfirm={() => deleteTemplate(templateId)}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  </>
);

export default TemplateMenu;
