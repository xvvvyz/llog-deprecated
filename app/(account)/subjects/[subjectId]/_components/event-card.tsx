import Disclosure from '@/(account)/subjects/[subjectId]/_components/disclosure';
import { GetEventData } from '@/_server/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '@/_server/get-event-type-with-inputs-and-options';
import { GetMissionData } from '@/_server/get-mission';
import { GetSessionData } from '@/_server/get-session';
import forceArray from '@/_utilities/force-array';
import { twMerge } from 'tailwind-merge';
import EventCommentForm from './event-comment-form';
import EventComments from './event-comments';
import EventForm from './event-form';

interface EventCardProps {
  className?: string;
  event?: GetEventData | GetSessionData['routines'][0]['event'][0];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<GetSessionData>['routines'][0];
  hideContent?: boolean;
  mission?: GetMissionData | GetEventData['type']['mission'];
  subjectId: string;
  userId: string;
}

const EventCard = ({
  className,
  event,
  eventType,
  hideContent,
  mission,
  subjectId,
  userId,
}: EventCardProps) => (
  <div className={twMerge('rounded border border-alpha-1 bg-bg-2', className)}>
    {mission && typeof eventType.order === 'number' && (
      <div className="bg-alpha-reverse-1 px-4 pt-8 text-xs uppercase tracking-widest text-fg-3 sm:px-8">
        Routine {eventType.order + 1}
      </div>
    )}
    {!hideContent && !!eventType.content && (
      <div className="border-b border-alpha-1 bg-alpha-reverse-1 pt-4">
        <Disclosure className="px-4 sm:px-8" disabled={!event}>
          {eventType.content}
        </Disclosure>
      </div>
    )}
    <EventForm
      className="px-4 py-8 sm:px-8"
      event={event}
      eventType={eventType}
      isMission={!!mission}
      subjectId={subjectId}
    />
    {event && (
      <div className="space-y-8 border-t border-alpha-1 bg-alpha-reverse-1 px-4 py-8 sm:px-8">
        <EventComments comments={forceArray(event.comments)} userId={userId} />
        <EventCommentForm eventId={event.id} />
      </div>
    )}
  </div>
);

export default EventCard;
