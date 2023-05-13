'use client';

import { Database } from '(types)/database';
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
  userId: string;
}

const EventComments = ({ className, comments, userId }: EventCommentsProps) => {
  if (!comments.length) return null;

  return (
    <ul className={twMerge('space-y-4', className)} role="section">
      {comments.map(({ content, created_at, id, profile }) => (
        <EventComment
          content={content}
          createdAt={created_at}
          id={id}
          key={id}
          profile={profile}
          userId={userId}
        />
      ))}
    </ul>
  );
};

export default EventComments;
