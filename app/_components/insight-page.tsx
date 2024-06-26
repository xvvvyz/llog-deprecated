import PageModalHeader from '@/_components/page-modal-header';
import PlotFigure from '@/_components/plot-figure';
import NOMINAL_INPUT_TYPES from '@/_constants/constant-nominal-input-types';
import InputType from '@/_constants/enum-input-type';
import Number from '@/_constants/enum-number';
import getInsight from '@/_queries/get-insight';
import getPublicInsight from '@/_queries/get-public-insight';
import getPublicSubject from '@/_queries/get-public-subject';
import getSubject from '@/_queries/get-subject';
import listEvents from '@/_queries/list-events';
import listInputsByIds from '@/_queries/list-inputs-by-ids';
import listPublicEvents from '@/_queries/list-public-events';
import { InsightConfigJson } from '@/_types/insight-config-json';
import formatEventFilters from '@/_utilities/format-event-filters';
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
    limit: String(Number.FourByteSignedIntMax - 1),
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
  const { data: inputs } = await listInputsByIds(inputIds);
  const config = insight.config as InsightConfigJson;
  const events = formatTabularEvents(rawEvents);
  const input = inputs?.find((i) => i.id === config.input);
  if (!input) return null;
  const inputIsNominal = NOMINAL_INPUT_TYPES.includes(input.type as InputType);

  return (
    <>
      <PageModalHeader
        className="border-b border-alpha-1"
        title={insight.name}
      />
      <div className="rounded-b bg-alpha-reverse-1">
        <PlotFigure
          barInterval={config.barInterval}
          barReducer={config.barReducer}
          events={events}
          input={input.label}
          inputIsNominal={inputIsNominal}
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
    </>
  );
};

export default InsightPage;
