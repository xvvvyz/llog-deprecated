import LinkList from '@/(account)/_components/link-list';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import getSubject from '@/(account)/_server/get-subject';
import listSubjectEventTypes from '@/(account)/_server/list-subject-event-types';

interface PageProps {
  params: {
    subjectId: string;
  };
}

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, { data: eventTypes }, teamId] = await Promise.all([
    getSubject(subjectId),
    listSubjectEventTypes(subjectId),
    getCurrentTeamId(),
  ]);

  if (!subject || !eventTypes?.length) return null;

  return (
    <LinkList>
      {eventTypes.map((eventType) => (
        <LinkList.Item
          href={`/subjects/${subjectId}/event-type/${eventType.id}`}
          key={eventType.id}
          text={eventType.name as string}
          {...(subject.team_id === teamId
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
};

export default Page;
