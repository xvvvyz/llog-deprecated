'use client';

import { Database } from '@/_types/database';
import { twMerge } from 'tailwind-merge';
import EventComment from './event-comment';

interface EventCommentsProps {
  clamp?: boolean;
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
  userId?: string;
}

const EventComments = ({
  clamp,
  className,
  comments,
  hideCommentTimestamp,
  isArchived,
  isPublic,
  isTeamMember,
  userId,
}: EventCommentsProps) => {
  if (!comments.length) return null;

  return (
    <div className={twMerge('space-y-4', className)}>
      {comments.map(({ content, created_at, id, profile }) => (
        <EventComment
          clamp={clamp}
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
    </div>
  );
};

export type { EventCommentsProps };
export default EventComments;
