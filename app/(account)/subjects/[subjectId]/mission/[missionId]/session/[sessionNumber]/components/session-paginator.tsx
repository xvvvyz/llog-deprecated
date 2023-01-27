import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import IconButton from 'components/icon-button';
import getLastMissionEventType from 'utilities/get-last-mission-event-type';

interface SessionPaginatorProps {
  missionId: string;
  sessionNumber: number;
  subjectId: string;
}

const SessionPaginator = async ({
  missionId,
  sessionNumber,
  subjectId,
}: SessionPaginatorProps) => {
  const { data: lastRoutine } = await getLastMissionEventType(missionId);
  const lastSessionNumber = (lastRoutine?.[0]?.session ?? 0) + 1;
  const previousSessionNumber = Math.max(1, sessionNumber - 1);
  const nextSessionNumber = Math.min(lastSessionNumber, sessionNumber + 1);

  return (
    <nav className="flex w-full items-center justify-between">
      <IconButton
        disabled={sessionNumber === 1}
        href={`/subjects/${subjectId}/mission/${missionId}/session/${previousSessionNumber}`}
        icon={<ChevronLeftIcon className="relative -left-[0.5em] w-6" />}
        label="Previous session"
      />
      <span className="text-fg-2">
        Session {sessionNumber} of {lastSessionNumber}
      </span>
      <IconButton
        disabled={sessionNumber === lastSessionNumber}
        href={`/subjects/${subjectId}/mission/${missionId}/session/${nextSessionNumber}`}
        icon={<ChevronRightIcon className="relative -right-[0.5em] w-6" />}
        label="Next session"
      />
    </nav>
  );
};

export default SessionPaginator;
