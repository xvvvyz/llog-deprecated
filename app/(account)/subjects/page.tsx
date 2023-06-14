import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import LinkList from '@/(account)/_components/link-list';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import forceArray from '@/(account)/_utilities/force-array';
import Button from '@/_components/button';

import listSubjects, {
  ListSubjectsData,
} from '@/(account)/_server/list-subjects';

const Page = async () => {
  const { data: subjects } = await listSubjects();
  const teamId = await getCurrentTeamId();

  const {
    clientSubjects,
    teamSubjects,
  }: {
    clientSubjects: NonNullable<ListSubjectsData>;
    teamSubjects: NonNullable<ListSubjectsData>;
  } = forceArray(subjects).reduce(
    (acc, subject) => {
      if (subject.team_id === teamId) acc.teamSubjects.push(subject);
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
      {!!subjects?.length ? (
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
      ) : (
        <Empty>No subjects</Empty>
      )}
    </>
  );
};

export const metadata = { title: 'Subjects' };
export default Page;
