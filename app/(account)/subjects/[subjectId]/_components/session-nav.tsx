import IconButton from '@/(account)/_components/icon-button';
import { GetMissionData } from '@/(account)/_server/get-mission';
import forceArray from '@/(account)/_utilities/force-array';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { notFound } from 'next/navigation';
import { twMerge } from 'tailwind-merge';

interface SessionNavProps {
  className?: string;
  mission: NonNullable<GetMissionData>;
  sessionId: string;
  subjectId: string;
}

const SessionNav = ({
  className,
  mission,
  sessionId,
  subjectId,
}: SessionNavProps) => {
  const sessions = forceArray(mission.sessions);
  const sessionIndex = sessions.findIndex(({ id }) => id === sessionId);
  if (sessionIndex === -1) notFound();
  const previousSessionId = sessions[sessionIndex - 1]?.id;
  const nextSessionId = sessions[sessionIndex + 1]?.id;

  return (
    <nav
      className={twMerge('flex w-full items-center justify-between', className)}
    >
      <IconButton
        disabled={!sessionIndex}
        href={`/subjects/${subjectId}/missions/${mission.id}/sessions/${previousSessionId}`}
        icon={<ChevronLeftIcon className="relative -left-2 w-7" />}
        label="Previous session"
        replace
      />
      <span className="text-fg-3">
        Session {sessionIndex + 1} of {sessions.length}
      </span>
      <IconButton
        disabled={sessionIndex === sessions.length - 1}
        href={`/subjects/${subjectId}/missions/${mission.id}/sessions/${nextSessionId}`}
        icon={<ChevronRightIcon className="relative -right-2 w-7" />}
        label="Next session"
        replace
      />
    </nav>
  );
};

export default SessionNav;
