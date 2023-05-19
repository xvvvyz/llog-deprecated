import Button from '(components)/button';
import Empty from '(components)/empty';
import Header from '(components)/header';
import LinkList from '(components)/link-list';
import getCurrentTeamId from '(utilities)/get-current-team-id';
import listSubjects, { ListSubjectsData } from '(utilities)/list-subjects';

const Page = async () => {
  const { data: subjects } = await listSubjects();
  const currentTeamId = await getCurrentTeamId();
  if (!subjects?.length) return <Empty>No subjects</Empty>;

  const { clientSubjects, teamSubjects } = subjects.reduce(
    (acc, subject) => {
      if (subject.team_id === currentTeamId) acc.teamSubjects.push(subject);
      else acc.clientSubjects.push(subject);
      return acc;
    },
    {
      clientSubjects: [] as NonNullable<ListSubjectsData>,
      teamSubjects: [] as NonNullable<ListSubjectsData>,
    }
  );

  return (
    <>
      <Header>
        <h1 className="text-2xl">Subjects</h1>
        <Button href="/subjects/create" size="sm">
          Create subject
        </Button>
      </Header>
      <div className="space-y-4">
        <LinkList>
          {teamSubjects.map((subject) => (
            <LinkList.Item
              avatar={subject.image_uri}
              href={`/subjects/${subject.id}/timeline`}
              key={subject.id}
              rightHref={`/subjects/${subject.id}/settings?back=/subjects`}
              rightIcon="edit"
              rightLabel="Edit"
              text={subject.name}
            />
          ))}
        </LinkList>
        <LinkList>
          {clientSubjects.map((subject) => (
            <LinkList.Item
              avatar={subject.image_uri}
              href={`/subjects/${subject.id}/timeline`}
              key={subject.id}
              text={subject.name}
            />
          ))}
        </LinkList>
      </div>
    </>
  );
};

export const metadata = { title: 'Subjects' };
export const revalidate = 0;
export default Page;
