import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import Button from 'components/button';
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
    <nav className="flex w-full items-center justify-between py-2">
      <Button
        disabled={sessionNumber === 1}
        href={`/subjects/${subjectId}/missions/${missionId}/sessions/${previousSessionNumber}`}
        variant="link"
      >
        <ChevronLeftIcon className="relative -left-[0.5em] w-6" />
        <span className="sr-only">Previous session</span>
      </Button>
      <span className="text-fg-2">
        Session {sessionNumber} of {lastSessionNumber}
      </span>
      <Button
        disabled={sessionNumber === lastSessionNumber}
        href={`/subjects/${subjectId}/missions/${missionId}/sessions/${nextSessionNumber}`}
        variant="link"
      >
        <ChevronRightIcon className="relative -right-[0.5em] w-6" />
        <span className="sr-only">Next session</span>
      </Button>
    </nav>
  );
};

export default SessionPaginator;
