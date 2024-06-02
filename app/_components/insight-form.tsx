'use client';

import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import Input from '@/_components/input';
import PlotFigure from '@/_components/plot-figure';
import Select, { IOption } from '@/_components/select';
import ChartType from '@/_constants/enum-chart-type';
import CurveFunction from '@/_constants/enum-curve-function';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertInsight from '@/_mutations/upsert-insight';
import { GetInsightData } from '@/_queries/get-insight';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { InsightConfigJson } from '@/_types/insight-config-json';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import sortInputs from '@/_utilities/sort-inputs';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller } from 'react-hook-form';

const CURVE_FUNCTION_OPTIONS = [
  { id: CurveFunction.Linear, label: 'Linear' },
  { id: CurveFunction.Basis, label: 'Basis' },
  { id: CurveFunction.Bundle, label: 'Bundle' },
  { id: CurveFunction.Cardinal, label: 'Cardinal' },
  { id: CurveFunction.CatmullRom, label: 'Catmull-rom' },
  { id: CurveFunction.Natural, label: 'Natural' },
  { id: CurveFunction.Step, label: 'Step' },
];

interface InsightFormProps {
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  events: ReturnType<typeof formatTabularEvents>;
  insight?: NonNullable<GetInsightData>;
  subjectId: string;
}

type InsightFormValues = InsightConfigJson & {
  name: string;
};

const InsightForm = ({
  availableInputs,
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
      curveFunction: config?.curveFunction ?? CurveFunction.Linear,
      inputs: config?.inputs ?? [],
      marginBottom: config?.marginBottom ?? '60',
      marginLeft: config?.marginLeft ?? '60',
      marginRight: config?.marginRight ?? '60',
      marginTop: config?.marginTop ?? '60',
      name: insight?.name ?? '',
      showDots: config?.showDots ?? true,
      showLine: config?.showLine ?? false,
      showLinearRegression: config?.showLinearRegression ?? false,
      showXAxisLabel: config?.showXAxisLabel ?? true,
      showXAxisTicks: config?.showXAxisTicks ?? true,
      showYAxisLabel: config?.showYAxisLabel ?? true,
      showYAxisTicks: config?.showYAxisTicks ?? true,
      type: config?.type ?? ChartType.TimeSeries,
    },
  });

  const showLine = form.watch('showLine');
  const inputs = form.watch('inputs');
  const inputOptions = availableInputs.sort(sortInputs) as IOption[];

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
          name="inputs"
          render={({ field }) => (
            <Select
              isClearable={false}
              isMulti
              label="Inputs"
              name={field.name}
              onBlur={field.onBlur}
              onChange={(value) =>
                field.onChange((value as IOption[]).map((o) => o.id))
              }
              options={inputOptions}
              placeholder="Select a data point…"
              value={inputOptions.filter((o) => field.value.includes(o.id))}
            />
          )}
        />
      </div>
      <div className="bg-alpha-reverse-1">
        <PlotFigure
          options={{
            curveFunction: form.watch('curveFunction'),
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
            type: form.watch('type'),
            xLabel: 'Time',
            yLabel:
              inputOptions.find((o) => inputs?.includes(o.id))?.label ?? '',
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
        <Checkbox label="Dots" {...form.register('showDots')} />
        <Checkbox label="Line" {...form.register('showLine')} />
        <Checkbox
          label="Trend line"
          {...form.register('showLinearRegression')}
        />
      </div>
      {showLine && (
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
