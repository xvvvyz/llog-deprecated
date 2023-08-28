import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import getCurrentTeamId from '@/(account)/_server/get-current-team-id';
import forceArray from '@/(account)/_utilities/force-array';
import SubjectLinkListItemMenu from '@/(account)/subjects/_components/subject-link-list-item-menu';
import Button from '@/_components/button';
import {
  ArrowRightIcon,
  InformationCircleIcon,
} from '@heroicons/react/24/outline';

import Avatar from '@/(account)/_components/avatar';
import listSubjects, {
  ListSubjectsData,
} from '@/(account)/_server/list-subjects';

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
      {subjects?.length ? (
        <div className="space-y-4">
          {!!teamSubjects.length && (
            <ul className="mx-4 rounded border border-alpha-1 bg-bg-2 py-1">
              {teamSubjects.map((subject) => (
                <li
                  className="flex items-stretch hover:bg-alpha-1"
                  key={subject.id}
                >
                  <Button
                    className="m-0 w-full gap-4 px-4 py-3 pr-0 leading-snug [overflow-wrap:anywhere]"
                    href={`/subjects/${subject.id}/timeline`}
                    variant="link"
                  >
                    <Avatar
                      className="-my-0.5"
                      file={subject.image_uri}
                      key={subject.id}
                      name={subject.name}
                      size="sm"
                    />
                    {subject.name}
                  </Button>
                  <SubjectLinkListItemMenu subjectId={subject.id} />
                </li>
              ))}
            </ul>
          )}
          {!!clientSubjects.length && (
            <ul className="mx-4 rounded border border-alpha-1 bg-bg-2 py-1">
              {clientSubjects.map((subject) => (
                <li key={subject.id}>
                  <Button
                    className="m-0 w-full gap-6 px-4 py-3 leading-snug [overflow-wrap:anywhere] hover:bg-alpha-1"
                    href={`/subjects/${subject.id}/timeline`}
                    variant="link"
                  >
                    <Avatar
                      className="-my-0.5"
                      file={subject.image_uri}
                      key={subject.id}
                      name={subject.name}
                      size="sm"
                    />
                    {subject.name}
                    <ArrowRightIcon className="ml-auto w-5 shrink-0" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
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
