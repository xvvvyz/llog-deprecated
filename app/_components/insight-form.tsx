'use client';

import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import Input from '@/_components/input';
import PlotFigure from '@/_components/plot-figure';
import Select, { IOption } from '@/_components/select';
import InputTypes from '@/_constants/enum-input-types';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertInsight from '@/_mutations/upsert-insight';
import { GetInsightData } from '@/_queries/get-insight';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectEventTypesData } from '@/_queries/list-subject-event-types';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import sortInputs from '@/_utilities/sort-inputs';
import * as P from '@observablehq/plot';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller } from 'react-hook-form';

enum ChartType {
  TimeSeries = 'time-series',
}

const CHART_TYPE_LABELS = {
  [ChartType.TimeSeries]: 'Time series',
};

const CHART_TYPE_OPTIONS = Object.entries(CHART_TYPE_LABELS).map(
  ([id, label]) => ({ id, label }),
);

const CURVE_FUNCTION_OPTIONS = [
  { id: 'basis', label: 'Basis' },
  { id: 'bundle', label: 'Bundle' },
  { id: 'cardinal', label: 'Cardinal' },
  { id: 'catmull-rom', label: 'Catmull-rom' },
  { id: 'linear', label: 'Linear' },
  { id: 'natural', label: 'Natural' },
  { id: 'step', label: 'Step' },
];

interface InsightFormProps {
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  eventTypes: NonNullable<ListSubjectEventTypesData>;
  events: ReturnType<typeof formatTabularEvents>;
  insight?: NonNullable<GetInsightData>;
  subjectId: string;
}

type InsightFormValues = {
  curveFunction: string;
  eventMarkers: string[];
  marginBottom: number;
  marginLeft: number;
  marginRight: number;
  marginTop: number;
  name: string;
  showDots: boolean;
  showLine: boolean;
  showLinearRegression: boolean;
  showXAxisLabel: boolean;
  showXAxisTicks: boolean;
  showYAxisLabel: boolean;
  showYAxisTicks: boolean;
  type: string;
  x: string;
  y: string;
};

