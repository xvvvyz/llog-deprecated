import { BoxProps } from 'components/box';
import Card from 'components/card';
import { GetEventData } from 'utilities/get-event';
import { GetEventTypeData } from 'utilities/get-event-type';
import { ListSessionRoutinesData } from 'utilities/list-session-routines';
import sanitizeHtml from 'utilities/sanitize-html';
import EventForm from './event-form';

interface EventCardProps extends BoxProps {
  event?: GetEventData;
  eventType:
    | NonNullable<GetEventTypeData>
    | NonNullable<ListSessionRoutinesData>[0];
  subjectId: string;
}

const EventCard = ({
  event,
  eventType,
  subjectId,
  ...rest
}: EventCardProps) => (
  <Card breakpoint="sm" {...rest}>
    <h2 className="text-2xl">{eventType.name}</h2>
    {eventType.content && (
      <article
        className="prose mt-3"
        dangerouslySetInnerHTML={{ __html: sanitizeHtml(eventType.content) }}
      />
    )}
    <EventForm event={event} eventType={eventType} subjectId={subjectId} />
  </Card>
);

export default EventCard;
