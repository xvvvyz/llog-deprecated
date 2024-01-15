import Avatar from '@/_components/avatar';
import BackButton from '@/_components/back-button';
import DirtyHtml from '@/_components/dirty-html';
import DownloadEventsButton from '@/_components/download-events-button';
import EventTypes from '@/_components/event-types';
import Events from '@/_components/events';
import InsightsModalButton from '@/_components/insights-modal-button';
import Missions from '@/_components/missions';
import ShareModalButton from '@/_components/share-modal-button';
import TeamMemberHeader from '@/_components/team-member-header';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getCurrentUser from '@/_server/get-current-user';
import getPublicSubject from '@/_server/get-public-subject';
import getSubject from '@/_server/get-subject';
import { notFound } from 'next/navigation';

interface SubjectPageProps {
  isPublic?: boolean;
  subjectId: string;
}

const SubjectPage = async ({ isPublic, subjectId }: SubjectPageProps) => {
  const [{ data: subject }, user, teamId] = await Promise.all([
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    getCurrentUser(),
    getCurrentTeamId(),
  ]);

  if (!subject) notFound();
  const isTeamMember = !!teamId && subject.team_id === teamId;

  return (
    <div className="px-4">
      <div className="mt-16 flex h-8 items-center justify-between gap-8">
        {!isPublic && <BackButton href="/subjects" />}
        <h1 className="truncate text-2xl">{subject.name}</h1>
        <Avatar file={subject.image_uri} id={subject.id} />
      </div>
      {isTeamMember && (
        <TeamMemberHeader
          subjectId={subjectId}
          subjectShareCode={subject.share_code}
        />
      )}
      {!isPublic && subject.banner && (
        <DirtyHtml className="mx-auto mt-12 max-w-sm text-center text-fg-4">
          {subject.banner}
        </DirtyHtml>
      )}
      {!isPublic && !!user && (
        <div className="mt-16 space-y-4">
          <Missions isTeamMember={isTeamMember} subjectId={subjectId} />
          <EventTypes isTeamMember={isTeamMember} subjectId={subjectId} />
        </div>
      )}
      <div className="mb-2.5 mt-16 flex h-8 items-center justify-between gap-8">
        <h1 className="smallcaps -mb-0.5">Events</h1>
        <div className="flex gap-6">
          <DownloadEventsButton isPublic={isPublic} subjectId={subjectId} />
          <InsightsModalButton isPublic={isPublic} subjectId={subjectId} />
          {isTeamMember && (
            <ShareModalButton isPublic={subject.public} subjectId={subjectId} />
          )}
        </div>
      </div>
      <Events
        isPublic={isPublic}
        isTeamMember={isTeamMember}
        subjectId={subjectId}
        user={user}
      />
    </div>
  );
};

export default SubjectPage;
