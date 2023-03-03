import LinkList from '(components)/link-list';
import CODES from '(utilities)/constant-codes';
import EventTypesEnum from '(utilities)/enum-event-types';
import listSubjectEventTypes from '(utilities)/list-subject-event-types';

interface PageProps {
  isTeamMember: boolean;
  subjectId: string;
  type: EventTypesEnum;
}

const EventTypes = async ({ isTeamMember, subjectId, type }: PageProps) => {
  const { data: eventTypes } = await listSubjectEventTypes({ subjectId, type });
  if (!eventTypes?.length) return null;

  return eventTypes.map((eventType) => (
    <LinkList.Item
      href={`/subjects/${subjectId}/${type}/${eventType.id}`}
      key={eventType.id}
      pill={CODES[type]}
      text={eventType.name as string}
      {...(isTeamMember
        ? {
            rightHref: `/subjects/${subjectId}/settings/${type}/${eventType.id}?back=/subjects/${subjectId}`,
            rightIcon: 'edit',
            rightLabel: 'Edit',
          }
        : {})}
    />
  ));
};

export default EventTypes;
