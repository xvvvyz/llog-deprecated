import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import LinkList from '@/(account)/_components/link-list';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import forceArray from '@/(account)/_utilities/force-array';
import Button from '@/_components/button';

import listSubjects, {
  ListSubjectsData,
} from '@/(account)/_server/list-subjects';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Subjects',
};

export const revalidate = 0;

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
    },
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
                avatars={[subject]}
                href={`/subjects/${subject.id}/timeline`}
                key={subject.id}
                rightHref={`/subjects/${subject.id}/edit`}
                rightIcon="edit"
                rightLabel="Edit"
                text={subject.name}
              />
            ))}
          </LinkList>
          <LinkList>
            {clientSubjects.map((subject) => (
              <LinkList.Item
                avatars={[subject]}
                href={`/subjects/${subject.id}/timeline`}
                key={subject.id}
                text={subject.name}
              />
            ))}
          </LinkList>
        </div>
      ) : (
        <Empty className="mx-4">
          <InformationCircleIcon className="w-7" />
          Subjects can be dogs, cats, humans or
          <br />
          anything else you want to track.
        </Empty>
      )}
    </>
  );
};

export default Page;
