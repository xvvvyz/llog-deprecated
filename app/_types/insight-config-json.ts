import ChartType from '@/_constants/enum-chart-type';

export type InsightConfigJson = {
  curveFunction: string;
  input: string;
  marginBottom: string;
  marginLeft: string;
  marginRight: string;
  marginTop: string;
  showDots: boolean;
  showLine: boolean;
  showLinearRegression: boolean;
  showXAxisLabel: boolean;
  showXAxisTicks: boolean;
  showYAxisLabel: boolean;
  showYAxisTicks: boolean;
  type: ChartType;
};
