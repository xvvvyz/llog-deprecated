import { BoxProps } from '(components)/box';
import Card from '(components)/card';
import DirtyHtml from '(components)/dirty-html';
import { GetEventData } from '(utilities)/get-event';
import { GetEventTypeData } from '(utilities)/get-event-type';
import { ListSessionRoutinesData } from '(utilities)/list-session-routines';
import EventForm from './event-form';

interface EventCardProps extends BoxProps {
  event?: GetEventData;
  eventType:
    | NonNullable<GetEventTypeData>
    | NonNullable<ListSessionRoutinesData>[0];
  isMission?: boolean;
  redirectOnSubmit?: boolean;
  subjectId: string;
}

const EventCard = ({
  event,
  eventType,
  isMission = false,
  redirectOnSubmit = true,
  subjectId,
  ...rest
}: EventCardProps) => (
  <Card breakpoint="sm" {...rest}>
    <div className="space-y-10">
      {(!isMission || eventType.content) && (
        <div className="space-y-3">
          {!isMission && <h2 className="text-2xl">{eventType.name}</h2>}
          {eventType.content && (
            <DirtyHtml as="article">{eventType.content}</DirtyHtml>
          )}
        </div>
      )}
      <EventForm
        event={event}
        eventType={eventType}
        isMission={isMission}
        redirectOnSubmit={redirectOnSubmit}
        subjectId={subjectId}
      />
    </div>
  </Card>
);

export default EventCard;
