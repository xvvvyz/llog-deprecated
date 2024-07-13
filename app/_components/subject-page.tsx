import Avatar from '@/_components/avatar';
import BackIconButton from '@/_components/back-icon-button';
import Button from '@/_components/button';
import DirtyHtml from '@/_components/dirty-html';
import Empty from '@/_components/empty';
import EventTypes from '@/_components/event-types';
import ForwardSearchParamsButton from '@/_components/forward-search-params-button';
import SubjectEventsDateFilter from '@/_components/subject-events-date-filter';
import SubjectMenu from '@/_components/subject-menu';
import TimelineEvents from '@/_components/timeline-events';
import Tip from '@/_components/tip';
import TrainingPlans from '@/_components/training-plans';
import getCurrentUser from '@/_queries/get-current-user';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import listEvents from '@/_queries/list-events';
import listPublicEvents from '@/_queries/list-public-events';
import { SubjectDataJson } from '@/_types/subject-data-json';
import formatEventFilters from '@/_utilities/format-event-filters';
import ArrowLeftIcon from '@heroicons/react/24/outline/ArrowLeftIcon';
import ArrowTopRightOnSquareIcon from '@heroicons/react/24/outline/ArrowTopRightOnSquareIcon';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import Bars3Icon from '@heroicons/react/24/outline/Bars3Icon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { twMerge } from 'tailwind-merge';

interface SubjectPageProps {
  from?: string;
  limit?: string;
  isPublic?: boolean;
  subjectId: string;
  to?: string;
}

const SubjectPage = async ({
  from,
  limit,
  isPublic,
  subjectId,
  to,
}: SubjectPageProps) => {
  const f = formatEventFilters({ from, limit, to });

  const [{ data: subject }, { data: events }, user] = await Promise.all([
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    isPublic
      ? await listPublicEvents(subjectId, f)
      : await listEvents(subjectId, f),
    getCurrentUser(),
  ]);

  if (!subject) return null;
  const isTeamMember = !!user && subject.team_id === user.id;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';
  const subjectData = subject.data as SubjectDataJson;

  return (
    <div className="px-4">
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
        {isTeamMember && !isPublic ? (
          <SubjectMenu contentClassName="mt-0.5" subject={subject}>
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
                  Event types define the individual events that you want to
                  track.
                </p>
                <p>
                  Training plans are structured, long-term modification
                  programs.
                </p>
              </Tip>
              <Button
                colorScheme="transparent"
                href={`/subjects/${subjectId}/event-types/create`}
                scroll={false}
                size="sm"
              >
                <PlusIcon className="-ml-0.5 w-5" />
                Event type
              </Button>
              <Button
                colorScheme="transparent"
                href={`/subjects/${subjectId}/training-plans/create`}
                scroll={false}
                size="sm"
              >
                <PlusIcon className="-ml-0.5 w-5" />
                Training plan
              </Button>
            </div>
          )}
          {(subjectData?.banner || !!subjectData?.links?.length) && (
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
                          <ArrowTopRightOnSquareIcon className="mr-0.5 w-5" />
                        </Button>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          )}
          {!subject.archived && (
            <>
              <TrainingPlans
                isTeamMember={isTeamMember}
                subjectId={subjectId}
              />
              <EventTypes isTeamMember={isTeamMember} subjectId={subjectId} />
            </>
          )}
        </div>
      )}
      <div className="mt-16 flex gap-4">
        <SubjectEventsDateFilter />
        <ForwardSearchParamsButton
          colorScheme="transparent"
          href={`/${shareOrSubjects}/${subjectId}/insights`}
          scroll={false}
          size="sm"
        >
          Insights
          <ArrowUpRightIcon className="-mr-0.5 w-5" />
        </ForwardSearchParamsButton>
      </div>
      {!!events?.length ? (
        <TimelineEvents
          events={events}
          filters={f}
          isPublic={isPublic}
          isTeamMember={isTeamMember}
          subjectId={subjectId}
        />
      ) : (
        <>
          <div className="mx-4 mt-4 h-14 border-l-2 border-dashed border-alpha-2" />
          <Empty className="mt-4">
            <InformationCircleIcon className="w-7" />
            No events.
          </Empty>
        </>
      )}
    </div>
  );
};

export default SubjectPage;
