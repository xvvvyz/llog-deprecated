import ForwardSearchParamsIconButton from '@/_components/forward-search-params-icon-button';
import { GetTrainingPlanWithSessionsData } from '@/_queries/get-training-plan-with-sessions';
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { ReactNode } from 'react';

interface SessionLayoutProps {
  children: ReactNode;
  highestOrder: number;
  isCreate?: boolean;
  isEdit?: boolean;
  isPublic?: boolean;
  missionId: string;
  nextSessionId: string | null;
  order?: string;
  previousSessionId: string | null;
  sessionId?: string;
  sessions: NonNullable<GetTrainingPlanWithSessionsData>['sessions'];
  subjectId: string;
}

const SessionLayout = ({
  children,
  highestOrder,
  isCreate,
  isEdit,
  isPublic,
  missionId,
  nextSessionId,
  order,
  previousSessionId,
  sessionId,
  sessions,
  subjectId,
}: SessionLayoutProps) => {
  const isEditOrCreate = isCreate || isEdit;
  const currentSession = sessions.find(({ id }) => id === sessionId);
  const sessionOrder = order ? Number(order) : currentSession?.order;
  if (typeof sessionOrder === 'undefined') return null;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  if (
    isEditOrCreate &&
    sessions.length > 0 &&
    !previousSessionId &&
    !nextSessionId
  ) {
    sessions.some((session) => {
      if (session.order < sessionOrder) {
        previousSessionId = session.id;
      } else if (session.order > sessionOrder) {
        nextSessionId = session.id;
        return true;
      }
    });
  }

  const editSuffix = isEditOrCreate ? '/edit' : '';
  const nextSessionOrder = highestOrder + 1;

  return (
    <>
      <nav className="flex w-full items-center justify-between px-4 sm:px-8">
        <ForwardSearchParamsIconButton
          disabled={!previousSessionId}
          href={`/${shareOrSubjects}/${subjectId}/training-plans/${missionId}/sessions/${previousSessionId}${editSuffix}`}
          icon={<ChevronLeftIcon className="relative left-1 w-7" />}
          label="Previous session"
          replace
          scroll={false}
        />
        <div className="flex items-baseline gap-4">
          <span className="smallcaps text-fg-4">
            Session {sessionOrder + 1}
            {!isEditOrCreate && <> of {highestOrder + 1}</>}
          </span>
          {(currentSession?.draft || order) && (
            <span className="smallcaps text-fg-4">Draft</span>
          )}
        </div>
        {isEditOrCreate && !nextSessionId ? (
          <ForwardSearchParamsIconButton
            disabled={isCreate}
            href={`/${shareOrSubjects}/${subjectId}/training-plans/${missionId}/sessions/create/${nextSessionOrder}`}
            icon={<PlusIcon className="relative right-1 w-7" />}
            label="New session"
            replace
            scroll={false}
          />
        ) : (
          <ForwardSearchParamsIconButton
            disabled={!nextSessionId}
            href={`/${shareOrSubjects}/${subjectId}/training-plans/${missionId}/sessions/${nextSessionId}${editSuffix}`}
            icon={<ChevronRightIcon className="relative right-1 w-7" />}
            label="Next session"
            replace
            scroll={false}
          />
        )}
      </nav>
      {children}
    </>
  );
};

export default SessionLayout;
