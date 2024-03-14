import Avatar from '@/_components/avatar';
import DirtyHtml from '@/_components/dirty-html';
import DownloadEventsButton from '@/_components/download-events-button';
import EventTypes from '@/_components/event-types';
import Events from '@/_components/events';
import IconButton from '@/_components/icon-button';
import InsightsModalButton from '@/_components/insights-modal-button';
import Missions from '@/_components/missions';
import ShareModalButton from '@/_components/share-modal-button';
import TeamMemberHeader from '@/_components/team-member-header';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';

interface SubjectPageProps {
  eventsTo?: string;
  isPublic?: boolean;
  subjectId: string;
}

const SubjectPage = async ({
  eventsTo,
  isPublic,
  subjectId,
}: SubjectPageProps) => {
  const user = await getCurrentUserFromSession();

  const { data: subject } = await (isPublic
    ? getPublicSubject(subjectId)
    : getSubject(subjectId));

  if (!subject) return null;
  const isTeamMember = subject.team_id === user?.id;

  return (
    <div className="px-4">
      <div className="mt-16 flex h-8 items-center justify-between gap-8">
        {!isPublic && (
          <IconButton
            href="/subjects"
            icon={<ArrowLeftIcon className="relative -left-[0.16em] w-7" />}
            label="Back"
          />
        )}
        <h1 className="truncate text-2xl">{subject.name}</h1>
        <Avatar file={subject.image_uri} id={subject.id} />
      </div>
      {!isPublic && isTeamMember && (
        <TeamMemberHeader
          subjectId={subjectId}
          subjectShareCode={subject.share_code}
        />
      )}
      {!isPublic && subject.banner && (
        <DirtyHtml className="mt-14 text-fg-4">{subject.banner}</DirtyHtml>
      )}
      {!isPublic && !!user && (
        <div className="mt-16 space-y-4">
          <Missions isTeamMember={isTeamMember} subjectId={subjectId} />
          <EventTypes isTeamMember={isTeamMember} subjectId={subjectId} />
        </div>
      )}
      <div className="mb-2.5 mt-16 flex h-8 items-center justify-between">
        <h1 className="text-xl">Events</h1>
        <div className="flex gap-6">
          <DownloadEventsButton isPublic={isPublic} subjectId={subjectId} />
          <InsightsModalButton isPublic={isPublic} subjectId={subjectId} />
          {!isPublic && isTeamMember && (
            <ShareModalButton isPublic={subject.public} subjectId={subjectId} />
          )}
        </div>
      </div>
      <Events
        isPublic={isPublic}
        isTeamMember={isTeamMember}
        subjectId={subjectId}
        to={eventsTo}
        user={user}
      />
    </div>
  );
};

export default SubjectPage;
