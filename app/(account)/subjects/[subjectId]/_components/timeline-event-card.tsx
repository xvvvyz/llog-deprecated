'use client';

import EventCommentForm from '@/(account)/subjects/[subjectId]/_components/event-comment-form';
import EventComments from '@/(account)/subjects/[subjectId]/_components/event-comments';
import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import InputTypes from '@/_constants/enum-input-types';
import { ListEventsData } from '@/_server/list-events';
import firstIfArray from '@/_utilities/first-if-array';
import forceArray from '@/_utilities/force-array';
import formatInputValue from '@/_utilities/format-input-value';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';

interface TimelineEventCardProps {
  group: ListEventsData;
  isTeamMember: boolean;
  subjectId: string;
  userId: string;
}

const TimelineEventCard = ({
  group,
  isTeamMember,
  subjectId,
  userId,
}: TimelineEventCardProps) => {
  const lastEvent = group[group.length - 1];
  const lastEventType = firstIfArray(lastEvent.type);
  const lastEventProfile = firstIfArray(lastEvent.profile);
  const sessionNumber = lastEventType.session?.order + 1;

  return (
    <article className="rounded border border-alpha-1 bg-bg-2 pt-1">
      <Button
        className="m-0 mb-1 w-full gap-6 p-0 px-4 py-3 leading-snug hover:bg-alpha-1"
        href={
          lastEventType.session
            ? `/subjects/${subjectId}/missions/${lastEventType.session.mission.id}/sessions/${lastEventType.session.id}`
            : `/subjects/${subjectId}/events/${lastEvent.id}`
        }
        variant="link"
      >
        {lastEventType.session
          ? lastEventType.session.mission.name
          : lastEventType.name}
        <div className="ml-auto flex shrink-0 items-center gap-4">
          {lastEventType.session && (
            <span className="relative top-px font-mono">
              Session {sessionNumber}
            </span>
          )}
          <ArrowRightIcon className="w-5" />
        </div>
      </Button>
      {!lastEventType.session && (
        <div className="smallcaps flex items-center gap-4 whitespace-nowrap border-t border-alpha-1 px-4 py-3">
          <Avatar
            className="-my-[0.15rem]"
            name={lastEventProfile.first_name}
            size="xs"
          />
          {lastEventProfile.first_name} {lastEventProfile.last_name}
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
          lastEventType.session && 'border-t border-alpha-1',
        )}
      >
        {group.map((event) => {
          const moduleNumber = firstIfArray(event.type).order + 1;
          const comments = forceArray(event.comments);
          const inputs = forceArray(event.inputs);

          return (
            <li key={event.id}>
              {lastEventType.session && (
                <div className="smallcaps flex items-center justify-between px-4 py-3">
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-base leading-none">
                      {moduleNumber}
                    </span>
                    <Avatar
                      className="-my-[0.15rem]"
                      name={firstIfArray(event.profile).first_name}
                      size="xs"
                    />
                    {lastEventProfile.first_name} {lastEventProfile.last_name}{' '}
                  </div>
                  <DateTime date={event.created_at} formatter="time" />
                </div>
              )}
              {!!inputs.length && (
                <div className="-my-1.5 pb-4 pt-3">
                  <table className="w-full table-fixed">
                    <tbody>
                      {Object.entries(
                        inputs.reduce(
                          (acc, { input, option, value }) => {
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
                          },
                          {} as Record<
                            string,
                            {
                              label: string;
                              type: InputTypes;
                              values: { label?: string; value?: string }[];
                            }
                          >,
                        ),
                      ).map(([id, { label, type, values }]: any) => (
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
                    userId={userId}
                  />
                  <EventCommentForm
                    eventId={event.id}
                    inputClassName="rounded-sm"
                  />
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
