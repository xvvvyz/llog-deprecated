import CollapsibleArchive from '@/_components/collapsible-archive';
import Empty from '@/_components/empty';
import SubjectList from '@/_components/subject-list';
import getCurrentUser from '@/_queries/get-current-user';
import listSubjects, { ListSubjectsData } from '@/_queries/list-subjects';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';

export const metadata = { title: 'Subjects' };

const Page = async () => {
  const [{ data: subjects }, user] = await Promise.all([
    listSubjects(),
    getCurrentUser(),
  ]);

  if (!subjects || !user) return null;

  const {
    archivedClientSubjects,
    archivedTeamSubjects,
    clientSubjects,
    teamSubjects,
  } = subjects.reduce(
    (acc, subject) => {
      if (subject.team_id === user.id) {
        if (subject.archived) acc.archivedTeamSubjects.push(subject);
        else acc.teamSubjects.push(subject);
      } else {
        if (subject.archived) acc.archivedClientSubjects.push(subject);
        else acc.clientSubjects.push(subject);
      }

      return acc;
    },
    {
      archivedClientSubjects: [] as NonNullable<ListSubjectsData>,
      archivedTeamSubjects: [] as NonNullable<ListSubjectsData>,
      clientSubjects: [] as NonNullable<ListSubjectsData>,
      teamSubjects: [] as NonNullable<ListSubjectsData>,
    },
  );

  return (
    <>
      {!clientSubjects.length && !teamSubjects.length && (
        <Empty className="mx-4">
          <InformationCircleIcon className="w-7" />
          Add a subject to start collaboratively
          <br />
          tracking and improving behavior.
        </Empty>
      )}
      <SubjectList
        clientSubjects={clientSubjects}
        teamSubjects={teamSubjects}
      />
      {(!!archivedTeamSubjects.length || !!archivedClientSubjects.length) && (
        <CollapsibleArchive>
          <SubjectList
            clientSubjects={archivedClientSubjects}
            teamSubjects={archivedTeamSubjects}
          />
        </CollapsibleArchive>
      )}
    </>
  );
};

export default Page;
