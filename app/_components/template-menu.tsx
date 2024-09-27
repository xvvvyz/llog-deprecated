'use client';

import * as Drawer from '@/_components/drawer';
import DrawerDeleteButton from '@/_components/drawer-delete-button';
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
  <Drawer.Root>
    <Drawer.Trigger>
      <div className="group flex items-center justify-center px-2 text-fg-3 hover:text-fg-2">
        <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
          <EllipsisVerticalIcon className="w-5" />
        </div>
      </div>
    </Drawer.Trigger>
    <Drawer.Portal>
      <Drawer.Overlay />
      <Drawer.Content>
        <Drawer.Title>Template menu</Drawer.Title>
        <Drawer.Description />
        <Drawer.Button
          href={`/templates/${TEMPLATE_TYPE_SLUGS[type]}/create/from-template/${templateId}`}
        >
          <DocumentDuplicateIcon className="w-5 text-fg-4" />
          Duplicate
        </Drawer.Button>
        <DrawerDeleteButton
          confirmText="Delete template"
          onConfirm={() => deleteTemplate(templateId)}
        />
      </Drawer.Content>
    </Drawer.Portal>
  </Drawer.Root>
);

export default TemplateMenu;
