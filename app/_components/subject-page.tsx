import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import DirtyHtml from '@/_components/dirty-html';
import Empty from '@/_components/empty';
import EventTypes from '@/_components/event-types';
import PageBreadcrumb from '@/_components/page-breadcrumb';
import Protocols from '@/_components/protocols';
import SubjectMenu from '@/_components/subject-menu';
import TimelineEvents from '@/_components/timeline-events';
import canInsertSubjectOnCurrentPlan from '@/_queries/can-insert-subject-on-current-plan';
import getCurrentUser from '@/_queries/get-current-user';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import listEventTypes from '@/_queries/list-event-types';
import listEvents from '@/_queries/list-events';
import listProtocols from '@/_queries/list-protocols';
import listPublicEvents from '@/_queries/list-public-events';
import { SubjectDataJson } from '@/_types/subject-data-json';
import formatEventFilters from '@/_utilities/format-event-filters';
import ChartBarSquareIcon from '@heroicons/react/24/outline/ChartBarSquareIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import LinkIcon from '@heroicons/react/24/outline/LinkIcon';
import PencilIcon from '@heroicons/react/24/outline/PencilIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { headers } from 'next/headers';

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
    { data: canUnarchive },
    { data: eventTypes },
    { data: events },
    { get },
    { data: protocols },
    { data: subject },
    user,
  ] = await Promise.all([
    isPublic
      ? Promise.resolve({ data: false })
      : canInsertSubjectOnCurrentPlan(),
    !isPublic ? listEventTypes(subjectId) : Promise.resolve({ data: [] }),
    isPublic
      ? await listPublicEvents(subjectId, f)
      : await listEvents(subjectId, f),
    headers(),
    !isPublic ? listProtocols(subjectId) : Promise.resolve({ data: [] }),
    isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
    getCurrentUser(),
  ]);

  if (!subject) return null;

  const isTeamMember =
    !!user && subject.team_id === user.app_metadata.active_team_id;

  const subjectData = subject.data as SubjectDataJson;

  return (
    <>
      <PageBreadcrumb
        isPublic={isPublic}
        last={
          <div className="flex items-center gap-2">
            <Avatar
              className="size-5"
              file={subject.image_uri}
              id={subject.id}
            />
            <div className="min-w-0">
              <div className="truncate">{subject.name}</div>
            </div>
          </div>
        }
      />
      <div className="px-4">
        {subjectData?.banner && (
          <DirtyHtml className="-my-1 text-fg-4">
            {subjectData?.banner}
          </DirtyHtml>
        )}
        {!!subjectData?.links?.length && (
          <nav className="-my-1 mt-4">
            <ul className="flex flex-wrap">
              {subjectData.links.map((link, i) => (
                <li className="mr-6" key={`${link.url}-${i}`}>
                  <Button
                    className="-my-1 py-1"
                    href={link.url}
                    target={
                      link.url.includes(get('host') ?? '')
                        ? undefined
                        : '_blank'
                    }
                    variant="link"
                  >
                    <LinkIcon className="w-5" />
                    {link.label}
                  </Button>
                </li>
              ))}
            </ul>
          </nav>
        )}
        {isTeamMember && (
          <div className="mt-5 grid w-full grid-cols-2 gap-4 sm:grid-cols-3">
            <Button
              colorScheme="transparent"
              href={`/subjects/${subject.id}/edit`}
              size="sm"
            >
              <PencilIcon className="-ml-0.5 w-5 text-fg-4" />
              Edit
            </Button>
            <Button
              className="hidden sm:flex"
              colorScheme="transparent"
              href={`/subjects/${subject.id}/insights`}
              size="sm"
            >
              <ChartBarSquareIcon className="-ml-0.5 w-5 text-fg-4" />
              Insights
            </Button>
            <SubjectMenu canUnarchive={canUnarchive} subject={subject} />
          </div>
        )}
        {!subject.archived && (!!protocols?.length || !!eventTypes?.length) && (
          <div className="mt-16 space-y-4 empty:mt-0">
            {!!protocols?.length && (
              <Protocols
                isTeamMember={isTeamMember}
                protocols={protocols}
                subjectId={subjectId}
              />
            )}
            {!!eventTypes?.length && (
              <EventTypes
                isTeamMember={isTeamMember}
                eventTypes={eventTypes}
                subjectId={subjectId}
              />
            )}
          </div>
        )}
        {!!events?.length ? (
          <TimelineEvents
            events={events}
            filters={f}
            isPublic={isPublic}
            isTeamMember={isTeamMember}
            subjectId={subjectId}
          />
        ) : (
          <Empty className="mt-16">
            <InformationCircleIcon className="w-7" />
            {!isPublic && !subject.archived && !user?.app_metadata.is_client ? (
              !protocols?.length && !eventTypes?.length ? (
                <div>
                  You need an <span className="text-fg-2">event type</span> or{' '}
                  <span className="text-fg-2">protocol</span>
                  <br />
                  to record data. Wink
                  <div className="mx-1.5 inline-flex size-4 items-center justify-center rounded-full bg-accent-1 text-bg-1">
                    <PlusIcon className="inline w-3 stroke-2" />
                  </div>
                  wink.
                </div>
              ) : (
                <div>
                  Without data, you&rsquo;re just another
                  <br />
                  person with an opinion.
                </div>
              )
            ) : (
              'No events.'
            )}
          </Empty>
        )}
      </div>
    </>
  );
};

export default SubjectPage;
