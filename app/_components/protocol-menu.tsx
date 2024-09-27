'use client';

import * as Drawer from '@/_components/drawer';
import DrawerDeleteButton from '@/_components/drawer-delete-button';
import IconButton from '@/_components/icon-button';
import deleteProtocol from '@/_mutations/delete-protocol';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';

interface ProtocolMenuProps {
  isModal?: boolean;
  subjectId: string;
  protocolId: string;
}

const ProtocolMenu = ({
  isModal,
  subjectId,
  protocolId,
}: ProtocolMenuProps) => {
  const router = useRouter();

  return (
    <Drawer.Root>
      <Drawer.Trigger>
        {isModal ? (
          <IconButton icon={<EllipsisVerticalIcon className="w-7" />} />
        ) : (
          <div className="group flex items-center justify-center px-2 text-fg-3 transition-colors hover:text-fg-2">
            <div className="rounded-full p-2 transition-colors group-hover:bg-alpha-1">
              <EllipsisVerticalIcon className="w-5" />
            </div>
          </div>
        )}
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title>Protocol menu</Drawer.Title>
          <Drawer.Description />
          <Drawer.Button
            href={`/subjects/${subjectId}/protocols/${protocolId}/edit`}
          >
            <PencilIcon className="w-5 text-fg-4" />
            Edit name
          </Drawer.Button>
          <Drawer.Button
            href={`/templates/protocols/create/from-protocol/${protocolId}`}
          >
            <PlusIcon className="w-5 text-fg-4" />
            New template
          </Drawer.Button>
          <DrawerDeleteButton
            confirmText="Delete protocol"
            onConfirm={async () => {
              await deleteProtocol(protocolId);
              if (isModal) router.back();
            }}
          />
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default ProtocolMenu;
