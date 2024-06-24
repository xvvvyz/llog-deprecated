import Button from '@/_components/button';
import Empty from '@/_components/empty';
import InsightCardMenu from '@/_components/insight-card-menu';
import PlotFigure from '@/_components/plot-figure';
import Numbers from '@/_constants/enum-numbers';
import getCurrentUser from '@/_queries/get-current-user';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import listEvents from '@/_queries/list-events';
import listInputLabelsById from '@/_queries/list-input-labels-by-id';
import listInsights from '@/_queries/list-insights';
import listPublicEvents from '@/_queries/list-public-events';
import listPublicInsights from '@/_queries/list-public-insights';
import { InsightConfigJson } from '@/_types/insight-config-json';
import formatEventFilters from '@/_utilities/format-event-filters';
import formatInputIdLabelMap from '@/_utilities/format-input-id-label-map';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import getInputIdsFromInsightConfigs from '@/_utilities/get-input-ids-from-insight-configs';
import ArrowUpRightIcon from '@heroicons/react/24/outline/ArrowUpRightIcon';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { twMerge } from 'tailwind-merge';

interface SubjectInsightsPageProps {
  isPublic?: boolean;
  searchParams: { from?: string; to?: string };
  subjectId: string;
}

const SubjectInsightsPage = async ({
  isPublic,
  searchParams,
  subjectId,
}: SubjectInsightsPageProps) => {
  const f = formatEventFilters({
    from: searchParams.from,
    limit: String(Numbers.FourByteSignedIntMax - 1),
    to: searchParams.to,
  });

  const [{ data: subject }, { data: rawEvents }, { data: insights }, user] =
    await Promise.all([
      isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
      isPublic ? listPublicEvents(subjectId, f) : listEvents(subjectId, f),
      isPublic ? listPublicInsights(subjectId) : listInsights(subjectId),
      getCurrentUser(),
    ]);

  if (!subject) return null;

  const inputIds = getInputIdsFromInsightConfigs(insights);
  const { data: inputs } = await listInputLabelsById(inputIds);

  const events = formatTabularEvents(rawEvents);
  const idLabelMap = formatInputIdLabelMap(inputs);
  const isTeamMember = user && !!user && subject.team_id === user.id;
  const shareOrSubjects = isPublic ? 'share' : 'subjects';
  let searchString = new URLSearchParams(searchParams).toString();
  searchString = searchString ? `?${searchString}` : '';

  return (
    <div className="mt-16 space-y-4">
      {isTeamMember && (
        <Button
          className="w-full"
          colorScheme="transparent"
          href={`/subjects/${subjectId}/insights/create`}
          scroll={false}
        >
          <PlusIcon className="w-5" />
          Create insight
        </Button>
      )}
      {!events?.length || !insights?.length ? (
        <Empty className="mt-4">
          <InformationCircleIcon className="w-7" />
          No insights.
        </Empty>
      ) : (
        insights.map((insight) => {
          const config = insight.config as InsightConfigJson;

          return (
            <article
              className="space-y-1 rounded border border-alpha-1 bg-bg-2 pt-1"
              key={insight.id}
            >
              <div className="flex items-stretch hover:bg-alpha-1">
                <Button
                  className={twMerge(
                    'm-0 flex w-full gap-4 px-4 py-3 leading-snug',
                    isTeamMember && 'pr-0',
                  )}
                  href={`/${shareOrSubjects}/${subjectId}/insights/${insight.id}${searchString}`}
                  scroll={false}
                  variant="link"
                >
                  {insight.name}
                  {!isTeamMember && (
                    <ArrowUpRightIcon className="ml-auto w-5 shrink-0" />
                  )}
                </Button>
                {isTeamMember && (
                  <InsightCardMenu
                    insightId={insight.id}
                    subjectId={subjectId}
                  />
                )}
              </div>
              <div className="rounded-b bg-alpha-reverse-1">
                <PlotFigure
                  defaultHeight={250}
                  isPublic={isPublic}
                  options={{
                    columns: config.inputs.map((i) => idLabelMap[i]),
                    curveFunction: config.curveFunction,
                    events,
                    marginBottom: config.marginBottom,
                    marginLeft: config.marginLeft,
                    marginRight: config.marginRight,
                    marginTop: config.marginTop,
                    showDots: config.showDots,
                    showLine: config.showLine,
                    showLinearRegression: config.showLinearRegression,
                    showXAxisLabel: config.showXAxisLabel,
                    showXAxisTicks: config.showXAxisTicks,
                    showYAxisLabel: config.showYAxisLabel,
                    showYAxisTicks: config.showYAxisTicks,
                    title: insight.name,
                    type: config.type,
                  }}
                  subjectId={subjectId}
                />
              </div>
            </article>
          );
        })
      )}
    </div>
  );
};

export default SubjectInsightsPage;
