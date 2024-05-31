'use client';

import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import Input from '@/_components/input';
import PlotFigure from '@/_components/plot-figure';
import Select, { IOption } from '@/_components/select';
import ChartType from '@/_constants/enum-chart-type';
import InputTypes from '@/_constants/enum-input-types';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertInsight from '@/_mutations/upsert-insight';
import { GetInsightData } from '@/_queries/get-insight';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectEventTypesData } from '@/_queries/list-subject-event-types';
import { InsightConfigJson } from '@/_types/insight-config-json';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import sortInputs from '@/_utilities/sort-inputs';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller } from 'react-hook-form';

const CHART_TYPE_LABELS = {
  [ChartType.TimeSeries]: 'Time series',
};

const CHART_TYPE_OPTIONS = Object.entries(CHART_TYPE_LABELS).map(
  ([id, label]) => ({ id, label }) as { id: ChartType; label: string },
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

type InsightFormValues = InsightConfigJson & {
  name: string;
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
  const config = insight?.config as InsightConfigJson;
  const router = useRouter();

  const form = useCachedForm<InsightFormValues>(cacheKey, {
    defaultValues: {
      curveFunction: config?.curveFunction ?? CURVE_FUNCTION_OPTIONS[0].id,
      eventMarkers: config?.eventMarkers ?? [],
      marginBottom: config?.marginBottom ?? 60,
      marginLeft: config?.marginLeft ?? 60,
      marginRight: config?.marginRight ?? 60,
      marginTop: config?.marginTop ?? 60,
      name: insight?.name ?? '',
      showDots: config?.showDots ?? true,
      showLine: config?.showLine ?? true,
      showLinearRegression: config?.showLinearRegression ?? false,
      showXAxisLabel: config?.showXAxisLabel ?? true,
      showXAxisTicks: config?.showXAxisTicks ?? true,
      showYAxisLabel: config?.showYAxisLabel ?? true,
      showYAxisTicks: config?.showYAxisTicks ?? true,
      type: config?.type ?? CHART_TYPE_OPTIONS[0].id,
      x: config?.x,
      y: config?.y,
    },
  });

  const showLine = form.watch('showLine');
  const type = form.watch('type');
  const y = form.watch('y');

  const eventTypeOptions = eventTypes.map((e) => ({
    id: e.id,
    label: e.name,
  })) as IOption[];

  const yOptions = availableInputs
    .filter(
      (i) =>
        i.type === InputTypes.Duration ||
        i.type === InputTypes.Number ||
        i.type === InputTypes.Stopwatch,
    )
    .sort(sortInputs) as IOption[];

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
                options={eventTypeOptions}
                placeholder="Select event markers…"
                value={eventTypeOptions.filter((o) =>
                  field.value.includes(o.id),
                )}
              />
            )}
          />
        )}
      </div>
      <div className="aspect-video bg-alpha-reverse-1">
        <PlotFigure
          options={{
            curveFunction: form.watch('curveFunction'),
            eventMarkers: form.watch('eventMarkers'),
            events,
            marginBottom: form.watch('marginBottom'),
            marginLeft: form.watch('marginLeft'),
            marginRight: form.watch('marginRight'),
            marginTop: form.watch('marginTop'),
            showDots: form.watch('showDots'),
            showLine,
            showLinearRegression: form.watch('showLinearRegression'),
            showXAxisLabel: form.watch('showXAxisLabel'),
            showXAxisTicks: form.watch('showXAxisTicks'),
            showYAxisLabel: form.watch('showYAxisLabel'),
            showYAxisTicks: form.watch('showYAxisTicks'),
            title: form.watch('name'),
            type,
            xLabel: 'Time',
            yLabel: yOptions.find((o) => o.id === y)?.label ?? '',
          }}
          subjectId={subjectId}
        />
      </div>
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
