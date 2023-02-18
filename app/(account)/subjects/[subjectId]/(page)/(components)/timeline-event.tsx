'use client';

import Avatar from '(components)/avatar';
import Button from '(components)/button';
import Card from '(components)/card';
import DateTime from '(components)/date-time';
import DirtyHtml from '(components)/dirty-html';
import Pill from '(components)/pill';
import CODES from '(utilities)/constant-codes';
import EventTypes from '(utilities)/enum-event-types';
import forceArray from '(utilities)/force-array';
import formatInputValue from '(utilities)/format-input-value';
import formatRoutineNumber from '(utilities)/format-routine-number';
import { ArrowRightIcon, ChevronDownIcon } from '@heroicons/react/24/outline';
import { twMerge } from 'tailwind-merge';
import { useBoolean } from 'usehooks-ts';
import CommentForm from './comment-form';

interface TimelineEventProps {
  comments: any[];
  event: any;
  profile: any;
  subjectId: string;
  type: any;
}

const TimelineEvent = ({
  comments,
  event,
  profile,
  subjectId,
  type,
}: TimelineEventProps) => {
  const { toggle: toggleContent, value: contentExpanded } = useBoolean();
  const inputs = forceArray(event.inputs);

  return (
    <Card as="article" key={event.id} size="0">
      <header>
        <div className="-mx-px flex items-baseline gap-2 whitespace-nowrap rounded-t bg-alpha-reverse-1 px-4 py-1.5 text-xs uppercase tracking-widest text-fg-3">
          Recorded by
          <Avatar name={profile.first_name} size="xs" />
          <span className="truncate">
            {profile.first_name} {profile.last_name}
          </span>
          <DateTime
            className="ml-auto"
            date={event.created_at}
            formatter="time"
          />
        </div>
        <Button
          className="m-0 w-full gap-4 border-0 border-t border-alpha-1 px-4 py-3"
          href={`/subjects/${subjectId}/event/${event.id}`}
          variant="link"
        >
          {type.mission ? (
            <>
              <span className="truncate">{type.mission.name}</span>
              <Pill>{CODES.routine}</Pill>
              {formatRoutineNumber(type.order)}
            </>
          ) : (
            <span className="truncate">{type.name}</span>
          )}
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <Pill>
              {CODES[type.mission ? 'mission' : (type.type as EventTypes)]}
            </Pill>
            <ArrowRightIcon className="relative -right-[0.2em] w-5" />
          </div>
        </Button>
      </header>
      {type.content && (
        <div
          className={twMerge(
            'group relative h-14 select-none overflow-hidden px-4 pb-4 text-fg-3 after:absolute after:left-0 after:right-0 after:bottom-0 after:top-0 after:bg-gradient-to-b after:from-[hsla(45,6%,12%,0.4)] after:via-[hsla(45,6%,12%,0.9)] after:to-bg-2',
            contentExpanded && 'h-auto after:hidden'
          )}
          onClick={toggleContent}
          role="button"
        >
          <DirtyHtml>{type.content}</DirtyHtml>
          {!contentExpanded && (
            <ChevronDownIcon className="absolute left-1/2 bottom-2 z-10 w-5 -translate-x-1/2 text-fg-2 transition-colors group-hover:text-fg-1" />
          )}
        </div>
      )}
      {!!inputs.length && (
        <table className="w-full text-fg-3">
          <tbody>
            {(
              Object.entries(
                inputs.reduce((acc, { input, option, value }) => {
                  acc[input.id] = acc[input.id] ?? { values: [] };
                  acc[input.id].label = input.label;
                  acc[input.id].type = input.type;
                  acc[input.id].values.push(value ?? option?.label);
                  return acc;
                }, {})
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
                <td className="border-t border-alpha-1 px-4 py-2 align-top">
                  {label}
                </td>
                <td className="border-t border-l border-alpha-1 px-4 py-2 align-top">
                  {formatInputValue[type](values)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {!!comments.length && (
        <ul
          className="space-y-2 border-t border-alpha-1 px-4 pt-3 pb-4"
          role="section"
        >
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
      )}
      <CommentForm eventId={event.id} />
    </Card>
  );
};

export default TimelineEvent;
