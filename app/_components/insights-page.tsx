import Button from '@/_components/button';
import Empty from '@/_components/empty';
import Insights from '@/_components/insights';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import Number from '@/_constants/enum-number';
import getCurrentUser from '@/_queries/get-current-user';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import listEvents from '@/_queries/list-events';
import listInsights from '@/_queries/list-insights';
import listPublicEvents from '@/_queries/list-public-events';
import listPublicInsights from '@/_queries/list-public-insights';
import formatEventFilters from '@/_utilities/format-event-filters';
import ChartBarSquareIcon from '@heroicons/react/24/outline/ChartBarSquareIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { URLSearchParams } from 'next/dist/compiled/@edge-runtime/primitives';

interface InsightsPageProps {
  isPublic?: boolean;
  searchParams: { from?: string; to?: string };
  subjectId: string;
}

const InsightsPage = async ({
  isPublic,
  searchParams,
  subjectId,
}: InsightsPageProps) => {
  const f = formatEventFilters({
    from: searchParams.from,
    limit: String(Number.FourByteSignedIntMax - 1),
    to: searchParams.to,
  });

  const [{ data: subject }, { data: events }, { data: insights }, user] =
    await Promise.all([
      isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
      isPublic ? listPublicEvents(subjectId, f) : listEvents(subjectId, f),
      isPublic ? listPublicInsights(subjectId) : listInsights(subjectId),
      getCurrentUser(),
    ]);

  if (!subject) return null;
  const isTeamMember =
    !!user && subject.team_id === user.app_metadata.active_team_id;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';
  const searchObject = new URLSearchParams(searchParams);
  const searchString = searchObject.size ? `?${searchObject.toString()}` : '';

  return (
    <Modal.Content className="max-w-5xl">
      <PageModalHeader
        right={
          isTeamMember &&
          !subject.archived && (
            <Button
              className="pr-2 sm:pr-6"
              href={`/subjects/${subjectId}/insights/create`}
              variant="link"
            >
              <PlusIcon className="w-5" />
              New insight
            </Button>
          )
        }
        title="Insights"
      />
      <div className="space-y-4 px-4 sm:px-8">
        {!insights?.length ? (
          <Empty className="border-0">
            <ChartBarSquareIcon className="w-7" />
            No insights.
          </Empty>
        ) : (
          <Insights
            events={events}
            insights={insights}
            isArchived={subject.archived}
            isPublic={isPublic}
            isTeamMember={isTeamMember}
            searchString={searchString}
            shareOrSubjects={shareOrSubjects}
            subjectId={subjectId}
          />
        )}
      </div>
      <Modal.Close asChild>
        <Button className="m-0 block w-full py-6 text-center" variant="link">
          Close
        </Button>
      </Modal.Close>
    </Modal.Content>
  );
};

export default InsightsPage;
