'use client';

import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import Input from '@/_components/input';
import PlotFigure from '@/_components/plot-figure';
import Select, { IOption } from '@/_components/select';
import NOMINAL_INPUT_TYPES from '@/_constants/constant-nominal-input-types';
import BarInterval from '@/_constants/enum-bar-interval';
import BarReducer from '@/_constants/enum-bar-reducer';
import ChartType from '@/_constants/enum-chart-type';
import InputType from '@/_constants/enum-input-type';
import LineCurveFunction from '@/_constants/enum-line-curve-function';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertInsight from '@/_mutations/upsert-insight';
import { GetInsightData } from '@/_queries/get-insight';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { InsightConfigJson } from '@/_types/insight-config-json';
import formatTabularEvents from '@/_utilities/format-tabular-events';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import sortInputs from '@/_utilities/sort-inputs';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { Controller } from 'react-hook-form';

const LINE_CURVE_FUNCTION_OPTIONS = [
  { id: LineCurveFunction.Linear, label: 'Linear' },
  { id: LineCurveFunction.Basis, label: 'Basis' },
  { id: LineCurveFunction.Bundle, label: 'Bundle' },
  { id: LineCurveFunction.Cardinal, label: 'Cardinal' },
  { id: LineCurveFunction.CatmullRom, label: 'Catmull-rom' },
  { id: LineCurveFunction.Step, label: 'Step' },
];

const BAR_INTERVAL_OPTIONS = [
  { id: BarInterval.Day, label: 'Day' },
  { id: BarInterval.Week, label: 'Week' },
  { id: BarInterval.Month, label: 'Month' },
  { id: BarInterval.Quarter, label: '3 months' },
  { id: BarInterval.Half, label: '6 months' },
  { id: BarInterval.Year, label: 'Year' },
];

