import { ListItem } from '(components)/link-list';
import CODES from '(utilities)/constant-codes';
import EventTypesEnum from '(utilities)/enum-event-types';
import listSubjectEventTypes from '(utilities)/list-subject-event-types';

interface PageProps {
  subjectId: string;
  type: EventTypesEnum;
}

const EventTypes = async ({ subjectId, type }: PageProps) => {
  const { data: eventTypes } = await listSubjectEventTypes({ subjectId, type });
  if (!eventTypes?.length) return null;

  return eventTypes.map((eventType) => (
    <ListItem
      href={`/subjects/${subjectId}/event/${eventType.id}`}
      key={eventType.id}
      pill={CODES[type]}
      text={eventType.name as string}
    />
  ));
};

export default EventTypes;
