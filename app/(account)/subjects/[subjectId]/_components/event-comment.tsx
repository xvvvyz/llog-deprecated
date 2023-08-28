'use client';

import Alert from '@/(account)/_components/alert';
import Avatar from '@/(account)/_components/avatar';
import DateTime from '@/(account)/_components/date-time';
import DirtyHtml from '@/(account)/_components/dirty-html';
import Menu from '@/(account)/_components/menu';
import MenuButton from '@/(account)/_components/menu-button';
import MenuItem from '@/(account)/_components/menu-item';
import MenuItems from '@/(account)/_components/menu-items';
import useDeleteAlert from '@/(account)/_hooks/use-delete-alert';
import useSupabase from '@/_hooks/use-supabase';
import { Database } from '@/_types/database';
import { EllipsisVerticalIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';

interface EventCommentProps {
  content: string;
  createdAt: string;
  id: string;
  profile: Database['public']['Tables']['profiles']['Row'];
  isTeamMember: boolean;
  userId: string;
}

const EventComment = ({
  content,
  createdAt,
  id,
  profile,
  isTeamMember,
  userId,
}: EventCommentProps) => {
  const router = useRouter();
  const supabase = useSupabase();

  const {
    deleteAlert,
    toggleDeleteAlert,
    toggleIsConfirming,
    isConfirming,
    startTransition,
  } = useDeleteAlert();

  return (
    <div className="flex gap-4">
      <Alert
        confirmText="Delete comment"
        isConfirming={isConfirming}
        isConfirmingText="Deleting comment…"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={async () => {
          toggleIsConfirming(true);

          const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id);

          if (error) {
            toggleIsConfirming(false);
            alert(error.message);
          } else {
            startTransition(router.refresh);
          }
        }}
      />
      <Avatar className="mt-0.5" name={profile.first_name} />
      <div className="flex-1">
        <div className="flex h-5 w-full justify-between gap-2">
          <div className="smallcaps flex w-full gap-2">
            <span className="w-0 flex-1 truncate">
              {profile.first_name} {profile.last_name}
            </span>
            <DateTime
              className="flex-shrink-0 whitespace-nowrap"
              date={createdAt}
              formatter="date-time"
            />
          </div>
          {(userId === profile.id || isTeamMember) && (
            <Menu className="-mr-2 -mt-2.5">
              <MenuButton className="rounded-full p-2 hover:bg-alpha-1">
                <EllipsisVerticalIcon className="w-5" />
              </MenuButton>
              <MenuItems>
                <MenuItem onClick={() => toggleDeleteAlert(true)}>
                  <TrashIcon className="w-5 text-fg-4" />
                  Delete comment
                </MenuItem>
              </MenuItems>
            </Menu>
          )}
        </div>
        <DirtyHtml className="mt-1 [overflow-wrap:anywhere]">
          {content}
        </DirtyHtml>
      </div>
    </div>
  );
};

export default EventComment;
