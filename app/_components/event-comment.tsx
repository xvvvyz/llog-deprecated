'use client';

import Alert from '@/_components/alert';
import Avatar from '@/_components/avatar';
import DateTime from '@/_components/date-time';
import DirtyHtml from '@/_components/dirty-html';
import DropdownMenu from '@/_components/dropdown-menu';
import deleteComment from '@/_mutations/delete-comment';
import { Database } from '@/_types/database';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';
import { twMerge } from 'tailwind-merge';

interface EventCommentProps {
  clamp?: boolean;
  content: string;
  createdAt: string;
  hideCommentTimestamp?: boolean;
  id: string;
  profile: Database['public']['Tables']['profiles']['Row'];
  isArchived?: boolean;
  isPublic?: boolean;
  isTeamMember?: boolean;
  userId?: string;
}

const EventComment = ({
  clamp,
  content,
  createdAt,
  hideCommentTimestamp,
  id,
  profile,
  isArchived,
  isPublic,
  isTeamMember,
  userId,
}: EventCommentProps) => {
  const [deleteAlert, toggleDeleteAlert] = useToggle(false);

  return (
    <div className="flex gap-4">
      <Alert
        confirmText="Delete comment"
        isConfirmingText="Deleting…"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={() => deleteComment(id)}
      />
      <Avatar className="mt-0.5" file={profile.image_uri} id={profile.id} />
      <div className="flex-1">
        <div className="flex h-5 w-full justify-between gap-2">
          <div className="smallcaps flex w-full gap-2 text-fg-4">
            <span className="w-0 flex-1 truncate">
              {profile.first_name} {profile.last_name}
            </span>
            {!hideCommentTimestamp && (
              <DateTime
                className="flex-shrink-0 whitespace-nowrap"
                date={createdAt}
                formatter="date-time"
              />
            )}
          </div>
          {!isPublic &&
            !isArchived &&
            (userId === profile.id || isTeamMember) && (
              <DropdownMenu
                trigger={
                  <div className="-mr-2 -mt-[0.7rem]">
                    <div className="rounded-full p-2 text-fg-3 transition-colors hover:bg-alpha-1 hover:text-fg-2 active:bg-alpha-1 active:text-fg-2">
                      <EllipsisVerticalIcon className="w-5" />
                    </div>
                  </div>
                }
              >
                <DropdownMenu.Content className="-mt-8 mr-1.5">
                  <DropdownMenu.Button onClick={() => toggleDeleteAlert(true)}>
                    <TrashIcon className="w-5 text-fg-4" />
                    Delete comment
                  </DropdownMenu.Button>
                </DropdownMenu.Content>
              </DropdownMenu>
            )}
        </div>
        <DirtyHtml className={twMerge(clamp && 'line-clamp-5')}>
          {content}
        </DirtyHtml>
      </div>
    </div>
  );
};

export default EventComment;
