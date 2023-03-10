'use client';

import Alert from '(components)/alert';
import Avatar from '(components)/avatar';
import DirtyHtml from '(components)/dirty-html';
import Menu from '(components)/menu';
import { Database } from '(types)/database';
import supabase from '(utilities)/browser-supabase-client';
import usePrevious from '(utilities)/use-previous';
import { EllipsisHorizontalIcon, TrashIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { useBoolean } from 'usehooks-ts';

interface EventCommentProps {
  content: string;
  id: string;
  profile: Database['public']['Tables']['profiles']['Row'];
  userId: string;
}

const EventComment = ({ content, id, profile, userId }: EventCommentProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const deleteAlert = useBoolean();
  const isConfirming = useBoolean();
  const isTransitioningPrevious = usePrevious(isTransitioning);
  const router = useRouter();

  useEffect(() => {
    if (!isTransitioning && isTransitioningPrevious) {
      deleteAlert.setFalse();
      isConfirming.setFalse();
    }
  }, [deleteAlert, isConfirming, isTransitioning, isTransitioningPrevious]);

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
      <div className="w-full">
        <div className="relative">
          <span className="flex justify-between text-xs uppercase tracking-widest text-fg-3">
            {profile.first_name} {profile.last_name}
          </span>
          {userId === profile.id && (
            <Menu className="absolute right-0 top-0 -m-3 p-3">
              <Menu.Button className="-m-3 p-3 text-fg-3">
                <EllipsisHorizontalIcon className="w-5" />
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
        <DirtyHtml className="mt-1 text-fg-2">{content}</DirtyHtml>
      </div>
    </article>
  );
};

export default EventComment;
