'use client';

import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import Input from '@/_components/input';
import PlotFigure from '@/_components/plot-figure';
import Select, { IOption } from '@/_components/select';
import InputTypes from '@/_constants/enum-input-types';
import useCachedForm from '@/_hooks/use-cached-form';
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
  subjectId: string;
}

type InsightFormValues = {
  curveFunction: (typeof CURVE_FUNCTION_OPTIONS)[0];
  eventMarkers: IOption[];
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
  type: (typeof CHART_TYPE_OPTIONS)[0];
  x: NonNullable<ListInputsBySubjectIdData>[0];
  y: NonNullable<ListInputsBySubjectIdData>[0];
};

const InsightForm = ({
  availableInputs,
  eventTypes,
  events,
  subjectId,
}: InsightFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const cacheKey = getFormCacheKey.insight({ id: undefined, subjectId });
  const router = useRouter();

  const form = useCachedForm<InsightFormValues>(cacheKey, {
    defaultValues: {
      curveFunction: CURVE_FUNCTION_OPTIONS[0],
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
      type: CHART_TYPE_OPTIONS[0],
    },
  });

  const curveFunction = form.watch('curveFunction')?.id;
  const eventMarkers = form.watch('eventMarkers');
  const showDots = form.watch('showDots');
  const showLine = form.watch('showLine');
  const showLinearRegression = form.watch('showLinearRegression');
  const showXAxisLabel = form.watch('showXAxisLabel');
  const showXAxisTicks = form.watch('showXAxisTicks');
  const showYAxisLabel = form.watch('showYAxisLabel');
  const showYAxisTicks = form.watch('showYAxisTicks');
  const type = form.watch('type')?.id;

  const marks = [];
  let yOptions: IOption[] = [];

  switch (type) {
    case ChartType.TimeSeries: {
      const x = 'Time';
      const y = form.watch('y')?.label ?? '';

      const formatted: ReturnType<typeof formatTabularEvents> &
        Array<{ Time: Date }> = [];

      const filtered = [];
      let maxY;
      let minY;

      for (const event of events) {
        const f = { ...event, Time: new Date(event.Time as string) };
        formatted.push(f);

        if (typeof event[y] === 'number') {
          filtered.push(f);
          const value = event[y] as number;
          maxY = typeof maxY === 'number' ? Math.max(maxY, value) : value;
          minY = typeof minY === 'number' ? Math.min(minY, value) : value;
        }
      }

      marks.push(
        P.axisX({
          label: showXAxisLabel ? x : null,
          stroke: 'hsla(0, 0%, 100%, 20%)',
          ticks: showXAxisTicks ? undefined : [],
        }),
      );

      marks.push(
        P.axisY({
          label: showYAxisLabel ? y : null,
          stroke: 'hsla(0, 0%, 100%, 20%)',
          ticks: showYAxisTicks ? undefined : [],
        }),
      );

      if (showLinearRegression) {
        marks.push(
          P.linearRegressionY(filtered, {
            ci: 0,
            stroke: 'hsl(5, 85%, 40%)',
            x,
            y,
          }),
        );
      }

      if (showLine) {
        marks.push(
          P.line(filtered, {
            curve: curveFunction,
            x,
            y,
          }),
        );
      }

      if (showDots) {
        marks.push(
          P.dot(filtered, {
            fill: 'hsla(0, 0%, 100%, 75%)',
            opacity: 0.5,
            r: 3,
            x,
            y,
          }),
        );
      }

      if (eventMarkers.length) {
        const filtered = formatted.filter((d) =>
          eventMarkers.some((e) => e.id === d.EventId),
        );

        const y =
          typeof minY === 'number' && typeof maxY === 'number'
            ? maxY + (maxY - minY) * 0.1
            : 0;

        marks.push(
          P.dot(filtered, {
            fill: 'Name',
            x,
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
              x,
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
              x,
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
          x,
          y,
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
            x,
            y,
          }),
        ),
      );

      yOptions = availableInputs
        .filter(
          (i) =>
            i.type === InputTypes.Duration ||
            i.type === InputTypes.Number ||
            i.type === InputTypes.Stopwatch,
        )
        .sort(sortInputs) as IOption[];
    }
  }

  return (
    <form
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          console.log(values);
          // const res = await upsertInsight(
          //   { insightId: insight?.id, subjectId },
          //   values,
          // );
          //
          // if (res?.error) {
          //   form.setError('root', { message: res.error, type: 'custom' });
          // }
          //
          // localStorage.setItem('refresh', '1');
          // router.back();
        }),
      )}
      className="divide-y divide-alpha-1"
    >
      <div className="grid grid-cols-2 gap-4 px-4 py-8 sm:px-8">
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <Select
              isClearable={false}
              label="Type"
              name={field.name}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange(value)}
              options={CHART_TYPE_OPTIONS}
              placeholder="Select a chart type…"
              value={field.value as IOption}
            />
          )}
        />
        {type === ChartType.TimeSeries && (
          <Controller
            control={form.control}
            name="y"
            render={({ field }) => (
              <Select
                label="Y"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange(value)}
                options={yOptions}
                placeholder="Select a data point…"
                value={field.value as IOption}
              />
            )}
          />
        )}
        <div className="col-span-2">
          <Controller
            control={form.control}
            name="eventMarkers"
            render={({ field }) => (
              <Select
                isMulti
                label="Event markers"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange(value)}
                options={
                  eventTypes.map((e) => ({
                    id: e.id,
                    label: e.name,
                  })) as IOption[]
                }
                placeholder="Select event markers…"
                value={field.value}
              />
            )}
          />
        </div>
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
      <div className="grid grid-cols-4 gap-4 px-4 py-8 sm:px-8">
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
        <div className="grid grid-cols-3 gap-4 px-4 py-8 sm:px-8">
          <Controller
            control={form.control}
            name="curveFunction"
            render={({ field }) => (
              <Select
                isClearable={false}
                label="Curve"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange(value)}
                options={CURVE_FUNCTION_OPTIONS as IOption[]}
                value={field.value as IOption}
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
