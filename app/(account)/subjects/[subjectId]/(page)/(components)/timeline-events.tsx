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
  <div className="mt-4 space-y-4" suppressHydrationWarning>
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
                  className="m-0 w-full gap-4 px-4 py-3"
                  href={`/subjects/${subjectId}/event/${event.id}`}
                  variant="link"
                >
                  {eventType.mission ? (
                    <>
                      <span className="truncate">{eventType.mission.name}</span>
                      <Pill>{CODES.routine}</Pill>
                      {formatRoutineNumber(eventType.order)}
                    </>
                  ) : (
                    <span className="truncate">{eventType.name}</span>
                  )}
                  <div className="ml-auto flex shrink-0 items-center gap-3">
                    <Pill>
                      {
                        CODES[
                          eventType.mission
                            ? 'mission'
                            : (eventType.type as EventTypes)
                        ]
                      }
                    </Pill>
                    <ArrowRightIcon className="relative -right-[0.2em] w-5" />
                  </div>
                </Button>
              </header>
              <table className="w-full text-fg-3">
                <tbody>
                  <tr>
                    <td className="border-t border-alpha-1 py-2 px-4 align-top">
                      Time
                    </td>
                    <td className="border-t border-l border-alpha-1 py-2 px-4 align-top">
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
                      <td className="border-t border-alpha-1 py-2 px-4 align-top">
                        {label}
                      </td>
                      <td className="border-t border-l border-alpha-1 py-2 px-4 align-top">
                        {formatInputValue[type](values)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!!comments.length && (
                <ul
                  className="space-y-2 border-t border-alpha-1 px-4 pt-3 pb-4"
                  role="section"
                >
                  {comments.map(({ content, id, profile }) => (
                    <article className="flex gap-4" key={id} role="comment">
                      <Avatar
                        className="mt-[0.325rem]"
                        name={profile.first_name}
                      />
                      <div className="w-full">
                        <span className="text-fg-3">
                          {profile.first_name} {profile.last_name}
                        </span>
                        <DirtyHtml className="text-fg-2">{content}</DirtyHtml>
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