const BAR_REDUCER_OPTIONS = [
  { id: BarReducer.Count, isDisabled: false, label: 'Count' },
  { id: BarReducer.Mean, isDisabled: false, label: 'Average' },
  { id: BarReducer.Sum, isDisabled: false, label: 'Sum' },
  { id: BarReducer.Min, isDisabled: false, label: 'Min' },
  { id: BarReducer.Max, isDisabled: false, label: 'Max' },
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
  const cacheKey = getFormCacheKey.insight({ id: insight?.id, subjectId });
  const config = insight?.config as InsightConfigJson;
  const router = useRouter();

  const form = useCachedForm<InsightFormValues>(cacheKey, {
    defaultValues: {
      barInterval: config?.barInterval ?? BarInterval.Week,
      barReducer: config?.barReducer ?? BarReducer.Mean,
      input: config?.input,
      lineCurveFunction: config?.lineCurveFunction ?? LineCurveFunction.Linear,
      marginBottom: config?.marginBottom ?? '60',
      marginLeft: config?.marginLeft ?? '60',
      marginRight: config?.marginRight ?? '60',
      marginTop: config?.marginTop ?? '60',
      name: insight?.name ?? '',
      showBars: config?.showBars ?? false,
      showDots: config?.showDots ?? true,
      showLine: config?.showLine ?? false,
      showLinearRegression: config?.showLinearRegression ?? false,
      type: config?.type ?? ChartType.TimeSeries,
    },
  });

  const inputId = form.watch('input');
  const showBars = form.watch('showBars');
  const showLine = form.watch('showLine');

  const inputOptions = availableInputs.sort(sortInputs) as IOption[];
  const input = availableInputs.find((i) => i.id === inputId);
  const inputIsNominal = NOMINAL_INPUT_TYPES.includes(input?.type as InputType);

  useEffect(() => {
    if (!showBars) return;

    if (inputIsNominal) {
      form.setValue('barReducer', BarReducer.Count);
      form.setValue('showDots', false);
      form.setValue('showLine', false);
      form.setValue('showLinearRegression', false);
    } else {
      form.setValue('barReducer', BarReducer.Mean);
    }
  }, [form, inputIsNominal, showBars]);

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
    >
      <div className="grid gap-4 border-b border-alpha-1 px-4 py-8 sm:px-8 md:grid-cols-3">
        <Input label="Name" required {...form.register('name')} />
        <div className="md:col-span-2">
          <Controller
            control={form.control}
            name="input"
            render={({ field }) => (
              <Select
                isClearable={false}
                label="Input"
                name={field.name}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange((value as IOption).id)}
                options={inputOptions}
                placeholder="Select an input…"
                value={inputOptions.find((o) => field.value === o.id)}
              />
            )}
          />
        </div>
      </div>
      <div className="bg-alpha-reverse-1">
        <PlotFigure
          barInterval={form.watch('barInterval')}
          barReducer={form.watch('barReducer')}
          defaultHeight={250}
          events={events}
          input={input?.label as string}
          inputIsNominal={inputIsNominal}
          lineCurveFunction={form.watch('lineCurveFunction')}
          marginBottom={form.watch('marginBottom')}
          marginLeft={form.watch('marginLeft')}
          marginRight={form.watch('marginRight')}
          marginTop={form.watch('marginTop')}
          showBars={showBars}
          showDots={form.watch('showDots')}
          showLine={showLine}
          showLinearRegression={form.watch('showLinearRegression')}
          subjectId={subjectId}
          title={form.watch('name')}
          type={form.watch('type')}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-alpha-1 px-4 py-8 sm:px-8 md:grid-cols-4">
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
      <div className="grid gap-4 border-t border-alpha-1 px-4 py-8 sm:px-8 md:grid-cols-3">
        <Controller
          control={form.control}
          name="lineCurveFunction"
          render={({ field }) => (
            <Select
              isDisabled={!showLine}
              isClearable={false}
              label="Line function"
              name={field.name}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange((value as IOption).id)}
              options={LINE_CURVE_FUNCTION_OPTIONS as IOption[]}
              value={LINE_CURVE_FUNCTION_OPTIONS.find(
                (o) => o.id === field.value,
              )}
            />
          )}
        />
        <Controller
          control={form.control}
          name="barInterval"
          render={({ field }) => (
            <Select
              isDisabled={!showBars}
              isClearable={false}
              label="Bar interval"
              name={field.name}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange((value as IOption).id)}
              options={BAR_INTERVAL_OPTIONS as IOption[]}
              value={BAR_INTERVAL_OPTIONS.find((o) => o.id === field.value)}
            />
          )}
        />
        <Controller
          control={form.control}
          name="barReducer"
          render={({ field }) => (
            <Select
              isDisabled={!showBars}
              isClearable={false}
              label="Bar reducer"
              name={field.name}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange((value as IOption).id)}
              options={BAR_REDUCER_OPTIONS.map((o) => {
                o.isDisabled = inputIsNominal
                  ? o.id !== BarReducer.Count
                  : o.id === BarReducer.Count;

                return o;
              })}
              value={BAR_REDUCER_OPTIONS.find((o) => o.id === field.value)}
            />
          )}
        />
      </div>
      <div className="grid grid-cols-2 gap-4 border-t border-alpha-1 px-4 py-8 sm:px-8">
        <Checkbox
          disabled={showBars && inputIsNominal}
          label="Dots"
          {...form.register('showDots')}
        />
        <Checkbox
          disabled={showBars && inputIsNominal}
          label="Line"
          {...form.register('showLine')}
        />
        <Checkbox label="Bars" {...form.register('showBars')} />
        <Checkbox
          disabled={showBars && inputIsNominal}
          label="Trend line"
          {...form.register('showLinearRegression')}
        />
      </div>
      {form.formState.errors.root && (
        <div className="border-t border-alpha-1 px-4 py-8 text-center sm:px-8">
          {form.formState.errors.root.message}
        </div>
      )}
      <div className="flex justify-end gap-4 border-t border-alpha-1 px-4 py-8 sm:px-8">
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
