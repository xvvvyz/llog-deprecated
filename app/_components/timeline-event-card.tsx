'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import EventCommentForm from '@/_components/event-comment-form';
import EventComments from '@/_components/event-comments';
import InputTypes from '@/_constants/enum-input-types';
import { ListEventsData } from '@/_server/list-events';
import firstIfArray from '@/_utilities/first-if-array';
import forceArray from '@/_utilities/force-array';
import formatInputValue from '@/_utilities/format-input-value';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { User } from '@supabase/supabase-js';
import { useRef } from 'react';
import { twMerge } from 'tailwind-merge';

interface TimelineEventCardProps {
  group: NonNullable<ListEventsData>;
  isPublic?: boolean;
  isTeamMember: boolean;
  subjectId: string;
  user: User | null;
}

const TimelineEventCard = ({
  group,
  isPublic,
  isTeamMember,
  subjectId,
  user,
}: TimelineEventCardProps) => {
  const compressLast = useRef(false);
  const compressStart = useRef<number | null>(null);
  const lastEvent = group[group.length - 1];
  const lastEventType = firstIfArray(lastEvent.type);
  const lastEventProfile = firstIfArray(lastEvent.profile);
  const sessionNumber = (lastEventType?.session?.order ?? 0) + 1;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  return (
    <article className="rounded border border-alpha-1 bg-bg-2 pt-1">
      <Button
        className="m-0 mb-1 w-full gap-6 p-0 px-4 py-3 leading-snug hover:bg-alpha-1"
        href={
          lastEventType?.session
            ? `/${shareOrSubjects}/${subjectId}/missions/${lastEventType.session?.mission?.id}/sessions/${lastEventType.session.id}`
            : `/${shareOrSubjects}/${subjectId}/events/${lastEvent.id}`
        }
        variant="link"
      >
        {lastEventType?.session
          ? lastEventType.session?.mission?.name
          : lastEventType?.name}
        <div className="ml-auto flex shrink-0 items-center gap-4">
          {lastEventType?.session && (
            <span className="relative top-px font-mono">
              Session {sessionNumber}
            </span>
          )}
          <ArrowRightIcon className="w-5" />
        </div>
      </Button>
      {!lastEventType?.session && (
        <div className="smallcaps flex items-center gap-4 whitespace-nowrap border-t border-alpha-1 px-4 py-3">
          <Avatar
            className="-my-[0.15rem]"
            file={lastEventProfile?.image_uri}
            id={lastEventProfile?.id}
            size="xs"
          />
          {lastEventProfile?.first_name} {lastEventProfile?.last_name}
          <DateTime
            className="ml-auto"
            date={lastEvent.created_at}
            formatter="time"
          />
        </div>
      )}
      <ul
        className={twMerge(
          'divide-y divide-alpha-1',
          lastEventType?.session && 'border-t border-alpha-1',
        )}
      >
        {group.map((event, i) => {
          const moduleNumber = (firstIfArray(event.type)?.order ?? 0) + 1;
          const comments = forceArray(event.comments);
          const inputs = forceArray(event.inputs);
          const profile = firstIfArray(event.profile);
          const nextEvent = group[i + 1];

          if (compressLast.current) {
            compressLast.current = false;
            compressStart.current = null;
          }

          if (
            !comments.length &&
            !inputs.length &&
            nextEvent?.profile?.id === profile?.id &&
            !forceArray(nextEvent?.comments).length &&
            !forceArray(nextEvent?.inputs).length
          ) {
            if (!compressStart.current) compressStart.current = moduleNumber;
            return null;
          } else {
            compressLast.current = !!compressStart.current;
          }

          return (
            <li key={event.id}>
              {lastEventType?.session && (
                <div className="smallcaps flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-base leading-none">
                      {compressLast.current && (
                        <>{compressStart.current}&nbsp;&ndash;&nbsp;</>
                      )}
                      {moduleNumber}
                    </span>
                    <Avatar
                      className="-my-[0.15rem]"
                      file={profile?.image_uri}
                      id={profile?.id}
                      size="xs"
                    />
                    {profile?.first_name} {profile?.last_name}{' '}
                  </div>
                  <DateTime date={event.created_at} formatter="time" />
                </div>
              )}
              {!!inputs.length && (
                <div className="-my-1.5 pb-4 pt-3">
                  <table className="w-full table-fixed">
                    <tbody>
                      {Object.entries(
                        inputs.reduce<
                          Record<
                            string,
                            {
                              label: string;
                              type: InputTypes;
                              values: { label?: string; value?: string }[];
                            }
                          >
                        >((acc, { input, option, value }) => {
                          if (!input) return acc;
                          acc[input.id] = acc[input.id] ?? { values: [] };
                          acc[input.id].label = input.label;
                          acc[input.id].type = input.type;

                          if (value || option?.label) {
                            acc[input.id].values.push({
                              label: option?.label,
                              value,
                            });
                          }

                          return acc;
                        }, {}),
                      ).map(([id, { label, type, values }]) => (
                        <tr key={id}>
                          <td className="truncate px-4 text-fg-4">{label}</td>
                          <td className="truncate pr-4">
                            {formatInputValue[type as InputTypes](values)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
              {!!comments.length && (
                <div className="space-y-4 px-4 pb-4 pt-3">
                  <EventComments
                    comments={comments}
                    isTeamMember={isTeamMember}
                    userId={user?.id}
                  />
                  {user && (
                    <EventCommentForm
                      eventId={event.id}
                      inputClassName="rounded-sm"
                    />
                  )}
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </article>
  );
};

export default TimelineEventCard;
