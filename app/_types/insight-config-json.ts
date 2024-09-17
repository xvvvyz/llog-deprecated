import ChartType from '@/_constants/enum-chart-type';
import Interval from '@/_constants/enum-interval';
import LineCurveFunction from '@/_constants/enum-line-curve-function';
import Reducer from '@/_constants/enum-reducer';
import TimeSinceMilliseconds from '@/_constants/enum-time-since-milliseconds';

export type InsightConfigJson = {
  annotationIncludeEventsFrom: string | null;
  annotationInput: string;
  annotationInputOptions: string[];
  includeEventsFrom: string | null;
  includeEventsSince: TimeSinceMilliseconds | null;
  input: string;
  inputOptions: string[];
  interval: Interval | null;
  lineCurveFunction: LineCurveFunction;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  marginTop: string;
  reducer: Reducer;
  showLinearRegression: boolean;
  showLinearRegressionConfidence: boolean;
  type: ChartType;
};
