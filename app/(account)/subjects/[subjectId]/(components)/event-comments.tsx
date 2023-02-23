'use client';

import Avatar from '(components)/avatar';
import DirtyHtml from '(components)/dirty-html';
import { twMerge } from 'tailwind-merge';

interface EventCommentsProps {
  className?: string;
  comments: Array<{
    content: string;
    id: string;
    profile: {
      first_name: string;
      last_name: string;
    };
  }>;
}

const EventComments = ({ className, comments }: EventCommentsProps) => {
  if (!comments.length) return null;

  return (
    <ul className={twMerge('space-y-3', className)} role="section">
      {comments.map(({ content, id, profile }) => (
        <article className="flex gap-4" key={id} role="comment">
          <Avatar className="mt-[0.325rem]" name={profile.first_name} />
          <div className="w-full">
            <span className="text-fg-3">
              {profile.first_name} {profile.last_name}
            </span>
            <DirtyHtml className="text-fg-2">{content}</DirtyHtml>
          </div>
        </article>
      ))}
    </ul>
  );
};

export default EventComments;
