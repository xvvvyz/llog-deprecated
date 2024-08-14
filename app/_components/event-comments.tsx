'use client';

import { Database } from '@/_types/database';
import { twMerge } from 'tailwind-merge';
import EventComment from './event-comment';

interface EventCommentsProps {
  className?: string;
  comments: Array<{
    content: string;
    created_at: string;
    id: string;
    profile: Database['public']['Tables']['profiles']['Row'];
  }>;
  hideCommentTimestamp?: boolean;
  isArchived?: boolean;
  isPublic?: boolean;
  isTeamMember?: boolean;
  limit?: number;
  userId?: string;
}

const EventComments = ({
  className,
  comments,
  hideCommentTimestamp,
  isArchived,
  isPublic,
  isTeamMember,
  limit = Infinity,
  userId,
}: EventCommentsProps) => {
  if (!comments.length) return null;
  const clone = [...comments];
  const hidden = clone.splice(limit);

  return (
    <div className={twMerge('space-y-4', className)}>
      {clone.map(({ content, created_at, id, profile }) => (
        <EventComment
          content={content}
          createdAt={created_at}
          hideCommentTimestamp={hideCommentTimestamp}
          id={id}
          isArchived={isArchived}
          isPublic={isPublic}
          isTeamMember={isTeamMember}
          key={id}
          profile={profile}
          userId={userId}
        />
      ))}
      {!!hidden.length && (
        <div className="!mt-2 text-right text-fg-4">
          +{hidden.length} comment{hidden.length > 1 ? 's' : ''}
        </div>
      )}
    </div>
  );
};

export type { EventCommentsProps };
export default EventComments;
