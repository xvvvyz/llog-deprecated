import DirtyHtml from '@/_components/dirty-html';
import EventCommentForm from '@/_components/event-comment-form';
import EventForm from '@/_components/event-form';
import { GetEventData } from '@/_queries/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '@/_queries/get-event-type-with-inputs-and-options';
import forceArray from '@/_utilities/force-array';
import { User } from '@supabase/supabase-js';

import EventComments, {
  EventCommentsProps,
} from '@/_components/event-comments';

interface EventCardProps {
  event?: NonNullable<GetEventData>;
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>;
  isArchived?: boolean;
  isPublic?: boolean;
  isTeamMember?: boolean;
  subjectId: string;
  user?: User | null;
}

const EventCard = ({
  event,
  eventType,
  isArchived,
  isPublic,
  isTeamMember,
  subjectId,
  user,
}: EventCardProps) => {
  const comments = forceArray(event?.comments);

  return (
    <div className="space-y-16 py-8">
      {eventType.content && (
        <DirtyHtml className="px-4 sm:px-8">{eventType.content}</DirtyHtml>
      )}
      {(event || (!isPublic && !isArchived)) && (
        <EventForm
          event={event}
          eventType={eventType}
          isArchived={isArchived}
          isPublic={isPublic}
          subjectId={subjectId}
        />
      )}
      {event && (!!comments.length || (!isPublic && !isArchived)) && (
        <div className="flex flex-col gap-8 px-4 sm:px-8">
          <EventComments
            comments={comments as EventCommentsProps['comments']}
            isArchived={isArchived}
            isPublic={isPublic}
            isTeamMember={isTeamMember}
            userId={user?.id}
          />
          {!isPublic && !isArchived && <EventCommentForm eventId={event.id} />}
        </div>
      )}
    </div>
  );
};

export default EventCard;
