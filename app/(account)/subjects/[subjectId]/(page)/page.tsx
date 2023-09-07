import DownloadEventsButton from '@/(account)/subjects/[subjectId]/_components/download-events-button';
import EventTypes from '@/(account)/subjects/[subjectId]/_components/event-types';
import Events from '@/(account)/subjects/[subjectId]/_components/events';
import InsightsModalButton from '@/(account)/subjects/[subjectId]/_components/insights-modal-button';
import Missions from '@/(account)/subjects/[subjectId]/_components/missions';
import TeamMemberHeader from '@/(account)/subjects/[subjectId]/_components/team-member-header';
import Avatar from '@/_components/avatar';
import BackButton from '@/_components/back-button';
import DirtyHtml from '@/_components/dirty-html';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getCurrentUser from '@/_server/get-current-user';
import getSubject from '@/_server/get-subject';

interface PageProps {
  params: { subjectId: string };
}

export const generateMetadata = async ({
  params: { subjectId },
}: PageProps) => {
  const { data: subject } = await getSubject(subjectId);

  return {
    title: subject?.name,
  };
};

export const revalidate = 0;

const Page = async ({ params: { subjectId } }: PageProps) => {
  const [{ data: subject }, user, teamId] = await Promise.all([
    getSubject(subjectId),
    getCurrentUser(),
    getCurrentTeamId(),
  ]);

  if (!subject || !user) return null;
  const isTeamMember = subject.team_id === teamId;

  return (
    <div className="px-4">
      <div className="mt-16 flex h-8 items-center justify-between gap-8">
        <BackButton href="/subjects" />
        <h1 className="truncate text-2xl">{subject.name}</h1>
        <Avatar file={subject.image_uri} name={subject.name} />
      </div>
      {isTeamMember && (
        <TeamMemberHeader
          subjectId={subjectId}
          subjectShareCode={subject.share_code}
        />
      )}
      {subject.banner && (
        <DirtyHtml className="mx-auto mt-12 max-w-sm text-center text-fg-4">
          {subject.banner}
        </DirtyHtml>
      )}
      <div className="mt-16 space-y-4">
        <Missions isTeamMember={isTeamMember} subjectId={subjectId} />
        <EventTypes isTeamMember={isTeamMember} subjectId={subjectId} />
      </div>
      <div className="mb-2.5 mt-16 flex h-8 items-center justify-between gap-8">
        <h1 className="text-2xl">Timeline</h1>
        <div className="flex gap-4">
          <DownloadEventsButton subjectId={subjectId} />
          <InsightsModalButton subjectId={subjectId} />
        </div>
      </div>
      <Events
        isTeamMember={isTeamMember}
        subjectId={subjectId}
        userId={user.id}
      />
    </div>
  );
};

export default Page;
