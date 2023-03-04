import Empty from '(components)/empty';
import LinkList from '(components)/link-list';
import getCurrentTeamId from '(utilities)/get-current-team-id';
import listSubjects from '(utilities)/list-subjects';

const Page = async () => {
  const { data: subjects } = await listSubjects();
  const currentTeamId = await getCurrentTeamId();
  if (!subjects?.length) return <Empty>Add a subject to get started</Empty>;

  return (
    <LinkList>
      {subjects.map((subject) => (
        <LinkList.Item
          avatar={subject.image_uri}
          href={`/subjects/${subject.id}`}
          key={subject.id}
          text={subject.name}
          {...(subject.team_id === currentTeamId
            ? {
                rightHref: `/subjects/${subject.id}/settings?back=/subjects`,
                rightIcon: 'edit',
                rightLabel: 'Edit',
              }
            : {})}
        />
      ))}
    </LinkList>
  );
};

export const metadata = { title: 'Subjects' };
export default Page;
