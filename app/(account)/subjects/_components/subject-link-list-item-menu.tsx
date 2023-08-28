'use client';

import Alert from '@/(account)/_components/alert';
import Menu from '@/(account)/_components/menu';
import MenuButton from '@/(account)/_components/menu-button';
import MenuItem from '@/(account)/_components/menu-item';
import MenuItems from '@/(account)/_components/menu-items';
import useDeleteAlert from '@/(account)/_hooks/use-delete-alert';
import useSupabase from '@/_hooks/use-supabase';
import { useRouter } from 'next/navigation';

import {
  EllipsisVerticalIcon,
  PencilIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface SubjectLinkListItemMenuItemsProps {
  subjectId: string;
}

const SubjectLinkListItemMenu = ({
  subjectId,
}: SubjectLinkListItemMenuItemsProps) => {
  const router = useRouter();
  const supabase = useSupabase();

  const {
    deleteAlert,
    isConfirming,
    startTransition,
    toggleDeleteAlert,
    toggleIsConfirming,
  } = useDeleteAlert();

  return (
    <>
      <Alert
        confirmText="Delete subject"
        isConfirming={isConfirming}
        isConfirmingText="Deleting subject…"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={async () => {
          toggleIsConfirming(true);

          const { error } = await supabase
            .from('subjects')
            .update({ deleted: true })
            .eq('id', subjectId);

          if (error) {
            toggleIsConfirming(false);
            alert(error.message);
          } else {
            startTransition(router.refresh);
          }
        }}
      />
      <Menu className="shrink-0">
        <MenuButton className="group flex h-full items-center justify-center px-2 text-fg-3 hover:text-fg-2">
          <div className="rounded-full p-2 group-hover:bg-alpha-1">
            <EllipsisVerticalIcon className="w-5" />
          </div>
        </MenuButton>
        <MenuItems className="mr-2 mt-2">
          <MenuItem href={`/subjects/${subjectId}/edit?back=/subjects`}>
            <PencilIcon className="w-5 text-fg-4" />
            Edit subject
          </MenuItem>
          <MenuItem onClick={() => toggleDeleteAlert(true)}>
            <TrashIcon className="w-5 text-fg-4" />
            Delete subject
          </MenuItem>
        </MenuItems>
      </Menu>
    </>
  );
};

export default SubjectLinkListItemMenu;
