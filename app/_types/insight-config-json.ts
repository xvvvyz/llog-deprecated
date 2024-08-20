import BarInterval from '@/_constants/enum-bar-interval';
import BarReducer from '@/_constants/enum-bar-reducer';
import ChartType from '@/_constants/enum-chart-type';
import LineCurveFunction from '@/_constants/enum-line-curve-function';
import TimeSinceMilliseconds from '@/_constants/enum-time-since-milliseconds';

export type InsightConfigJson = {
  barInterval: BarInterval;
  barReducer: BarReducer;
  includeEventsFrom: string | null;
  includeEventsSince: TimeSinceMilliseconds | null;
  input: string;
  inputOptions: string[];
  lineCurveFunction: LineCurveFunction;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  marginTop: string;
  showBars: boolean;
  showDots: boolean;
  showLine: boolean;
  showLinearRegression: boolean;
  type: ChartType;
};
