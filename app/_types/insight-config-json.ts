import ChartType from '@/_constants/enum-chart-type';

export type InsightConfigJson = {
  curveFunction: string;
  eventMarkers: string[];
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  showDots: boolean;
  showLine: boolean;
  showLinearRegression: boolean;
  showXAxisLabel: boolean;
  showXAxisTicks: boolean;
  showYAxisLabel: boolean;
  showYAxisTicks: boolean;
  type: ChartType;
  x: string;
  y: string;
};
