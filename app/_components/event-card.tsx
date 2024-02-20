import Avatar from '@/_components/avatar';
import Disclosure from '@/_components/disclosure';
import { GetEventData } from '@/_queries/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '@/_queries/get-event-type-with-inputs-and-options';
import { GetMissionWithSessionsData } from '@/_queries/get-mission-with-sessions';
import { GetSessionWithDetailsData } from '@/_queries/get-session-with-details';
import forceArray from '@/_utilities/force-array';
import { User } from '@supabase/supabase-js';
import EventCommentForm from './event-comment-form';
import EventComments, { EventCommentsProps } from './event-comments';
import EventForm from './event-form';

interface EventCardProps {
  disabled?: boolean;
  event?:
    | NonNullable<GetEventData>
    | NonNullable<GetSessionWithDetailsData>['modules'][0]['event'][0];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<GetSessionWithDetailsData>['modules'][0];
  hideContent?: boolean;
  isPublic?: boolean;
  isTeamMember?: boolean;
  mission?: NonNullable<GetMissionWithSessionsData>;
  subjectId: string;
  user?: User | null;
}

const EventCard = ({
  disabled,
  event,
  eventType,
  hideContent,
  isPublic,
  isTeamMember,
  mission,
  subjectId,
  user,
}: EventCardProps) => {
  const comments = forceArray(event?.comments);
  const showComments = event && (!isPublic || !!comments.length);
  const showDescription = !hideContent && !!eventType.content;
  const showModule = mission && typeof eventType.order === 'number';

  return (
    <>
      {(showModule || event || showDescription) && (
        <div className="flex flex-col gap-6 py-7">
          {(showModule || event) && (
            <div className="smallcaps flex justify-between gap-4 whitespace-nowrap px-4 align-baseline text-fg-4 sm:px-8">
              {showModule && <>Module {(eventType.order as number) + 1}</>}
              {event && (
                <div className="flex min-w-0 flex-row items-center gap-4">
                  <span>{mission ? 'Completed' : 'Recorded'} by</span>
                  <Avatar
                    className="-my-[0.15rem]"
                    file={event.profile?.image_uri}
                    id={event.profile?.id}
                    size="xs"
                  />
                  <span className="truncate">
                    {event.profile?.first_name} {event.profile?.last_name}
                  </span>
                </div>
              )}
            </div>
          )}
          {showDescription && (
            <Disclosure disabled={!event}>
              {eventType.content as string}
            </Disclosure>
          )}
        </div>
      )}
      {(!isPublic || event) && (
        <EventForm
          disabled={disabled}
          event={event}
          eventType={eventType}
          isMission={!!mission}
          isPublic={isPublic}
          subjectId={subjectId}
        />
      )}
      {showComments && (
        <div className="flex flex-col gap-8 border-t border-alpha-1 px-4 py-8 sm:px-8">
          <EventComments
            comments={comments as EventCommentsProps['comments']}
            isPublic={isPublic}
            isTeamMember={isTeamMember}
            userId={user?.id}
          />
          {!isPublic && <EventCommentForm eventId={event.id} />}
        </div>
      )}
    </>
  );
};

export default EventCard;
