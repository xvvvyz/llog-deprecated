import PageModalHeader from '@/_components/page-modal-header';
import PlotFigure from '@/_components/plot-figure';
import Numbers from '@/_constants/enum-numbers';
import getInsight from '@/_queries/get-insight';
import getPublicInsight from '@/_queries/get-public-insight';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import listEvents from '@/_queries/list-events';
import listInputLabelsById from '@/_queries/list-input-labels-by-id';
import listPublicEvents from '@/_queries/list-public-events';
import { InsightConfigJson } from '@/_types/insight-config-json';
import formatEventFilters from '@/_utilities/format-event-filters';
import formatInputIdLabelMap from '@/_utilities/format-input-id-label-map';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import getInputIdsFromInsightConfigs from '@/_utilities/get-input-ids-from-insight-configs';

interface InsightPageProps {
  from?: string;
  insightId: string;
  isPublic?: boolean;
  subjectId: string;
  to?: string;
}

const InsightPage = async ({
  from,
  insightId,
  isPublic,
  subjectId,
  to,
}: InsightPageProps) => {
  const f = formatEventFilters({
    from,
    limit: String(Numbers.FourByteSignedIntMax - 1),
    to,
  });

  const [{ data: subject }, { data: rawEvents }, { data: insight }] =
    await Promise.all([
      isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
      isPublic ? listPublicEvents(subjectId, f) : listEvents(subjectId, f),
      isPublic ? getPublicInsight(insightId) : getInsight(insightId),
    ]);

  if (!subject || !insight) return null;

  const inputIds = getInputIdsFromInsightConfigs(insight ? [insight] : []);
  const { data: inputs } = await listInputLabelsById(inputIds);

  const config = insight.config as InsightConfigJson;
  const events = formatTabularEvents(rawEvents);
  const idLabelMap = formatInputIdLabelMap(inputs);

  return (
    <>
      <PageModalHeader
        className="shrink-0 border-b border-alpha-1"
        title={insight.name}
      />
      <div className="h-full bg-alpha-reverse-1">
        <PlotFigure
          isPublic={isPublic}
          options={{
            curveFunction: config.curveFunction,
            eventMarkers: config.eventMarkers,
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
            xLabel: 'Time',
            yLabel: idLabelMap[config.y],
          }}
          subjectId={subjectId}
        />
      </div>
    </>
  );
};

export default InsightPage;
