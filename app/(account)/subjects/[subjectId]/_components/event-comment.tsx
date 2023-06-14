'use client';

import Alert from '@/(account)/_components/alert';
import Avatar from '@/(account)/_components/avatar';
import DateTime from '@/(account)/_components/date-time';
import DirtyHtml from '@/(account)/_components/dirty-html';
import Menu from '@/(account)/_components/menu';
import useDeleteAlert from '@/(account)/_hooks/use-delete-alert';
import useSupabase from '@/(account)/_hooks/use-supabase';
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
  const { deleteAlert, isConfirming, startTransition } = useDeleteAlert();
  const router = useRouter();
  const supabase = useSupabase();

  return (
    <article className="flex gap-4" role="comment">
      <Alert
        confirmText="Delete comment"
        isConfirming={isConfirming.value}
        isConfirmingText="Deleting comment…"
        onConfirm={async () => {
          isConfirming.setTrue();

          const { error } = await supabase
            .from('comments')
            .delete()
            .eq('id', id);

          if (error) {
            isConfirming.setFalse();
            alert(error.message);
          } else {
            startTransition(router.refresh);
          }
        }}
        {...deleteAlert}
      />
      <Avatar className="mt-0.5" name={profile.first_name} />
      <div className="flex-1">
        <div className="flex h-5 w-full justify-between">
          <div className="flex w-full gap-2 text-xs uppercase tracking-widest text-fg-3">
            <span className="w-0 flex-1 truncate">
              {profile.first_name} {profile.last_name}
            </span>
            <DateTime
              className="relative -right-px flex-shrink-0 whitespace-nowrap"
              date={createdAt}
              formatter="date-time"
            />
          </div>
          {(userId === profile.id || isTeamMember) && (
            <Menu className="-m-3 p-3">
              <Menu.Button className="-m-3 p-3">
                <EllipsisVerticalIcon className="relative -right-2 -top-[0.18rem] w-5" />
              </Menu.Button>
              <Menu.Items>
                <Menu.Item onClick={deleteAlert.setTrue}>
                  <TrashIcon className="w-5 text-fg-3" />
                  Delete comment
                </Menu.Item>
              </Menu.Items>
            </Menu>
          )}
        </div>
        <DirtyHtml className="mt-1 [overflow-wrap:anywhere]">
          {content}
        </DirtyHtml>
      </div>
    </article>
  );
};

export default EventComment;
