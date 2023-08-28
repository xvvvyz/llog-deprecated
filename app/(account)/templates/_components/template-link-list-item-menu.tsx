'use client';

import Alert from '@/(account)/_components/alert';
import Menu from '@/(account)/_components/menu';
import MenuButton from '@/(account)/_components/menu-button';
import MenuItem from '@/(account)/_components/menu-item';
import MenuItems from '@/(account)/_components/menu-items';
import useDeleteAlert from '@/(account)/_hooks/use-delete-alert';
import useSupabase from '@/_hooks/use-supabase';
import { useRouter } from 'next/navigation';

import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline';

interface TemplateLinkListItemMenuItemsProps {
  templateId: string;
}

const TemplateLinkListItemMenu = ({
  templateId,
}: TemplateLinkListItemMenuItemsProps) => {
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
        confirmText="Delete template"
        isConfirming={isConfirming}
        isConfirmingText="Deleting template…"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={async () => {
          toggleIsConfirming(true);

          const { error } = await supabase
            .from('templates')
            .delete()
            .eq('id', templateId);

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
          <MenuItem onClick={() => toggleDeleteAlert(true)}>
            <TrashIcon className="w-5 text-fg-4" />
            Delete template
          </MenuItem>
        </MenuItems>
      </Menu>
    </>
  );
};

export default TemplateLinkListItemMenu;
