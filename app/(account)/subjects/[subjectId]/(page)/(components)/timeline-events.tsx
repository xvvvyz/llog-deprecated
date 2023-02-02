'use client';

import Avatar from '(components)/avatar';
import Card from '(components)/card';
import DateTime from '(components)/date-time';
import DirtyHtml from '(components)/dirty-html';
import firstIfArray from '(utilities)/first-if-array';
import forceArray from '(utilities)/force-array';
import formatDate from '(utilities)/format-date';
import formatInputValue from '(utilities)/format-input-value';
import formatMinFractionDigits from '(utilities)/format-min-fraction-digits';
import { ListEventsData } from '(utilities)/list-events';
import { twMerge } from 'tailwind-merge';
import Pill from '../../../../../(components)/pill';
import CommentForm from './comment-form';

interface TimelineEventsProps {
  events: NonNullable<ListEventsData>;
}

const TimelineEvents = ({ events }: TimelineEventsProps) => (
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

          const inputs: [
            string,
            {
              label: string;
              type: keyof typeof formatInputValue;
              values: string[];
            }
          ][] = Object.entries(
            forceArray(event.inputs).reduce((acc, { input, option, value }) => {
              acc[input.id] = acc[input.id] ?? { values: [] };
              acc[input.id].label = input.label;
              acc[input.id].type = input.type;
              acc[input.id].values.push(value ?? option.label);
              return acc;
            }, {})
          );

          return (
            <Card as="article" key={event.id} size="0">
              <header className="flex items-baseline gap-4 p-4">
                <h1 className="truncate text-fg-1">
                  {eventType.mission ? eventType.mission.name : eventType.name}
                </h1>
                {eventType.mission && (
                  <Pill className="-mb-1">
                    {formatMinFractionDigits({
                      value: eventType.order + 1,
                    })}
                  </Pill>
                )}
                <DateTime
                  className="ml-auto shrink-0"
                  date={event.created_at}
                  formatter="time"
                />
              </header>
              {!!inputs.length && (
                <ul
                  className={twMerge(
                    'mb-2 flex flex-col divide-y divide-alpha-1 border-t border-alpha-1',
                    !!comments.length && 'border-b'
                  )}
                >
                  {inputs.map(([id, { label, type, values }]) => (
                    <li
                      className="grid grid-cols-2 px-4 py-2"
                      key={id}
                      role="figure"
                    >
                      <figcaption className="pr-3">{label}</figcaption>
                      <span>{formatInputValue[type](values)}</span>
                    </li>
                  ))}
                </ul>
              )}
              {!!comments.length && (
                <ul className="mb-2" role="section">
                  {comments.map(({ content, id, profile }) => (
                    <article
                      className="flex items-start gap-4 px-4 py-2"
                      key={id}
                      role="comment"
                    >
                      <Avatar name={profile.first_name} />
                      <div className="-mt-1 w-full">
                        <h1>
                          {profile.first_name} {profile.last_name}
                          <span className="sr-only">&nbsp;said</span>
                        </h1>
                        <DirtyHtml className="text-fg-1">{content}</DirtyHtml>
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
