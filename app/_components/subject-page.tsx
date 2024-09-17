import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import DirtyHtml from '@/_components/dirty-html';
import * as DropdownMenu from '@/_components/dropdown-menu';
import Empty from '@/_components/empty';
import EventTypes from '@/_components/event-types';
import IconButton from '@/_components/icon-button';
import Protocols from '@/_components/protocols';
import SubjectEventsDateFilter from '@/_components/subject-events-date-filter';
import SubjectMenu from '@/_components/subject-menu';
import TimelineEvents from '@/_components/timeline-events';
import Tip from '@/_components/tip';
import SubscriptionStatus from '@/_constants/enum-subscription-status';
import countUnarchivedTeamSubjects from '@/_queries/count-unarchived-team-subjects';
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
import ChevronDownIcon from '@heroicons/react/24/outline/ChevronDownIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import TableCellsIcon from '@heroicons/react/24/outline/TableCellsIcon';
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

  const [
    { data: subject },
    { data: events },
    user,
    { count: unarchivedTeamSubjectsCount },
  ] = await Promise.all([
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    isPublic
      ? await listPublicEvents(subjectId, f)
      : await listEvents(subjectId, f),
    getCurrentUser(),
    isPublic ? Promise.resolve({ count: 0 }) : countUnarchivedTeamSubjects(),
  ]);

  if (!subject || !events) return null;
  const isTeamMember = !!user && subject.team_id === user.id;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';
  const subjectData = subject.data as SubjectDataJson;

  return (
    <div className="px-4">
      <div className="mt-16 flex h-8 items-center justify-between gap-4">
        <div className="min-w-0">
          <div className="flex items-center gap-4 sm:gap-6">
            {!isPublic && (
              <IconButton
                className="-ml-3.5"
                href="/subjects"
                icon={<ArrowLeftIcon className="w-7" />}
                label="Back"
              />
            )}
            <div className="min-w-0">
              {!isPublic && isTeamMember ? (
                <SubjectMenu
                  canUnarchive={
                    user.app_metadata.subscription_status ===
                      SubscriptionStatus.Active ||
                    (unarchivedTeamSubjectsCount ?? 0) < 2
                  }
                  subject={subject}
                />
              ) : (
                <h1 className="font-semibold truncate text-2xl">
                  {subject.name}
                </h1>
              )}
            </div>
          </div>
        </div>
        {!isPublic && isTeamMember && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button
                className="shrink-0 pl-5"
                disabled={subject.archived}
                size="sm"
              >
                New&hellip;
                <ChevronDownIcon className="w-5 stroke-2" />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Portal>
              <DropdownMenu.Content>
                <div className="relative">
                  <DropdownMenu.Button
                    href={`/subjects/${subjectId}/event-types/create`}
                    scroll={false}
                  >
                    <PlusIcon className="w-5 text-fg-4" />
                    Event type
                  </DropdownMenu.Button>
                  <Tip
                    align="end"
                    className="absolute right-4 top-2.5"
                    tipClassName="mr-0.5"
                  >
                    Event types allow you to record events as they occur.
                  </Tip>
                </div>
                <div className="relative">
                  <DropdownMenu.Button
                    href={`/subjects/${subjectId}/protocols/create`}
                    scroll={false}
                  >
                    <PlusIcon className="w-5 text-fg-4" />
                    Protocol
                  </DropdownMenu.Button>
                  <Tip
                    align="end"
                    className="absolute right-4 top-2.5"
                    tipClassName="mr-0.5"
                  >
                    Protocols are structured plans to be completed over time.
                  </Tip>
                </div>
              </DropdownMenu.Content>
            </DropdownMenu.Portal>
          </DropdownMenu.Root>
        )}
        {(isPublic || !isTeamMember) && (
          <Avatar
            className="size-[calc(theme('spacing.8')+2px)]"
            file={subject.image_uri}
            id={subject.id}
          />
        )}
      </div>
      {!isPublic && (
        <div className="mt-16 space-y-4">
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
                    {subjectData.links.map((link, i) => (
                      <li className="group" key={`${link.url}-${i}`}>
                        <Button
                          className={twMerge(
                            'w-full justify-between rounded-none border-b-0 group-first:rounded-t group-last:rounded-b group-last:border-b',
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
          )}
          {!subject.archived && (
            <>
              <Protocols isTeamMember={isTeamMember} subjectId={subjectId} />
              <EventTypes isTeamMember={isTeamMember} subjectId={subjectId} />
            </>
          )}
        </div>
      )}
      <div className="mt-16 flex gap-4">
        <SubjectEventsDateFilter />
        <Button
          colorScheme="transparent"
          href={`/${shareOrSubjects}/${subjectId}/insights`}
          scroll={false}
          size="sm"
        >
          Insights
          <ArrowUpRightIcon className="-mr-0.5 w-5" />
        </Button>
      </div>
      {!!events.length ? (
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
            <TableCellsIcon className="w-7" />
            No events.
          </Empty>
        </>
      )}
    </div>
  );
};

export default SubjectPage;
