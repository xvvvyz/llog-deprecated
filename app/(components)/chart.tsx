'use client';

import {
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  LineElement,
  LinearScale,
  PointElement,
  TimeSeriesScale,
  Tooltip,
} from 'chart.js';

import 'chartjs-adapter-moment';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  BarElement,
  CategoryScale,
  LineElement,
  LinearScale,
  PointElement,
  TimeSeriesScale,
  Tooltip
);

interface DataPoint {
  x: string | Date;
  y: number;
}

interface ChartProps {
  data: {
    datasets: Array<{
      label: string;
      data: DataPoint[];
      backgroundColor?: string;
      borderColor?: string;
    }>;
    labels?: string[];
  };
  type: 'line';
}

const cssVar = (key: string) => {
  const computedStyle = getComputedStyle(document.documentElement);
  return computedStyle.getPropertyValue(`--${key}`).trim();
};

const Chart = ({ data, type }: ChartProps) => (
  <div className="border border-alpha-1 bg-bg-2 p-2">
    {type === 'line' && (
      <Line
        data={data}
        options={{
          plugins: {
            tooltip: {
              backgroundColor: cssVar('color-bg-2'),
              bodyColor: cssVar('color-fg-1'),
              borderColor: cssVar('color-alpha-1'),
              borderWidth: 1,
              callbacks: {
                label: (context) =>
                  `${context.dataset.label}: ${context.parsed.y}`,
                title: (context) => `${context[0].label}`,
              },
              displayColors: false,
              enabled: true,
              padding: 8,
            },
          },
          scales: {
            x: {
              border: { display: false },
              grid: { display: false },
              ticks: { display: false },
              type: 'timeseries',
            },
            y: {
              border: { display: false },
              grid: { color: cssVar('color-alpha-1') },
              ticks: { color: cssVar('color-fg-3') },
            },
          },
        }}
      />
    )}
  </div>
);

export default Chart;
