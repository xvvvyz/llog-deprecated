import ForwardSearchParamsButton from '@/_components/forward-search-params-button';
import ForwardSearchParamsIconButton from '@/_components/forward-search-params-icon-button';
import { GetMissionWithSessionsData } from '@/_queries/get-mission-with-sessions';
import ChevronLeftIcon from '@heroicons/react/24/outline/ChevronLeftIcon';
import ChevronRightIcon from '@heroicons/react/24/outline/ChevronRightIcon';
import EyeIcon from '@heroicons/react/24/outline/EyeIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { ReactNode } from 'react';

interface SessionLayoutProps {
  children: ReactNode;
  isArchived?: boolean;
  isCreate?: boolean;
  isEdit?: boolean;
  isPublic?: boolean;
  isTeamMember: boolean;
  missionId: string;
  order?: string;
  sessionId?: string;
  sessions: NonNullable<GetMissionWithSessionsData>['sessions'];
  subjectId: string;
}

const SessionLayout = async ({
  children,
  isArchived,
  isCreate,
  isEdit,
  isPublic,
  isTeamMember,
  missionId,
  order,
  sessionId,
  sessions,
  subjectId,
}: SessionLayoutProps) => {
  const isEditOrCreate = isCreate || isEdit;
  const currentSession = sessions.find(({ id }) => id === sessionId);
  const sessionOrder = order ? Number(order) : currentSession?.order;
  if (typeof sessionOrder === 'undefined') return null;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  // eslint-disable-next-line prefer-const
  let { highestOrder, nextSessionId, previousSessionId } = sessions.reduce(
    (acc, session, i) => {
      acc.highestOrder = Math.max(acc.highestOrder, session.order);

      if (currentSession) {
        if (currentSession.id === session.id) {
          acc.nextSessionId = sessions[i + 1]?.id;
          acc.previousSessionId = sessions[i - 1]?.id;
        }
      } else {
        if (session.order === sessionOrder) {
          acc.nextSessionId = sessions[i + 1]?.id;
          acc.previousSessionId = sessions[i]?.id;
        }
      }

      return acc;
    },
    { highestOrder: -1, nextSessionId: null, previousSessionId: null } as {
      highestOrder: number;
      nextSessionId: string | null;
      previousSessionId: string | null;
    },
  );

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
          {currentSession?.draft || order ? (
            <span className="smallcaps text-fg-4">Draft</span>
          ) : (
            !isPublic &&
            !isArchived &&
            isTeamMember &&
            (isEditOrCreate ? (
              <ForwardSearchParamsButton
                className="-my-4 items-baseline"
                href={`/${shareOrSubjects}/${subjectId}/training-plans/${missionId}/sessions/${sessionId}`}
                replace
                scroll={false}
                variant="link"
              >
                <EyeIcon className="relative top-1 w-5" />
                View
              </ForwardSearchParamsButton>
            ) : (
              <ForwardSearchParamsButton
                className="-my-4 items-baseline"
                href={`/${shareOrSubjects}/${subjectId}/training-plans/${missionId}/sessions/${sessionId}/edit`}
                replace
                scroll={false}
                variant="link"
              >
                <PencilIcon className="relative top-1 w-5" />
                Edit
              </ForwardSearchParamsButton>
            ))
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
