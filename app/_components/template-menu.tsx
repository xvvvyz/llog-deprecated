'use client';

import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import TEMPLATE_TYPE_SLUGS from '@/_constants/constant-template-type-slugs';
import deleteTemplate from '@/_mutations/delete-template';
import { Database } from '@/_types/database';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';

interface TemplateMenuProps {
  templateId: string;
  type: Database['public']['Enums']['template_type'];
}

const TemplateMenu = ({ templateId, type }: TemplateMenuProps) => (
  <DropdownMenu.Root>
    <DropdownMenu.Trigger>
      <div className="group flex items-center justify-center px-2 text-fg-3 hover:text-fg-2">
        <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
          <EllipsisVerticalIcon className="w-5" />
        </div>
      </div>
    </DropdownMenu.Trigger>
    <DropdownMenu.Portal>
      <DropdownMenu.Content className="mr-1.5">
        <DropdownMenu.Button
          href={`/templates/${TEMPLATE_TYPE_SLUGS[type]}/create/from-template/${templateId}`}
          scroll={false}
        >
          <DocumentDuplicateIcon className="w-5 text-fg-4" />
          Duplicate
        </DropdownMenu.Button>
        <DropdownMenuDeleteItem
          confirmText="Delete template"
          onConfirm={() => deleteTemplate(templateId)}
        />
      </DropdownMenu.Content>
    </DropdownMenu.Portal>
  </DropdownMenu.Root>
);

export default TemplateMenu;
