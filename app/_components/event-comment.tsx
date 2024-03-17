'use client';

import deleteComment from '@/_actions/delete-comment';
import Alert from '@/_components/alert';
import Avatar from '@/_components/avatar';
import DateTime from '@/_components/date-time';
import DirtyHtml from '@/_components/dirty-html';
import Menu from '@/_components/menu';
import { Database } from '@/_types/database';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';

interface EventCommentProps {
  content: string;
  createdAt: string;
  id: string;
  profile: Database['public']['Tables']['profiles']['Row'];
  isPublic?: boolean;
  isTeamMember?: boolean;
  userId?: string;
}

const EventComment = ({
  content,
  createdAt,
  id,
  profile,
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
            <DateTime
              className="flex-shrink-0 whitespace-nowrap"
              date={createdAt}
              formatter="date-time"
            />
          </div>
          {!isPublic && (userId === profile.id || isTeamMember) && (
            <Menu className="-mr-2 -mt-2.5">
              <Menu.Button className="rounded-full p-2 hover:bg-alpha-1">
                <EllipsisVerticalIcon className="w-5" />
              </Menu.Button>
              <Menu.Items>
                <Menu.Item onClick={() => toggleDeleteAlert(true)}>
                  <TrashIcon className="w-5 text-fg-4" />
                  Delete comment
                </Menu.Item>
              </Menu.Items>
            </Menu>
          )}
        </div>
        <DirtyHtml className="mt-1">{content}</DirtyHtml>
      </div>
    </div>
  );
};

export default EventComment;
