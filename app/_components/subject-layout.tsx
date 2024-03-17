import Avatar from '@/_components/avatar';
import BackIconButton from '@/_components/back-icon-button';
import DirtyHtml from '@/_components/dirty-html';
import EventTypes from '@/_components/event-types';
import ForwardSearchParamsButton from '@/_components/forward-search-params-button';
import Missions from '@/_components/missions';
import SubjectEventsDateFilter from '@/_components/subject-events-date-filter';
import SubjectMenu from '@/_components/subject-menu';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import { ReactNode } from 'react';

interface SubjectPageProps {
  children: ReactNode;
  isPublic?: boolean;
  subjectId: string;
}

const SubjectLayout = async ({
  children,
  isPublic,
  subjectId,
}: SubjectPageProps) => {
  const user = await getCurrentUserFromSession();

  const { data: subject } = await (isPublic
    ? getPublicSubject(subjectId)
    : getSubject(subjectId));

  if (!subject) return null;
  const isTeamMember = subject.team_id === user?.id;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';

  return (
    <div className="px-4 pb-[calc(100vh-8rem)]">
      <div className="mt-16 flex h-8 items-center justify-between gap-6">
        <div className="flex min-w-0 items-center gap-6">
          {!isPublic && (
            <BackIconButton
              icon={<ArrowLeftIcon className="relative -left-[0.16em] w-7" />}
              label="Back"
            />
          )}
          <h1 className="truncate text-2xl">{subject.name}</h1>
        </div>
        {isTeamMember ? (
          <SubjectMenu
            className="gap-2 rounded-sm border border-alpha-3 pl-2 hover:bg-alpha-1"
            isPublic={isPublic}
            itemsClassName="mt-10"
            subject={subject}
          >
            <Bars3Icon className="w-5" />
            <Avatar
              className="-m-px"
              file={subject.image_uri}
              id={subject.id}
            />
          </SubjectMenu>
        ) : (
          <Avatar file={subject.image_uri} id={subject.id} />
        )}
      </div>
      {!isPublic && (
        <>
          {subject.banner && (
            <DirtyHtml className="mt-14 px-4 text-center sm:px-8">
              {subject.banner}
            </DirtyHtml>
          )}
          <div className="mt-16 space-y-4">
            <Missions isTeamMember={isTeamMember} subjectId={subjectId} />
            <EventTypes isTeamMember={isTeamMember} subjectId={subjectId} />
          </div>
        </>
      )}
      <div className="mt-16 flex h-8 items-center justify-between">
        <div className="flex divide-x divide-alpha-3 rounded-sm border border-alpha-3">
          <ForwardSearchParamsButton
            activeClassName="text-fg-2 bg-alpha-1"
            colorScheme="transparent"
            className="rounded-r-none border-0"
            href={`/${shareOrSubjects}/${subjectId}/events`}
            replace
            scroll={false}
            size="sm"
          >
            Events
          </ForwardSearchParamsButton>
          <ForwardSearchParamsButton
            activeClassName="text-fg-2 bg-alpha-1"
            colorScheme="transparent"
            className="rounded-l-none border-0"
            href={`/${shareOrSubjects}/${subjectId}/insights`}
            replace
            scroll={false}
            size="sm"
          >
            Insights
          </ForwardSearchParamsButton>
        </div>
        <SubjectEventsDateFilter />
      </div>
      {children}
    </div>
  );
};

export default SubjectLayout;