const InsightForm = ({
  availableInputs,
  eventTypes,
  events,
  insight,
  subjectId,
}: InsightFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const cacheKey = getFormCacheKey.insight({ id: undefined, subjectId });
  const router = useRouter();

  const form = useCachedForm<InsightFormValues>(cacheKey, {
    defaultValues: {
      curveFunction: CURVE_FUNCTION_OPTIONS[0].id,
      eventMarkers: [],
      marginBottom: 60,
      marginLeft: 60,
      marginRight: 60,
      marginTop: 60,
      name: '',
      showDots: true,
      showLine: true,
      showLinearRegression: true,
      showXAxisLabel: true,
      showXAxisTicks: true,
      showYAxisLabel: true,
      showYAxisTicks: true,
      type: CHART_TYPE_OPTIONS[0].id,
    },
  });

  const curveFunction = form.watch('curveFunction');
  const eventMarkers = form.watch('eventMarkers');
  const showDots = form.watch('showDots');
  const showLine = form.watch('showLine');
  const showLinearRegression = form.watch('showLinearRegression');
  const showXAxisLabel = form.watch('showXAxisLabel');
  const showXAxisTicks = form.watch('showXAxisTicks');
  const showYAxisLabel = form.watch('showYAxisLabel');
  const showYAxisTicks = form.watch('showYAxisTicks');
  const type = form.watch('type');

  const marks = [];
  let yOptions: IOption[] = [];

  const eventTypeOptions = eventTypes.map((e) => ({
    id: e.id,
    label: e.name,
  }));

  switch (type) {
    case ChartType.TimeSeries: {
      yOptions = availableInputs
        .filter(
          (i) =>
            i.type === InputTypes.Duration ||
            i.type === InputTypes.Number ||
            i.type === InputTypes.Stopwatch,
        )
        .sort(sortInputs) as IOption[];

      const y = form.watch('y');
      const xLabel = 'Time';
      const yLabel = yOptions.find((o) => o.id === y)?.label ?? '';

      const formatted: ReturnType<typeof formatTabularEvents> &
        Array<{ Time: Date }> = [];

      const filtered = [];
      let maxY;
      let minY;

      for (const event of events) {
        const f = { ...event, Time: new Date(event.Time as string) };
        formatted.push(f);

        if (typeof event[yLabel] === 'number') {
          filtered.push(f);
          const value = event[yLabel] as number;
          maxY = typeof maxY === 'number' ? Math.max(maxY, value) : value;
          minY = typeof minY === 'number' ? Math.min(minY, value) : value;
        }
      }

      marks.push(
        P.axisX({
          label: showXAxisLabel ? xLabel : null,
          stroke: 'hsla(0, 0%, 100%, 20%)',
          ticks: showXAxisTicks ? undefined : [],
        }),
      );

      marks.push(
        P.axisY({
          label: showYAxisLabel ? yLabel : null,
          stroke: 'hsla(0, 0%, 100%, 20%)',
          ticks: showYAxisTicks ? undefined : [],
        }),
      );

      if (showLinearRegression) {
        marks.push(
          P.linearRegressionY(filtered, {
            ci: 0,
            stroke: 'hsl(5, 85%, 40%)',
            x: xLabel,
            y: yLabel,
          }),
        );
      }

      if (showLine) {
        marks.push(
          P.line(filtered, {
            curve: curveFunction,
            x: xLabel,
            y: yLabel,
          }),
        );
      }

      if (showDots) {
        marks.push(
          P.dot(filtered, {
            fill: 'hsla(0, 0%, 100%, 75%)',
            opacity: 0.5,
            r: 3,
            x: xLabel,
            y: yLabel,
          }),
        );
      }

      if (eventMarkers.length) {
        const filtered = formatted.filter((d) =>
          eventMarkers.some((e) => e === d.EventId),
        );

        const y =
          typeof minY === 'number' && typeof maxY === 'number'
            ? maxY + (maxY - minY) * 0.1
            : 0;

        marks.push(
          P.dot(filtered, {
            fill: 'Name',
            x: xLabel,
            y,
          }),
        );

        marks.push(
          P.dot(
            filtered,
            P.pointer({
              maxRadius: 20,
              stroke: 'Name',
              strokeWidth: 5,
              title: (d) => d.Id,
              x: xLabel,
              y,
            }),
          ),
        );

        marks.push(
          P.tip(
            filtered,
            P.pointer({
              maxRadius: 20,
              title: (d) => d.Name,
              x: xLabel,
              y,
            }),
          ),
        );
      }

      marks.push(
        P.crosshairX(filtered, {
          maxRadius: 100,
          ruleStroke: 'hsla(0, 0%, 100%, 20%)',
          ruleStrokeOpacity: 1,
          textFill: 'white',
          textStroke: '#1A1917',
          textStrokeWidth: 10,
          x: xLabel,
          y: yLabel,
        }),
      );

      marks.push(
        P.dot(
          filtered,
          P.pointerX({
            fill: 'hsla(0, 0%, 100%, 75%)',
            maxRadius: 100,
            r: 3,
            title: (d) => d.Id,
            x: xLabel,
            y: yLabel,
          }),
        ),
      );
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const res = await upsertInsight(
            { insightId: insight?.id, subjectId },
            values,
          );

          if (res?.error) {
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          localStorage.setItem('refresh', '1');
          router.back();
        }),
      )}
      className="divide-y divide-alpha-1"
    >
      <div className="grid gap-6 px-4 py-8 sm:px-8 md:grid-cols-2 md:gap-4">
        <Input label="Name" required {...form.register('name')} />
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <Select
              isClearable={false}
              label="Chart type"
              name={field.name}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange((value as IOption).id)}
              options={CHART_TYPE_OPTIONS}
              placeholder="Select a chart type…"
              value={CHART_TYPE_OPTIONS.find((o) => o.id === field.value)}
            />
          )}
        />
      </div>
      <div className="grid gap-6 px-4 py-8 sm:px-8 md:grid-cols-2 md:gap-4">
        {type === ChartType.TimeSeries && (
          <Controller
            control={form.control}
            name="y"
            render={({ field }) => (
              <Select
                isClearable={false}
                label="Y value"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange((value as IOption).id)}
                options={yOptions}
                placeholder="Select a data point…"
                value={yOptions.find((o) => o.id === field.value)}
              />
            )}
          />
        )}
        {type === ChartType.TimeSeries && (
          <Controller
            control={form.control}
            name="eventMarkers"
            render={({ field }) => (
              <Select
                isMulti
                label="Event markers"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(values) =>
                  field.onChange((values as IOption[]).map((v) => v.id))
                }
                options={eventTypeOptions as IOption[]}
                placeholder="Select event markers…"
                value={
                  eventTypeOptions.filter((o) =>
                    field.value.includes(o.id),
                  ) as IOption[]
                }
              />
            )}
          />
        )}
      </div>
      <PlotFigure
        onClick={(plot) => {
          const eventId = plot.querySelector('title')?.innerHTML ?? '';
          if (eventId) router.push(`/subjects/${subjectId}/events/${eventId}`);
        }}
        options={{
          marginBottom: form.watch('marginBottom'),
          marginLeft: form.watch('marginLeft'),
          marginRight: form.watch('marginRight'),
          marginTop: form.watch('marginTop'),
          marks,
          title: form.watch('name'),
        }}
      />
      <div className="grid grid-cols-2 gap-4 px-4 py-8 sm:px-8 md:grid-cols-4">
        <Input
          label="Space top"
          min={0}
          type="number"
          {...form.register('marginTop')}
        />
        <Input
          label="Space bottom"
          min={0}
          type="number"
          {...form.register('marginBottom')}
        />
        <Input
          label="Space left"
          min={0}
          type="number"
          {...form.register('marginLeft')}
        />
        <Input
          label="Space right"
          min={0}
          type="number"
          {...form.register('marginRight')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 px-4 py-8 sm:px-8">
        <Checkbox label="X axis ticks" {...form.register('showXAxisTicks')} />
        <Checkbox label="X axis label" {...form.register('showXAxisLabel')} />
        <Checkbox label="Y axis ticks" {...form.register('showYAxisTicks')} />
        <Checkbox label="Y axis label" {...form.register('showYAxisLabel')} />
        {type === ChartType.TimeSeries && (
          <Checkbox label="Dots" {...form.register('showDots')} />
        )}
        {type === ChartType.TimeSeries && (
          <Checkbox label="Line" {...form.register('showLine')} />
        )}
        {type === ChartType.TimeSeries && (
          <Checkbox
            label="Trend line"
            {...form.register('showLinearRegression')}
          />
        )}
      </div>
      {showLine && type === ChartType.TimeSeries && (
        <div className="grid gap-4 px-4 py-8 sm:px-8 md:grid-cols-3">
          <Controller
            control={form.control}
            name="curveFunction"
            render={({ field }) => (
              <Select
                isClearable={false}
                label="Curve function"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange((value as IOption).id)}
                options={CURVE_FUNCTION_OPTIONS as IOption[]}
                value={CURVE_FUNCTION_OPTIONS.find((o) => o.id === field.value)}
              />
            )}
          />
        </div>
      )}
      {form.formState.errors.root && (
        <div className="px-4 py-8 text-center sm:px-8">
          {form.formState.errors.root.message}
        </div>
      )}
      <div className="flex justify-end gap-4 px-4 py-8 sm:px-8">
        <BackButton
          className="w-36 shrink-0"
          colorScheme="transparent"
          size="sm"
        >
          Close
        </BackButton>
        <Button
          className="w-36 shrink-0"
          loading={isTransitioning}
          loadingText="Saving…"
          size="sm"
          type="submit"
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export type { InsightFormValues };
export default InsightForm;
