import Disclosure from '@/(account)/subjects/[subjectId]/_components/disclosure';
import Avatar from '@/_components/avatar';
import { GetEventData } from '@/_server/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '@/_server/get-event-type-with-inputs-and-options';
import { GetMissionWithSessionsData } from '@/_server/get-mission-with-sessions';
import { GetSessionWithDetailsData } from '@/_server/get-session-with-details';
import forceArray from '@/_utilities/force-array';
import { twMerge } from 'tailwind-merge';
import EventCommentForm from './event-comment-form';
import EventComments from './event-comments';
import EventForm from './event-form';

interface EventCardProps {
  className?: string;
  disabled: boolean;
  event?: GetEventData | GetSessionWithDetailsData['modules'][0]['event'][0];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<GetSessionWithDetailsData>['modules'][0];
  hideContent?: boolean;
  isTeamMember: boolean;
  mission?: GetMissionWithSessionsData | GetEventData['type']['mission'];
  subjectId: string;
  userId: string;
}

const EventCard = ({
  className,
  disabled,
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
    <div
      className={twMerge('form gap-0 p-0', disabled && 'disabled', className)}
    >
      {event && (
        <div
          className={twMerge(
            'smallcaps flex items-center gap-4 whitespace-nowrap px-4 pt-4 sm:rounded-t sm:px-8',
            !showModule && !showDescription && 'border-b border-alpha-1 pb-4',
          )}
        >
          <Avatar
            className="-my-[0.15rem]"
            name={event.profile.first_name}
            size="xs"
          />
          {event.profile.first_name} {event.profile.last_name}
          <span className="ml-auto">{mission ? 'Completed' : 'Recorded'}</span>
        </div>
      )}
      {(showModule || showDescription) && (
        <div className="flex flex-col gap-8 border-b border-alpha-1 py-8">
          {showModule && (
            <div className="px-4 font-mono text-fg-4 sm:px-8">
              Module {(eventType.order as number) + 1}
            </div>
          )}
          {showDescription && (
            <Disclosure disabled={!event}>
              {eventType.content as string}
            </Disclosure>
          )}
        </div>
      )}
      <EventForm
        className={twMerge(
          'bg-alpha-reverse-1 px-4 py-8 sm:px-8',
          !showModule && !showDescription && !event && 'sm:rounded-t',
          !event && 'sm:rounded-b',
        )}
        disabled={disabled}
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
