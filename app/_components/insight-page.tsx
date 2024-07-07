import PageModalHeader from '@/_components/page-modal-header';
import PlotFigure from '@/_components/plot-figure';
import Number from '@/_constants/enum-number';
import getInsight from '@/_queries/get-insight';
import getPublicInsight from '@/_queries/get-public-insight';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import listEvents from '@/_queries/list-events';
import listPublicEvents from '@/_queries/list-public-events';
import { InsightConfigJson } from '@/_types/insight-config-json';
import formatEventFilters from '@/_utilities/format-event-filters';

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
    limit: String(Number.FourByteSignedIntMax - 1),
    to,
  });

  const [{ data: subject }, { data: events }, { data: insight }] =
    await Promise.all([
      isPublic ? getPublicSubject(subjectId) : getSubject(subjectId),
      isPublic ? listPublicEvents(subjectId, f) : listEvents(subjectId, f),
      isPublic ? getPublicInsight(insightId) : getInsight(insightId),
    ]);

  if (!subject || !events || !insight) return null;
  const config = insight.config as InsightConfigJson;

  return (
    <div className="rounded bg-bg-2">
      <div className="rounded bg-alpha-reverse-1">
        <PageModalHeader className="-mb-8" title={insight.name} />
        <PlotFigure
          barInterval={config.barInterval}
          barReducer={config.barReducer}
          events={events}
          includeEventsFrom={config.includeEventsFrom}
          includeEventsSince={config.includeEventsSince}
          inputId={config.input}
          isPublic={isPublic}
          lineCurveFunction={config.lineCurveFunction}
          marginBottom={config.marginBottom}
          marginLeft={config.marginLeft}
          marginRight={config.marginRight}
          marginTop={config.marginTop}
          showBars={config.showBars}
          showDots={config.showDots}
          showLine={config.showLine}
          showLinearRegression={config.showLinearRegression}
          subjectId={subjectId}
          title={insight.name}
          type={config.type}
        />
      </div>
    </div>
  );
};

export default InsightPage;
