import LinkList from '@/(account)/_components/link-list';
import { ListSubjectEventTypesData } from '@/(account)/_server/list-subject-event-types';

interface EventTypeListProps {
  eventTypes: NonNullable<ListSubjectEventTypesData>;
  isTeamMember: boolean;
  subjectId: string;
}

const EventTypeList = ({
  eventTypes,
  isTeamMember,
  subjectId,
}: EventTypeListProps) => (
  <LinkList>
    {eventTypes.map((eventType) => (
      <LinkList.Item
        href={`/subjects/${subjectId}/event-type/${eventType.id}`}
        key={eventType.id}
        text={eventType.name as string}
        {...(isTeamMember
          ? {
              rightHref: `/subjects/${subjectId}/settings/event-type/${eventType.id}?back=/subjects/${subjectId}`,
              rightIcon: 'edit',
              rightLabel: 'Edit',
            }
          : {})}
      />
    ))}
  </LinkList>
);

export default EventTypeList;
