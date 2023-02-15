'use client';

import Avatar from '(components)/avatar';
import Button from '(components)/button';
import Card from '(components)/card';
import DateTime from '(components)/date-time';
import DirtyHtml from '(components)/dirty-html';
import Pill from '(components)/pill';
import CODES from '(utilities)/constant-codes';
import EventTypes from '(utilities)/enum-event-types';
import firstIfArray from '(utilities)/first-if-array';
import forceArray from '(utilities)/force-array';
import formatDate from '(utilities)/format-date';
import formatInputValue from '(utilities)/format-input-value';
import formatRoutineNumber from '(utilities)/format-routine-number';
import { ListEventsData } from '(utilities)/list-events';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import CommentForm from './comment-form';

interface TimelineEventsProps {
  events: NonNullable<ListEventsData>;
  subjectId: string;
}

const TimelineEvents = ({ events, subjectId }: TimelineEventsProps) => (
  <div className="mt-4 space-y-4 text-fg-2" suppressHydrationWarning>
    {Object.values(
      events.reduce((acc, event) => {
        const date = formatDate(event.created_at);
        acc[date] = acc[date] ?? [];
        acc[date].push(event);
        return acc;
      }, {} as Record<string, typeof events>)
    ).map((events) => (
      <div className="space-y-4" key={events[0].created_at}>
        <DateTime
          className="ml-4 mr-2 flex h-16 items-end justify-end border-l-2 border-dashed border-alpha-2 leading-none text-fg-3"
          date={events[0].created_at}
          formatter="date"
        />
        {events.map((event) => {
          const eventType = firstIfArray(event.type);
          const comments = forceArray(event.comments);

          return (
            <Card as="article" key={event.id} size="0">
              <header>
                <Button
                  className="m-0 w-full gap-4 py-3 px-4"
                  href={`/subjects/${subjectId}/event/${event.id}`}
                  variant="link"
                >
                  <Pill
                    values={
                      eventType.mission
                        ? [
                            CODES.mission,
                            eventType.mission.name,
                            CODES.routine,
                            formatRoutineNumber(eventType.order),
                          ]
                        : [CODES[eventType.type as EventTypes], eventType.name]
                    }
                  />
                  <div className="ml-auto flex shrink-0 items-center gap-3">
                    <ArrowRightIcon className="relative -right-[0.2em] w-5" />
                  </div>
                </Button>
              </header>
              <table className="mb-2 w-full table-fixed px-4 py-2">
                <tbody>
                  <tr>
                    <td className="pb-2 pl-4 align-top text-fg-3">Time</td>
                    <td className="pb-2 pl-4 align-top">
                      <DateTime date={event.created_at} formatter="time" />
                    </td>
                  </tr>
                  {(
                    Object.entries(
                      forceArray(event.inputs).reduce(
                        (acc, { input, option, value }) => {
                          acc[input.id] = acc[input.id] ?? { values: [] };
                          acc[input.id].label = input.label;
                          acc[input.id].type = input.type;
                          acc[input.id].values.push(value ?? option?.label);
                          return acc;
                        },
                        {}
                      )
                    ) as [
                      string,
                      {
                        label: string;
                        type: keyof typeof formatInputValue;
                        values: string[];
                      }
                    ][]
                  ).map(([id, { label, type, values }]) => (
                    <tr key={id}>
                      <td className="border-t border-alpha-1 py-2 pl-4 align-top text-fg-3">
                        {label}
                      </td>
                      <td className="border-t border-alpha-1 py-2 pl-4 align-top">
                        {formatInputValue[type](values)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!!comments.length && (
                <ul className="mb-2" role="section">
                  {comments.map(({ content, id, profile }) => (
                    <article
                      className="flex gap-4 px-4 py-2"
                      key={id}
                      role="comment"
                    >
                      <Avatar name={profile.first_name} size="sm" />
                      <div className="-mt-[0.325rem] w-full">
                        <span className="text-fg-3">
                          {profile.first_name} {profile.last_name}
                        </span>
                        <DirtyHtml>{content}</DirtyHtml>
                      </div>
                    </article>
                  ))}
                </ul>
              )}
              <CommentForm eventId={event.id} />
            </Card>
          );
        })}
      </div>
    ))}
  </div>
);

export default TimelineEvents;
