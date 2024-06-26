import BarInterval from '@/_constants/enum-bar-interval';
import BarReducer from '@/_constants/enum-bar-reducer';
import ChartType from '@/_constants/enum-chart-type';
import LineCurveFunction from '@/_constants/enum-line-curve-function';

export type InsightConfigJson = {
  barInterval: BarInterval;
  barReducer: BarReducer;
  input: string;
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
