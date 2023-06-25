import { GetEventData } from '@/(account)/_server/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '@/(account)/_server/get-event-type-with-inputs-and-options';
import { GetMissionWithActiveSessionsData } from '@/(account)/_server/get-mission-with-active-sessions';
import { GetSessionWithEventsData } from '@/(account)/_server/get-session-with-events';
import forceArray from '@/(account)/_utilities/force-array';
import Disclosure from '@/(account)/subjects/[subjectId]/_components/disclosure';
import { twMerge } from 'tailwind-merge';
import EventCommentForm from './event-comment-form';
import EventComments from './event-comments';
import EventForm from './event-form';

interface EventCardProps {
  className?: string;
  event?: GetEventData | GetSessionWithEventsData['modules'][0]['event'][0];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<GetSessionWithEventsData>['modules'][0];
  hideContent?: boolean;
  isTeamMember: boolean;
  mission?: GetMissionWithActiveSessionsData | GetEventData['type']['mission'];
  subjectId: string;
  userId: string;
}

const EventCard = ({
  className,
  event,
  eventType,
  hideContent,
  isTeamMember,
  mission,
  subjectId,
  userId,
}: EventCardProps) => {
  const showModule = mission && typeof eventType.order === 'number';
  const showDescription = !hideContent && !!eventType.content;

  return (
    <div className={twMerge('form gap-0 p-0', className)}>
      {(showModule || showDescription) && (
        <div className="flex flex-col gap-8 border-b border-alpha-1 py-8">
          {showModule && (
            <div className="smallcaps px-4 font-mono sm:px-8">
              Module {(eventType.order as number) + 1}
            </div>
          )}
          {showDescription && (
            <Disclosure className="px-4 sm:px-8" disabled={!event}>
              {eventType.content as string}
            </Disclosure>
          )}
        </div>
      )}
      <EventForm
        className={twMerge(
          'bg-alpha-reverse-1 px-4 py-8 sm:px-8',
          !showModule && !showDescription && 'sm:rounded-t',
          !event && 'sm:rounded-b'
        )}
        event={event}
        eventType={eventType}
        isMission={!!mission}
        subjectId={subjectId}
      />
      {event && (
        <div className="space-y-8 border-t border-alpha-1 px-4 py-8 sm:px-8">
          <EventComments
            comments={forceArray(event.comments)}
            isTeamMember={isTeamMember}
            userId={userId}
          />
          <EventCommentForm eventId={event.id} />
        </div>
      )}
    </div>
  );
};

export default EventCard;
