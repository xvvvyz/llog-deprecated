'use client';

import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import PageModalBackButton from '@/_components/page-modal-back-button';
import PlotFigure from '@/_components/plot-figure';
import * as Popover from '@/_components/popover';
import Select, { IOption } from '@/_components/select';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import BarInterval from '@/_constants/enum-bar-interval';
import BarReducer from '@/_constants/enum-bar-reducer';
import ChartType from '@/_constants/enum-chart-type';
import LineCurveFunction from '@/_constants/enum-line-curve-function';
import TimeSinceMilliseconds from '@/_constants/enum-time-since-milliseconds';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertInsight from '@/_mutations/upsert-insight';
import { GetInsightData } from '@/_queries/get-insight';
import { ListEventsData } from '@/_queries/list-events';
import { InsightConfigJson } from '@/_types/insight-config-json';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import getInputDetailsFromEvents from '@/_utilities/get-input-details-from-events';
import getInsightOptionsFromEvents from '@/_utilities/get-insight-options-from-events';
import { ArrowsPointingInIcon } from '@heroicons/react/24/outline';
import AdjustmentsHorizontalIcon from '@heroicons/react/24/outline/AdjustmentsHorizontalIcon';
import FunnelIcon from '@heroicons/react/24/outline/FunnelIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller } from 'react-hook-form';

const INCLUDE_EVENTS_SINCE_OPTIONS = [
  { id: TimeSinceMilliseconds.Week, label: '1 week ago' },
  { id: TimeSinceMilliseconds.Month, label: '1 month ago' },
  { id: TimeSinceMilliseconds.Quarter, label: '3 months ago' },
  { id: TimeSinceMilliseconds.Half, label: '6 months ago' },
  { id: TimeSinceMilliseconds.Year, label: '1 year ago' },
];

const LINE_CURVE_FUNCTION_OPTIONS = [
  { id: LineCurveFunction.Linear, label: 'Linear' },
  { id: LineCurveFunction.Basis, label: 'Basis' },
  { id: LineCurveFunction.Bundle, label: 'Bundle' },
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
  { id: BarReducer.Mean, isDisabled: false, label: 'Average' },
  { id: BarReducer.Sum, isDisabled: false, label: 'Sum' },
  { id: BarReducer.Min, isDisabled: false, label: 'Min' },
  { id: BarReducer.Max, isDisabled: false, label: 'Max' },
];

interface InsightFormProps {
  events: NonNullable<ListEventsData>;
  insight?: NonNullable<GetInsightData>;
  subjectId: string;
}

export type InsightFormValues = InsightConfigJson & {
  name: string;
  order?: number | null;
};

