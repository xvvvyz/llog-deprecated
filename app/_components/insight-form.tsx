'use client';

import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import InsightPlot from '@/_components/insight-plot';
import * as Label from '@/_components/label';
import * as Modal from '@/_components/modal';
import * as Popover from '@/_components/popover';
import Select, { IOption } from '@/_components/select-v1';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import ChartType from '@/_constants/enum-chart-type';
import Interval from '@/_constants/enum-interval';
import LineCurveFunction from '@/_constants/enum-line-curve-function';
import Reducer from '@/_constants/enum-reducer';
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

const INTERVAL_OPTIONS = [
  { id: Interval.Day, label: 'Day' },
  { id: Interval.Week, label: 'Week' },
  { id: Interval.Month, label: 'Month' },
  { id: Interval.Quarter, label: 'Quarter-year' },
  { id: Interval.Half, label: 'Half-year' },
  { id: Interval.Year, label: 'Year' },
];

const LINE_CURVE_FUNCTION_OPTIONS = [
  { id: LineCurveFunction.Linear, label: 'Linear' },
  { id: LineCurveFunction.CatmullRom, label: 'Catmull-rom' },
  { id: LineCurveFunction.Basis, label: 'Basis' },
  { id: LineCurveFunction.Bundle, label: 'Bundle' },
  { id: LineCurveFunction.Step, label: 'Step' },
];

