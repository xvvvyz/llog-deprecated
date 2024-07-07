import Avatar from '@/_components/avatar';
import BackIconButton from '@/_components/back-icon-button';
import Button from '@/_components/button';
import DirtyHtml from '@/_components/dirty-html';
import EventTypes from '@/_components/event-types';
import ForwardSearchParamsButton from '@/_components/forward-search-params-button';
import Missions from '@/_components/missions';
import ScrollToTopHack from '@/_components/scroll-to-top-hack';
import SubjectEventsDateFilter from '@/_components/subject-events-date-filter';
import SubjectMenu from '@/_components/subject-menu';
import Tip from '@/_components/tip';
import getCurrentUser from '@/_queries/get-current-user';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import { SubjectDataJson } from '@/_types/subject-data-json';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { ReactNode } from 'react';
import { twMerge } from 'tailwind-merge';

interface SubjectLayoutProps {
  children: ReactNode;
  isPublic?: boolean;
  subjectId: string;
}

const SubjectLayout = async ({
  children,
  isPublic,
  subjectId,
}: SubjectLayoutProps) => {
  const [{ data: subject }, user] = await Promise.all([
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    getCurrentUser(),
  ]);

  if (!subject) return null;
  const isTeamMember = !!user && subject.team_id === user.id;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';
  const subjectData = subject.data as SubjectDataJson;

  return (
    <div className="px-4 pb-[calc(100vh-8rem)]">
      <ScrollToTopHack subjectId={subjectId} />
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
            contentClassName="mt-0.5"
            isPublic={isPublic}
            subject={subject}
          >
            <div className="flex gap-2 rounded-sm border border-alpha-3 pl-2 transition-colors hover:bg-alpha-1 active:bg-alpha-1">
              <Bars3Icon className="w-5" />
              <Avatar
                className="-m-px"
                file={subject.image_uri}
                id={subject.id}
              />
            </div>
          </SubjectMenu>
        ) : (
          <Avatar file={subject.image_uri} id={subject.id} />
        )}
      </div>
      {!isPublic && (
        <div className="mt-16 space-y-4">
          {!subject.archived && isTeamMember && (
            <div className="flex justify-end gap-4">
              <Tip align="start" side="bottom" tipClassName="space-y-4">
                <p>
                  <span className="font-bold text-fg-1">Event types</span>{' '}
                  define the events that can be recorded at any time.
                </p>
                <p>
                  <span className="font-bold text-fg-1">Training plans</span>{' '}
                  are long-term behavior modification plans for clients.
                </p>
              </Tip>
              <Button
                colorScheme="transparent"
                href={`/subjects/${subjectId}/event-types/create`}
                scroll={false}
                size="sm"
              >
                <PlusIcon className="w-5" />
                Event type
              </Button>
              <Button
                colorScheme="transparent"
                href={`/subjects/${subjectId}/training-plans/create`}
                scroll={false}
                size="sm"
              >
                <PlusIcon className="w-5" />
                Training plan
              </Button>
            </div>
          )}
          <div>
            {subjectData?.banner && (
              <DirtyHtml
                className={twMerge(
                  'rounded border border-alpha-2 px-4 py-2 text-fg-4',
                  subjectData?.links?.length && 'rounded-b-none border-b-0',
                )}
              >
                {subjectData?.banner}
              </DirtyHtml>
            )}
            {!!subjectData?.links?.length && (
              <nav>
                <ul>
                  {subjectData.links.map((link) => (
                    <li className="group" key={link.url}>
                      <Button
                        className={twMerge(
                          'w-full justify-between rounded-none border-b-0 pr-3 group-first:rounded-t group-last:rounded-b group-last:border-b',
                          subjectData?.banner && 'group-first:rounded-t-none',
                        )}
                        colorScheme="transparent"
                        href={link.url}
                        target="_blank"
                      >
                        {link.label}
                        <ArrowTopRightOnSquareIcon className="w-5" />
                      </Button>
                    </li>
                  ))}
                </ul>
              </nav>
            )}
          </div>
          {!subject.archived && (
            <>
              <Missions isTeamMember={isTeamMember} subjectId={subjectId} />
              <EventTypes isTeamMember={isTeamMember} subjectId={subjectId} />
            </>
          )}
        </div>
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