const InsightForm = ({ events, insight, subjectId }: InsightFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const cacheKey = getFormCacheKey.insight({ id: insight?.id, subjectId });
  const config = insight?.config as InsightConfigJson;
  const router = useRouter();

  const form = useCachedForm<InsightFormValues>(cacheKey, {
    defaultValues: {
      barInterval: config?.barInterval ?? BarInterval.Day,
      barReducer: config?.barReducer ?? BarReducer.Mean,
      includeEventsFrom: config?.includeEventsFrom ?? null,
      includeEventsSince: config?.includeEventsSince ?? null,
      input: config?.input,
      inputOptions: config?.inputOptions ?? [],
      lineCurveFunction: config?.lineCurveFunction ?? LineCurveFunction.Linear,
      marginBottom: config?.marginBottom ?? '60',
      marginLeft: config?.marginLeft ?? '60',
      marginRight: config?.marginRight ?? '40',
      marginTop: config?.marginTop ?? '30',
      name: insight?.name ?? '',
      order: insight?.order,
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

  const { isInputNominal } = getInputDetailsFromEvents({ events, inputId });

  const {
    eventTypeOptions,
    inputOptions,
    inputOptionsOptions,
    trainingPlanOptions,
  } = getInsightOptionsFromEvents({ events, inputId });

  const eventTypeOrTrainingPlanOptions = [
    { label: 'Event types', options: eventTypeOptions },
    { label: 'Training plans', options: trainingPlanOptions },
  ];

  return (
    <form
      className="flex flex-col gap-8 px-4 py-8 sm:px-8"
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

          router.back();
        }),
      )}
    >
      <div className="grid gap-4 md:grid-cols-3">
        <Input
          placeholder="Name"
          maxLength={49}
          required
          {...form.register('name')}
        />
        <Controller
          control={form.control}
          name="input"
          render={({ field }) => (
            <Select
              className="md:col-span-2"
              isClearable={false}
              name={field.name}
              noOptionsMessage={() => 'No inputs have been recorded.'}
              onBlur={field.onBlur}
              onChange={(value) => {
                const inputId = (value as IOption).id;
                field.onChange(inputId);
                form.setValue('includeEventsFrom', null);
                form.setValue('includeEventsSince', null);
                form.setValue('inputOptions', []);

                const { isInputNominal } = getInputDetailsFromEvents({
                  events,
                  inputId,
                });

                form.setValue(
                  'barReducer',
                  isInputNominal ? BarReducer.Count : BarReducer.Mean,
                );
              }}
              options={inputOptions}
              placeholder="Select an input…"
              value={inputOptions.find((o) => field.value === o.id)}
            />
          )}
        />
      </div>
      <div className="rounded border border-alpha-1 bg-bg-3 drop-shadow-2xl">
        <PlotFigure
          barInterval={form.watch('barInterval')}
          barReducer={form.watch('barReducer')}
          defaultHeight={200}
          events={events}
          includeEventsFrom={form.watch('includeEventsFrom')}
          includeEventsSince={form.watch('includeEventsSince')}
          inputId={inputId}
          inputOptions={form.watch('inputOptions')}
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
      <div className="flex flex-col gap-4 md:flex-row">
        <Checkbox
          className="w-full"
          label="Dots"
          labelInside
          {...form.register('showDots')}
        />
        <div className="flex w-full">
          <Checkbox
            className="w-full"
            inputClassName="rounded-r-none"
            label="Line"
            labelInside
            {...form.register('showLine')}
          />
          <Popover.Root>
            <Popover.Trigger asChild>
              <IconButton
                className="rounded-l-none border-l-0 p-2.5"
                colorScheme="transparent"
                icon={<AdjustmentsHorizontalIcon className="w-5" />}
                label="Line settings"
                variant="primary"
              />
            </Popover.Trigger>
            <Popover.Content
              align="end"
              className="mr-0 w-64 space-y-6 p-8 pt-7"
              side="top"
            >
              <Controller
                control={form.control}
                name="lineCurveFunction"
                render={({ field }) => (
                  <Select
                    isClearable={false}
                    isSearchable={false}
                    label="Curve function"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(value) => field.onChange((value as IOption)?.id)}
                    options={LINE_CURVE_FUNCTION_OPTIONS as IOption[]}
                    value={LINE_CURVE_FUNCTION_OPTIONS.find(
                      (o) => o.id === field.value,
                    )}
                  />
                )}
              />
            </Popover.Content>
          </Popover.Root>
        </div>
        <div className="flex w-full">
          <Checkbox
            className="w-full"
            inputClassName="rounded-r-none"
            label="Bars"
            labelInside
            {...form.register('showBars')}
          />
          <Popover.Root>
            <Popover.Trigger asChild>
              <IconButton
                className="rounded-l-none border-l-0 p-2.5"
                colorScheme="transparent"
                icon={<AdjustmentsHorizontalIcon className="w-5" />}
                label="Bar settings"
                variant="primary"
              />
            </Popover.Trigger>
            <Popover.Content
              align="end"
              className="mr-0 w-64 space-y-6 p-8 pt-7"
              side="top"
            >
              <Controller
                control={form.control}
                name="barInterval"
                render={({ field }) => (
                  <Select
                    isClearable={false}
                    isSearchable={false}
                    label="Interval"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(value) => field.onChange((value as IOption)?.id)}
                    options={BAR_INTERVAL_OPTIONS as IOption[]}
                    value={BAR_INTERVAL_OPTIONS.find(
                      (o) => o.id === field.value,
                    )}
                  />
                )}
              />
              {!isInputNominal && (
                <Controller
                  control={form.control}
                  name="barReducer"
                  render={({ field }) => (
                    <Select
                      isClearable={false}
                      isSearchable={false}
                      label="Reducer"
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={(value) =>
                        field.onChange((value as IOption)?.id)
                      }
                      options={BAR_REDUCER_OPTIONS}
                      value={BAR_REDUCER_OPTIONS.find(
                        (o) => o.id === field.value,
                      )}
                    />
                  )}
                />
              )}
            </Popover.Content>
          </Popover.Root>
        </div>
        <div className="flex w-full gap-4 md:w-auto">
          <Popover.Root>
            <Popover.Trigger asChild>
              <IconButton
                className="w-full shrink p-2.5"
                colorScheme="transparent"
                icon={<PlusIcon className="m-0 size-5" />}
                label="Margins"
                variant="primary"
              />
            </Popover.Trigger>
            <Popover.Content
              align="end"
              className="mr-0 w-96 space-y-4 p-8 pt-7"
              side="top"
            >
              <Checkbox
                label="Linear regression"
                {...form.register('showLinearRegression')}
              />
            </Popover.Content>
          </Popover.Root>
          <Popover.Root>
            <Popover.Trigger asChild>
              <IconButton
                className="w-full shrink p-2.5"
                colorScheme="transparent"
                icon={<FunnelIcon className="m-0 size-5" />}
                label="Filters"
                variant="primary"
              />
            </Popover.Trigger>
            <Popover.Content
              align="end"
              className="mr-0 w-96 space-y-6 p-8 pt-7"
              side="top"
            >
              <Controller
                control={form.control}
                name="includeEventsFrom"
                render={({ field }) => {
                  let value;

                  if (field.value) {
                    for (const group of eventTypeOrTrainingPlanOptions) {
                      value = group.options.find((o) => o.id === field.value);
                      if (value) break;
                    }
                  }

                  return (
                    <Select
                      isSearchable={false}
                      label="Events from"
                      name={field.name}
                      onBlur={field.onBlur}
                      onChange={(value) =>
                        field.onChange((value as IOption)?.id ?? null)
                      }
                      options={eventTypeOrTrainingPlanOptions}
                      placeholder="All event types/training plans…"
                      value={value}
                    />
                  );
                }}
              />
              <Controller
                control={form.control}
                name="includeEventsSince"
                render={({ field }) => (
                  <Select
                    isSearchable={false}
                    label="Events since"
                    name={field.name}
                    onBlur={field.onBlur}
                    onChange={(value) =>
                      field.onChange((value as IOption)?.id ?? null)
                    }
                    options={INCLUDE_EVENTS_SINCE_OPTIONS}
                    placeholder="The beginning of time…"
                    value={INCLUDE_EVENTS_SINCE_OPTIONS.find(
                      (o) => field.value === o.id,
                    )}
                  />
                )}
              />
              {inputOptionsOptions[inputId] && (
                <Controller
                  control={form.control}
                  name="inputOptions"
                  render={({ field }) => (
                    <Select
                      isMulti
                      label="Input options"
                      name={field.name}
                      noOptionsMessage={() => 'No options.'}
                      onBlur={field.onBlur}
                      onChange={(values) =>
                        field.onChange((values as IOption[]).map((v) => v.id))
                      }
                      options={inputOptionsOptions[inputId]}
                      placeholder="All input options…"
                      value={inputOptionsOptions[inputId]?.filter((o) =>
                        field.value.includes(o.id),
                      )}
                    />
                  )}
                />
              )}
            </Popover.Content>
          </Popover.Root>
          <Popover.Root>
            <Popover.Trigger asChild>
              <IconButton
                className="w-full shrink p-2.5"
                colorScheme="transparent"
                icon={<ArrowsPointingInIcon className="m-0 size-5" />}
                label="Margins"
                variant="primary"
              />
            </Popover.Trigger>
            <Popover.Content
              align="end"
              className="mr-0 w-64 space-y-4 p-8 pt-7"
              side="top"
            >
              <div className="grid w-full grid-cols-4 gap-4">
                <Input
                  className="col-span-2 col-start-2"
                  min={0}
                  type="number"
                  {...form.register('marginTop')}
                />
              </div>
              <div className="flex gap-4">
                <Input min={0} type="number" {...form.register('marginLeft')} />
                <Input
                  min={0}
                  type="number"
                  {...form.register('marginRight')}
                />
              </div>
              <div className="grid w-full grid-cols-4 gap-4">
                <Input
                  className="col-span-2 col-start-2"
                  min={0}
                  type="number"
                  {...form.register('marginBottom')}
                />
              </div>
            </Popover.Content>
          </Popover.Root>
        </div>
      </div>
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      <div className="flex flex-col-reverse gap-8 pt-8 md:flex-row md:items-end md:justify-between">
        <UnsavedChangesBanner<InsightFormValues>
          className="shrink-0"
          form={form}
        />
        <div className="mx-auto flex w-full max-w-sm gap-4 md:mx-0">
          <PageModalBackButton className="w-full" colorScheme="transparent">
            Close
          </PageModalBackButton>
          <Button
            className="w-full"
            loading={isTransitioning}
            loadingText="Saving…"
            type="submit"
          >
            Save
          </Button>
        </div>
      </div>
    </form>
  );
};

export default InsightForm;
