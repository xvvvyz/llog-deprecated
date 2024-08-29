'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import deleteTemplate from '@/_mutations/delete-template';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';

interface TemplateMenuProps {
  templateId: string;
}

const TemplateMenu = ({ templateId }: TemplateMenuProps) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <div className="group flex items-center justify-center px-2 text-fg-3 hover:text-fg-2">
        <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
          <EllipsisVerticalIcon className="w-5" />
        </div>
      </div>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="mx-2" sideOffset={-2}>
        <DropdownMenuDeleteItem
          confirmText="Delete template"
          onConfirm={() => deleteTemplate(templateId)}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default TemplateMenu;
