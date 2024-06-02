import { ListInsightsData } from '@/_queries/list-insights';
import { InsightConfigJson } from '@/_types/insight-config-json';

const getInputIdsFromInsightConfigs = (insights: ListInsightsData) =>
  (insights ?? []).reduce<string[]>((acc, insight) => {
    const config = insight.config as InsightConfigJson;
    if (!config.inputs?.length) return acc;
    return acc.concat(config.inputs);
  }, []);

export default getInputIdsFromInsightConfigs;
