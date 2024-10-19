import CollapsibleArchive from '@/_components/collapsible-archive';
import Empty from '@/_components/empty';
import SubjectList from '@/_components/subject-list';
import canInsertSubjectOnCurrentPlan from '@/_queries/can-insert-subject-on-current-plan';
import getCurrentUser from '@/_queries/get-current-user';
import listSubjects, { ListSubjectsData } from '@/_queries/list-subjects';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

const Page = async () => {
  const [{ data: canUnarchive }, { data: subjects }, user] = await Promise.all([
    canInsertSubjectOnCurrentPlan(),
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
      if (subject.team_id === user.app_metadata.active_team_id) {
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
      <h1 className="px-4 py-16 text-2xl">Subjects</h1>
      <div className="mx-4 space-y-4">
        {!clientSubjects.length && !teamSubjects.length && (
          <Empty>
            <InformationCircleIcon className="w-7" />
            {user.app_metadata.is_client ? (
              'No active subjects.'
            ) : (
              <div>
                Create a new <span className="text-fg-2">subject</span> using
                the yellow
                <br />
                <div className="mr-1.5 inline-flex size-4 items-center justify-center rounded-full bg-accent-1 text-bg-1">
                  <PlusIcon className="inline w-3 stroke-2" />
                </div>
                button. Let&rsquo;s make changes.
              </div>
            )}
          </Empty>
        )}
        <SubjectList
          clientSubjects={clientSubjects}
          teamSubjects={teamSubjects}
        />
        {(!!archivedTeamSubjects.length || !!archivedClientSubjects.length) && (
          <CollapsibleArchive>
            <SubjectList
              canUnarchive={canUnarchive}
              clientSubjects={archivedClientSubjects}
              teamSubjects={archivedTeamSubjects}
            />
          </CollapsibleArchive>
        )}
      </div>
    </>
  );
};

export default Page;
