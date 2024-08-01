import Button from '@/_components/button';
import CollapsibleArchive from '@/_components/collapsible-archive';
import Empty from '@/_components/empty';
import SubjectList from '@/_components/subject-list';
import SubscriptionStatus from '@/_constants/enum-subscription-status';
import getCurrentUser from '@/_queries/get-current-user';
import listSubjects, { ListSubjectsData } from '@/_queries/list-subjects';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';

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
      {!user.user_metadata.is_client && (
        <div className="mt-16 flex h-8 items-center justify-between gap-8 px-4">
          <h1 className="text-2xl">Subjects</h1>
          <Button
            href={
              user.app_metadata.subscription_status !==
                SubscriptionStatus.Active && teamSubjects.length >= 2
                ? '/upgrade'
                : '/subjects/create'
            }
            scroll={false}
            size="sm"
          >
            <PlusIcon className="-ml-0.5 w-5 stroke-2" />
            New subject
          </Button>
        </div>
      )}
      <div className="mt-16 space-y-4">
        {!clientSubjects.length && !teamSubjects.length && (
          <Empty className="mx-4">
            <InformationCircleIcon className="w-7" />
            {user.user_metadata.is_client
              ? 'No active subjects.'
              : 'Create a subject to get started.'}
          </Empty>
        )}
        <SubjectList
          clientSubjects={clientSubjects}
          teamSubjects={teamSubjects}
        />
        {(!!archivedTeamSubjects.length || !!archivedClientSubjects.length) && (
          <CollapsibleArchive>
            <SubjectList
              canUnarchive={
                user.app_metadata.subscription_status ===
                  SubscriptionStatus.Active || teamSubjects.length < 2
              }
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