const REDUCER_OPTIONS = [
  { id: Reducer.Count, label: 'Count' },
  { id: Reducer.Mean, label: 'Average' },
  { id: Reducer.Sum, label: 'Sum' },
  { id: Reducer.Min, label: 'Min' },
  { id: Reducer.Max, label: 'Max' },
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
      annotationIncludeEventsFrom: config?.annotationIncludeEventsFrom ?? null,
      annotationInput: config?.annotationInput ?? null,
      annotationInputOptions: config?.annotationInputOptions ?? [],
      includeEventsFrom: config?.includeEventsFrom ?? null,
      includeEventsSince: config?.includeEventsSince ?? null,
      input: config?.input,
      inputOptions: config?.inputOptions ?? [],
      interval: config?.interval ?? null,
      lineCurveFunction: config?.lineCurveFunction ?? LineCurveFunction.Linear,
      marginBottom: config?.marginBottom ?? '60',
      marginLeft: config?.marginLeft ?? '100',
      marginRight: config?.marginRight ?? '60',
      marginTop: config?.marginTop ?? '60',
      name: insight?.name ?? '',
      order: insight?.order,
      reducer: config?.reducer ?? Reducer.Mean,
      showLinearRegression: config?.showLinearRegression ?? false,
      showLinearRegressionConfidence:
        config?.showLinearRegressionConfidence ?? false,
      type: config?.type ?? ChartType.TimeSeries,
    },
  });

  const annotationInputId = form.watch('annotationInput');
  const inputId = form.watch('input');
  const interval = form.watch('interval');
  const { isInputNominal } = getInputDetailsFromEvents({ events, inputId });
  const inputOptions = getInsightOptionsFromEvents({ events, inputId });

  const annotationInputOptions = getInsightOptionsFromEvents({
    events,
    inputId: annotationInputId,
  });

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
      <Input
        placeholder="Name"
        maxLength={49}
        required
        {...form.register('name')}
      />
      <div className="rounded border border-alpha-1 bg-bg-3 drop-shadow-2xl">
        <InsightPlot
          annotationIncludeEventsFrom={form.watch(
            'annotationIncludeEventsFrom',
          )}
          annotationInputId={annotationInputId}
          annotationInputOptions={form.watch('annotationInputOptions')}
          events={events}
          includeEventsFrom={form.watch('includeEventsFrom')}
          includeEventsSince={form.watch('includeEventsSince')}
          inputId={inputId}
          inputOptions={form.watch('inputOptions')}
          interval={interval}
          lineCurveFunction={form.watch('lineCurveFunction')}
          marginBottom={form.watch('marginBottom')}
          marginLeft={form.watch('marginLeft')}
          marginRight={form.watch('marginRight')}
          marginTop={form.watch('marginTop')}
          reducer={form.watch('reducer')}
          showLinearRegression={form.watch('showLinearRegression')}
          showLinearRegressionConfidence={form.watch(
            'showLinearRegressionConfidence',
          )}
          subjectId={subjectId}
          title={form.watch('name')}
          type={form.watch('type')}
        />
      </div>
      <div className="flex flex-col gap-4 md:flex-row">
        <Controller
          control={form.control}
          name="input"
          render={({ field }) => (
            <Select
              className="w-full"
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

                if (isInputNominal) {
                  form.setValue('showLinearRegression', false);
                }

                form.setValue(
                  'reducer',
                  isInputNominal ? Reducer.Count : Reducer.Mean,
                );
              }}
              options={inputOptions.inputOptions}
              placeholder="Select an input to plot…"
              value={inputOptions.inputOptions.find(
                (o) => field.value === o.id,
              )}
            />
          )}
        />
        <div className="flex w-full gap-4 md:w-auto">
          <Popover.Root>
            <Popover.Trigger asChild>
              <IconButton
                className="w-full shrink p-2.5"
                colorScheme="transparent"
                icon={<FunnelIcon className="w-5" />}
                label="Input filters"
                variant="primary"
              />
            </Popover.Trigger>
            <Popover.Content
              align="end"
              className="mr-0 w-96 space-y-6 p-8 pt-7"
              side="top"
            >
              <InputRoot>
                <Label.Root htmlFor="react-select-includeEventsFrom-input">
                  Events from
                </Label.Root>
                <Controller
                  control={form.control}
                  name="includeEventsFrom"
                  render={({ field }) => {
                    let value;

                    if (field.value) {
                      for (const group of inputOptions.eventTypeOrProtocolOptions) {
                        value = group.options.find((o) => o.id === field.value);
                        if (value) break;
                      }
                    }

                    return (
                      <Select
                        isSearchable={false}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(value) =>
                          field.onChange((value as IOption)?.id ?? null)
                        }
                        options={inputOptions.eventTypeOrProtocolOptions}
                        placeholder="All event types/protocols…"
                        value={value}
                      />
                    );
                  }}
                />
              </InputRoot>
              <InputRoot>
                <Label.Root htmlFor="react-select-includeEventsSince-input">
                  Events since
                </Label.Root>
                <Controller
                  control={form.control}
                  name="includeEventsSince"
                  render={({ field }) => (
                    <Select
                      isSearchable={false}
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
              </InputRoot>
              {inputOptions.inputOptionsOptions[inputId] && (
                <InputRoot>
                  <Label.Root htmlFor="react-select-inputOptions-input">
                    Input options
                  </Label.Root>
                  <Controller
                    control={form.control}
                    name="inputOptions"
                    render={({ field }) => (
                      <Select
                        isMulti
                        name={field.name}
                        noOptionsMessage={() => 'No options.'}
                        onBlur={field.onBlur}
                        onChange={(values) =>
                          field.onChange((values as IOption[]).map((v) => v.id))
                        }
                        options={inputOptions.inputOptionsOptions[inputId]}
                        placeholder="All input options…"
                        value={inputOptions.inputOptionsOptions[
                          inputId
                        ]?.filter((o) => field.value.includes(o.id))}
                      />
                    )}
                  />
                </InputRoot>
              )}
            </Popover.Content>
          </Popover.Root>
          <Popover.Root>
            <Popover.Trigger asChild>
              <IconButton
                className="w-full shrink p-2.5"
                colorScheme="transparent"
                icon={<AdjustmentsHorizontalIcon className="m-0 size-5" />}
                label="Plot settings"
                variant="primary"
              />
            </Popover.Trigger>
            <Popover.Content
              align="end"
              className="mr-0 w-96 space-y-6 p-8 pt-7"
              side="top"
            >
              <InputRoot>
                <Label.Root htmlFor="react-select-interval-input">
                  Interval
                </Label.Root>
                <div className="flex w-full">
                  <Controller
                    control={form.control}
                    name="interval"
                    render={({ field }) => (
                      <Select
                        className="w-full rounded-r-none border-r-0"
                        isSearchable={false}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(value) =>
                          field.onChange((value as IOption)?.id ?? null)
                        }
                        options={INTERVAL_OPTIONS}
                        placeholder="Select an interval…"
                        value={INTERVAL_OPTIONS.find(
                          (o) => o.id === field.value,
                        )}
                      />
                    )}
                  />
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <IconButton
                        className="rounded-l-none p-2.5"
                        colorScheme="transparent"
                        icon={<AdjustmentsHorizontalIcon className="w-5" />}
                        label="Interval settings"
                        variant="primary"
                      />
                    </Popover.Trigger>
                    <Popover.Content
                      align="end"
                      className="mr-0 w-64 space-y-6 p-8 pt-7"
                      side="top"
                    >
                      <InputRoot>
                        <Label.Root htmlFor="react-select-reducer-input">
                          Reducer
                        </Label.Root>
                        <Controller
                          control={form.control}
                          name="reducer"
                          render={({ field }) => (
                            <Select
                              className="w-full"
                              isClearable={false}
                              isDisabled={!interval || isInputNominal}
                              isSearchable={false}
                              name={field.name}
                              onBlur={field.onBlur}
                              onChange={(value) =>
                                field.onChange((value as IOption)?.id)
                              }
                              options={REDUCER_OPTIONS}
                              value={REDUCER_OPTIONS.find(
                                (o) => o.id === field.value,
                              )}
                            />
                          )}
                        />
                      </InputRoot>
                    </Popover.Content>
                  </Popover.Root>
                </div>
              </InputRoot>
              {(!isInputNominal || interval) && (
                <InputRoot>
                  <Label.Root htmlFor="react-select-lineCurveFunction-input">
                    Curve function
                  </Label.Root>
                  <Controller
                    control={form.control}
                    name="lineCurveFunction"
                    render={({ field }) => (
                      <Select
                        isClearable={false}
                        isSearchable={false}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(value) =>
                          field.onChange((value as IOption)?.id)
                        }
                        options={LINE_CURVE_FUNCTION_OPTIONS as IOption[]}
                        value={LINE_CURVE_FUNCTION_OPTIONS.find(
                          (o) => o.id === field.value,
                        )}
                      />
                    )}
                  />
                </InputRoot>
              )}
            </Popover.Content>
          </Popover.Root>
          <Popover.Root>
            <Popover.Trigger asChild>
              <IconButton
                className="w-full shrink p-2.5"
                colorScheme="transparent"
                icon={<PlusIcon className="m-0 size-5" />}
                label="Add marks"
                variant="primary"
              />
            </Popover.Trigger>
            <Popover.Content
              align="end"
              className="mr-0 w-96 space-y-6 p-8 pt-7"
              side="top"
            >
              <InputRoot>
                <Label.Root htmlFor="react-select-annotationInput-input">
                  Annotate
                </Label.Root>
                <div className="flex w-full">
                  <Controller
                    control={form.control}
                    name="annotationInput"
                    render={({ field }) => (
                      <Select
                        className="w-full rounded-r-none border-r-0"
                        name={field.name}
                        noOptionsMessage={() => 'No inputs have been recorded.'}
                        onBlur={field.onBlur}
                        onChange={(value) => {
                          const inputId = (value as IOption)?.id;
                          field.onChange(inputId ?? null);
                          form.setValue('annotationIncludeEventsFrom', null);
                          form.setValue('annotationInputOptions', []);
                        }}
                        options={annotationInputOptions.inputOptions}
                        placeholder="Select an input…"
                        value={annotationInputOptions.inputOptions.find(
                          (o) => field.value === o.id,
                        )}
                      />
                    )}
                  />
                  <Popover.Root>
                    <Popover.Trigger asChild>
                      <IconButton
                        className="rounded-l-none p-2.5"
                        colorScheme="transparent"
                        icon={<FunnelIcon className="w-5" />}
                        label="Annotation filters"
                        variant="primary"
                      />
                    </Popover.Trigger>
                    <Popover.Content
                      align="end"
                      className="mr-0 w-96 space-y-6 p-8 pt-7"
                      side="top"
                    >
                      <InputRoot>
                        <Label.Root htmlFor="react-select-annotationIncludeEventsFrom-input">
                          Events from
                        </Label.Root>
                        <Controller
                          control={form.control}
                          name="annotationIncludeEventsFrom"
                          render={({ field }) => {
                            let value;

                            if (field.value) {
                              for (const group of annotationInputOptions.eventTypeOrProtocolOptions) {
                                value = group.options.find(
                                  (o) => o.id === field.value,
                                );
                                if (value) break;
                              }
                            }

                            return (
                              <Select
                                isSearchable={false}
                                name={field.name}
                                onBlur={field.onBlur}
                                onChange={(value) =>
                                  field.onChange((value as IOption)?.id ?? null)
                                }
                                options={
                                  annotationInputOptions.eventTypeOrProtocolOptions
                                }
                                placeholder="All event types/protocols…"
                                value={value}
                              />
                            );
                          }}
                        />
                      </InputRoot>
                      {annotationInputOptions.inputOptionsOptions[
                        annotationInputId
                      ] && (
                        <InputRoot>
                          <Label.Root htmlFor="react-select-annotationInputOptions-input">
                            Input options
                          </Label.Root>
                          <Controller
                            control={form.control}
                            name="annotationInputOptions"
                            render={({ field }) => (
                              <Select
                                isMulti
                                name={field.name}
                                noOptionsMessage={() => 'No options.'}
                                onBlur={field.onBlur}
                                onChange={(values) =>
                                  field.onChange(
                                    (values as IOption[]).map((v) => v.id),
                                  )
                                }
                                options={
                                  annotationInputOptions.inputOptionsOptions[
                                    annotationInputId
                                  ]
                                }
                                placeholder="All input options…"
                                value={annotationInputOptions.inputOptionsOptions[
                                  annotationInputId
                                ]?.filter((o) => field.value.includes(o.id))}
                              />
                            )}
                          />
                        </InputRoot>
                      )}
                    </Popover.Content>
                  </Popover.Root>
                </div>
              </InputRoot>
              {!isInputNominal && (
                <InputRoot>
                  <Label.Root htmlFor="showLinearRegression">
                    Linear regression
                  </Label.Root>
                  <div className="flex w-full">
                    <Checkbox
                      className="rounded-r-none border-r-0"
                      {...form.register('showLinearRegression')}
                    />
                    <Popover.Root>
                      <Popover.Trigger asChild>
                        <IconButton
                          className="rounded-l-none p-2.5"
                          colorScheme="transparent"
                          icon={<AdjustmentsHorizontalIcon className="w-5" />}
                          label="Linear regression settings"
                          variant="primary"
                        />
                      </Popover.Trigger>
                      <Popover.Content
                        align="end"
                        className="mr-0 w-64 space-y-6 p-8 pt-7"
                        side="top"
                      >
                        <InputRoot>
                          <Label.Root htmlFor="showLinearRegressionConfidence">
                            Confidence band
                          </Label.Root>
                          <Checkbox
                            {...form.register('showLinearRegressionConfidence')}
                          />
                        </InputRoot>
                      </Popover.Content>
                    </Popover.Root>
                  </div>
                </InputRoot>
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
          <Modal.Close asChild>
            <Button className="w-full" colorScheme="transparent">
              Close
            </Button>
          </Modal.Close>
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
