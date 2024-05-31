import { ListInsightsData } from '@/_queries/list-insights';
import { InsightConfigJson } from '@/_types/insight-config-json';

const getInputIdsFromInsightConfigs = (insights: ListInsightsData) =>
  (insights ?? []).reduce<string[]>((acc, insight) => {
    const config = insight.config as InsightConfigJson;
    if (config.y) acc.push(config.y);
    return acc;
  }, []);

export default getInputIdsFromInsightConfigs;
