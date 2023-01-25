import Card from 'components/card';
import { GetEventData } from 'utilities/get-event';
import { GetEventTypeData } from 'utilities/get-event-type';
import { ListSessionRoutinesData } from 'utilities/list-session-routines';
import sanitizeHtml from 'utilities/sanitize-html';
import EventForm from './event-form';

interface EventCardProps {
  event?: GetEventData;
  eventType:
    | NonNullable<GetEventTypeData>
    | NonNullable<ListSessionRoutinesData>[0];
  subjectId: string;
}

const EventCard = ({ event, eventType, subjectId }: EventCardProps) => (
  <Card breakpoint="sm">
    <h2 className="text-2xl">{eventType.name}</h2>
    <article
      className="prose mt-3 flex flex-col gap-2"
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(eventType.content) }}
    />
    <EventForm event={event} eventType={eventType} subjectId={subjectId} />
  </Card>
);

export default EventCard;
