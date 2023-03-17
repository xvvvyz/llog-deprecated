import DirtyHtml from '(components)/dirty-html';
import forceArray from '(utilities)/force-array';
import { GetEventData } from '(utilities)/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '(utilities)/get-event-type-with-inputs-and-options';
import { GetMissionData } from '(utilities)/get-mission';
import { ListSessionRoutinesData } from '(utilities)/list-session-routines';
import { twMerge } from 'tailwind-merge';
import EventBanner from './event-banner';
import EventCommentForm from './event-comment-form';
import EventComments from './event-comments';
import EventForm from './event-form';

interface EventCardProps {
  event?: GetEventData | ListSessionRoutinesData['event'];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<ListSessionRoutinesData>[0];
  mission?: GetMissionData | GetEventData['type']['mission'];
  subjectId: string;
  userId: string;
}

const EventCard = ({
  event,
  eventType,
  mission,
  subjectId,
  userId,
}: EventCardProps) => (
  <div
    className={twMerge(
      'relative space-y-8 sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:pb-8',
      !event && 'sm:pt-8'
    )}
  >
    {event && (
      <EventBanner
        className="rounded-t sm:border-b sm:border-alpha-1 sm:bg-alpha-reverse-1 sm:py-2 sm:px-8"
        createdAt={event.created_at}
        profile={event.profile}
      />
    )}
    {!!eventType.content && (
      <DirtyHtml className="border-b border-alpha-1 pb-8 sm:px-8">
        {eventType.content}
      </DirtyHtml>
    )}
    <EventForm
      event={event}
      eventType={eventType}
      isMission={!!mission}
      subjectId={subjectId}
    />
    {event && (
      <div className="space-y-8 border-t border-alpha-1 pt-8 sm:px-8">
        <EventComments comments={forceArray(event.comments)} userId={userId} />
        <EventCommentForm eventId={event.id} />
      </div>
    )}
  </div>
);

export default EventCard;
