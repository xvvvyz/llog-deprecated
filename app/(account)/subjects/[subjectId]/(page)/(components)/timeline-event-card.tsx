'use client';

import Button from '(components)/button';
import Pill from '(components)/pill';
import CODES from '(utilities)/constant-codes';
import EventTypes from '(utilities)/enum-event-types';
import firstIfArray from '(utilities)/first-if-array';
import forceArray from '(utilities)/force-array';
import { ListEventsData } from '(utilities)/list-events';
import { ArrowRightIcon } from '@heroicons/react/24/outline';
import EventBanner from '../../(components)/event-banner';
import EventCommentForm from '../../(components)/event-comment-form';
import EventComments from '../../(components)/event-comments';
import EventInputs from '../../(components)/event-inputs';
import EventContentCollapsible from './event-content-collapsible';

interface TimelineEventCardProps {
  group: ListEventsData;
  subjectId: string;
  userId: string;
}

const TimelineEventCard = ({
  group,
  subjectId,
  userId,
}: TimelineEventCardProps) => {
  const lastEvent = group[group.length - 1];
  const lastEventType = firstIfArray(lastEvent.type);
  const sessionNumber = lastEventType.session?.order + 1;

  return (
    <article className="rounded border border-alpha-1 bg-bg-2">
      <header>
        <EventBanner
          className="rounded-t border-b border-alpha-1 bg-alpha-reverse-1 px-4 py-2"
          createdAt={lastEvent.created_at}
          createdAtFormatter="time"
          profile={firstIfArray(lastEvent.profile)}
        />
        <Button
          className="m-0 w-full gap-4 px-4 py-3"
          href={
            lastEventType.session
              ? `/subjects/${subjectId}/mission/${lastEventType.session.mission.id}/session/${sessionNumber}`
              : `/subjects/${subjectId}/${lastEventType.type}/${lastEventType.id}/event/${lastEvent.id}`
          }
          variant="link"
        >
          {lastEventType.session ? (
            <>
              <span className="truncate">
                {lastEventType.session.mission.name}
              </span>
              <Pill>Session {sessionNumber}</Pill>
            </>
          ) : (
            <span className="truncate">{lastEventType.name}</span>
          )}
          <div className="ml-auto flex shrink-0 items-center gap-3">
            <Pill>
              {
                CODES[
                  lastEventType.session
                    ? 'mission'
                    : (lastEventType.type as EventTypes)
                ]
              }
            </Pill>
            <ArrowRightIcon className="relative -right-[0.15em] w-5" />
          </div>
        </Button>
      </header>
      <ul>
        {group.map((event) => (
          <li
            className="space-y-4 pt-1 before:mb-3 before:block before:h-2 before:w-full before:border-y before:border-alpha-1 before:bg-alpha-reverse-1 first:pt-0 first:before:hidden"
            key={event.id}
          >
            <EventContentCollapsible
              content={firstIfArray(event.type).content}
            />
            <EventInputs className="my-1" inputs={forceArray(event.inputs)} />
            <EventComments
              className="px-4"
              comments={forceArray(event.comments)}
              userId={userId}
            />
            <EventCommentForm
              className="p-4 pt-1"
              eventId={event.id}
              inputClassName="rounded-sm"
            />
          </li>
        ))}
      </ul>
    </article>
  );
};

export default TimelineEventCard;
