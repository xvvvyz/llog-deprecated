'use client';

import Avatar from '@/_components/avatar';
import DateTime from '@/_components/date-time';
import DirtyHtml from '@/_components/dirty-html';
import * as DropdownMenu from '@/_components/dropdown-menu';
import DropdownMenuDeleteItem from '@/_components/dropdown-menu-delete-item';
import deleteComment from '@/_mutations/delete-comment';
import { Database } from '@/_types/database';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';

interface EventCommentProps {
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
  content,
  createdAt,
  hideCommentTimestamp,
  id,
  profile,
  isArchived,
  isPublic,
  isTeamMember,
  userId,
}: EventCommentProps) => (
  <div className="flex gap-2">
    <Avatar file={profile.image_uri} id={profile.id} />
    <div className="flex-1 rounded-sm border border-alpha-1 bg-alpha-1 px-4 pb-3 pt-3.5">
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
            <DropdownMenu.Root>
              <DropdownMenu.Trigger className="-mr-4 -mt-[0.7rem]">
                <div className="rounded-full p-2 text-fg-3 transition-colors hover:text-fg-2">
                  <EllipsisVerticalIcon className="w-5" />
                </div>
              </DropdownMenu.Trigger>
              <DropdownMenu.Portal>
                <DropdownMenu.Content className="mx-2" sideOffset={4}>
                  <DropdownMenuDeleteItem
                    confirmText="Delete comment"
                    onConfirm={() => deleteComment(id)}
                  />
                </DropdownMenu.Content>
              </DropdownMenu.Portal>
            </DropdownMenu.Root>
          )}
      </div>
      <DirtyHtml>{content}</DirtyHtml>
    </div>
  </div>
);

export default EventComment;
