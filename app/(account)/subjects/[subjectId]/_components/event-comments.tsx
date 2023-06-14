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
  isTeamMember: boolean;
  userId: string;
}

const EventComments = ({
  className,
  comments,
  isTeamMember,
  userId,
}: EventCommentsProps) => {
  if (!comments.length) return null;

  return (
    <ul className={twMerge('space-y-4', className)} role="section">
      {comments.map(({ content, created_at, id, profile }) => (
        <EventComment
          content={content}
          createdAt={created_at}
          id={id}
          isTeamMember={isTeamMember}
          key={id}
          profile={profile}
          userId={userId}
        />
      ))}
    </ul>
  );
};

export default EventComments;
