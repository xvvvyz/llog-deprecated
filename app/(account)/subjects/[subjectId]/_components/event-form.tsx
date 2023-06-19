'use client';

import Checkbox from '@/(account)/_components/checkbox';
import NumberInput from '@/(account)/_components/input-number';
import RichTextarea from '@/(account)/_components/rich-textarea';
import Select from '@/(account)/_components/select';
import InputTypes from '@/(account)/_constants/enum-input-types';
import { GetEventData } from '@/(account)/_server/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '@/(account)/_server/get-event-type-with-inputs-and-options';
import { GetSessionData } from '@/(account)/_server/get-session';
import forceArray from '@/(account)/_utilities/force-array';
import formatDatetimeLocal from '@/(account)/_utilities/format-datetime-local';
import parseSeconds from '@/(account)/_utilities/parse-seconds';
import sanitizeHtml from '@/(account)/_utilities/sanitize-html';
import Button from '@/_components/button';
import Input from '@/_components/input';
import useSupabase from '@/_hooks/use-supabase';
import { Database } from '@/_types/database';
import { useRouter } from 'next/navigation';
import { useEffect, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import EventSelect from './event-select';
import EventStopwatch from './event-stopwatch';

interface EventFormProps {
  className?: string;
  event?: GetEventData | GetSessionData['modules'][0]['event'][0];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<GetSessionData>['modules'][0];
  isMission?: boolean;
  subjectId: string;
}

type CheckboxInputType = boolean;

type DurationInputTypeOption = { id: string; label: string };

type DurationInputType = [
  DurationInputTypeOption,
  DurationInputTypeOption,
  DurationInputTypeOption
];

type MultiSelectInputType = Array<
  Database['public']['Tables']['input_options']['Row']
>;

type NumberInputType = string;

type SelectInputType =
  | Database['public']['Tables']['input_options']['Row']
  | null;

type StopwatchInputType = {
  notes: Array<{
    id: string;
    label: string;
    time: string;
  }>;
  time: string;
};

interface EventFormValues {
  comment?: string;
  completionTime?: string;
  id?: string;
  inputs: Array<
    | CheckboxInputType
    | DurationInputType
    | MultiSelectInputType
    | NumberInputType
    | SelectInputType
    | StopwatchInputType
  >;
}

const EventForm = ({
  className,
  event,
  eventType,
  isMission,
  subjectId,
}: EventFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const eventInputs = forceArray(event?.inputs);
  const eventTypeInputs = forceArray(eventType?.inputs);
  const router = useRouter();
  const supabase = useSupabase();

  const form = useForm<EventFormValues>({
    defaultValues: {
      completionTime: formatDatetimeLocal(event?.created_at ?? new Date()),
      id: event?.id,
      inputs: eventTypeInputs.map(({ input }) => {
        const inputInputs = eventInputs.filter(
          ({ input_id }) => input_id === input.id
        );

        switch (input.type) {
          case InputTypes.Checkbox: {
            return Boolean(inputInputs[0]?.value ?? false);
          }

          case InputTypes.Duration: {
            if (!inputInputs[0]?.value) return [];
            const { hours, minutes, seconds } = parseSeconds(
              inputInputs[0].value
            );

            return [
              { id: String(hours), label: `${Number(hours)}h` },
              { id: String(minutes), label: `${Number(minutes)}m` },
              { id: String(seconds), label: `${Number(seconds)}s` },
            ];
          }

          case InputTypes.Number: {
            return inputInputs[0]?.value ?? '';
          }

          case InputTypes.MultiSelect: {
            return inputInputs.map(({ input_option_id }) =>
              input.options.find(
                ({
                  id,
                }: Database['public']['Tables']['input_options']['Row']) =>
                  input_option_id === id
              )
            );
          }

          case InputTypes.Select: {
            return (
              input.options.find(
                ({
                  id,
                }: Database['public']['Tables']['input_options']['Row']) =>
                  id === inputInputs[0]?.input_option_id
              ) ?? null
            );
          }

          case InputTypes.Stopwatch: {
            return {
              notes: inputInputs.reduce(
                (
                  acc: StopwatchInputType['notes'],
                  { input_option_id, value }
                ) => {
                  input.options.forEach(
                    ({
                      id,
                      label,
                    }: Database['public']['Tables']['input_options']['Row']) => {
                      if (input_option_id !== id) return;
                      acc.push({ id, label, time: value });
                    }
                  );

                  return acc;
                },
                []
              ),
              time: inputInputs.find(({ input_option_id }) => !input_option_id)
                ?.value,
            };
          }
        }
      }),
    },
  });

  useEffect(() => {
    if (!isMission || event) return;

    const interval: NodeJS.Timeout = setInterval(() => {
      if (form.formState.dirtyFields.completionTime) {
        clearInterval(interval);
        return;
      }

      form.setValue('completionTime', formatDatetimeLocal(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, [event, form, isMission]);

  return (
    <form
      className={twMerge('flex flex-col gap-6', className)}
      onSubmit={form.handleSubmit(
        async ({ comment, completionTime, id, inputs }) => {
          const { data: eventData, error: eventError } = await supabase
            .from('events')
            .upsert({
              created_at: completionTime
                ? new Date(completionTime).toISOString()
                : undefined,
              event_type_id: eventType.id,
              id,
              subject_id: subjectId,
            })
            .select('created_at, id')
            .single();

          if (eventError) {
            alert(eventError.message);
            return;
          }

          form.setValue('id', eventData.id);

          form.setValue(
            'completionTime',
            formatDatetimeLocal(eventData.created_at)
          );

          const deletedEventInputs = eventInputs.map(({ id }) => id);

          if (deletedEventInputs.length) {
            const { error: deletedEventInputsError } = await supabase
              .from('event_inputs')
              .delete()
              .in('id', deletedEventInputs);

            if (deletedEventInputsError) {
              alert(deletedEventInputsError.message);
              return;
            }
          }

          const { insertedEventInputs } = inputs.reduce(
            (acc, input, i) => {
              if (
                input === '' ||
                input === null ||
                (Array.isArray(input) && !input.some((v) => v))
              ) {
                return acc;
              }

              const eventTypeInput = eventTypeInputs[i].input;

              const payload: Database['public']['Tables']['event_inputs']['Insert'] =
                {
                  event_id: eventData.id,
                  input_id: eventTypeInput.id,
                  input_option_id: null,
                  value: null,
                };

              switch (eventTypeInput.type) {
                case InputTypes.Checkbox:
                case InputTypes.Number: {
                  payload.value = input;
                  acc.insertedEventInputs.push(payload);
                  return acc;
                }

                case InputTypes.Duration: {
                  payload.value = String(
                    Number((input as DurationInputType)[0]?.id || 0) * 60 * 60 +
                      Number((input as DurationInputType)[1]?.id || 0) * 60 +
                      Number((input as DurationInputType)[2]?.id || 0)
                  );

                  acc.insertedEventInputs.push(payload);
                  return acc;
                }

                case InputTypes.MultiSelect: {
                  (input as MultiSelectInputType).forEach(({ id }, order) =>
                    acc.insertedEventInputs.push({
                      ...payload,
                      input_option_id: id,
                      order,
                    })
                  );

                  return acc;
                }

                case InputTypes.Select: {
                  payload.input_option_id = (input as SelectInputType)?.id;
                  acc.insertedEventInputs.push(payload);
                  return acc;
                }

                case InputTypes.Stopwatch: {
                  (input as StopwatchInputType).notes.forEach(
                    ({ id, time }: { id: string; time: string }, order) =>
                      acc.insertedEventInputs.push({
                        ...payload,
                        input_option_id: id,
                        order,
                        value: time,
                      })
                  );

                  if (Number((input as StopwatchInputType).time)) {
                    acc.insertedEventInputs.push({
                      ...payload,
                      value: (input as StopwatchInputType).time,
                    });
                  }

                  return acc;
                }

                default: {
                  return acc;
                }
              }
            },
            {
              insertedEventInputs: [] as Array<
                Database['public']['Tables']['event_inputs']['Insert']
              >,
            }
          );

          if (insertedEventInputs.length) {
            const { error: insertedEventInputsError } = await supabase
              .from('event_inputs')
              .insert(insertedEventInputs);

            if (insertedEventInputsError) {
              alert(insertedEventInputsError.message);
              return;
            }
          }

          if (comment) {
            const { error: commentError } = await supabase
              .from('comments')
              .insert({
                content: sanitizeHtml(comment) as string,
                event_id: eventData.id,
              });

            if (commentError) {
              alert(commentError.message);
              return;
            } else {
              form.setValue('comment', undefined);
            }
          }

          startTransition(() => {
            router.refresh();

            if (!isMission && !event) {
              router.push(`/subjects/${subjectId}/timeline`);
            }
          });
        }
      )}
    >
      <Input
        label={isMission ? 'When was this completed?' : 'When did this happen?'}
        step="any"
        type="datetime-local"
        {...form.register('completionTime')}
      />
      {eventTypeInputs.map(({ input }, i) => {
        const id = `${eventType.id}-inputs-${i}`;

        return (
          <div key={id}>
            {input.type === InputTypes.Checkbox && (
              <Checkbox label={input.label} {...form.register(`inputs.${i}`)} />
            )}
            {input.type === InputTypes.Duration && (
              <fieldset>
                <legend className="label">{input.label}</legend>
                <div className="grid grid-cols-3">
                  <Controller
                    control={form.control}
                    name={`inputs.${i}.0`}
                    render={({ field }) => (
                      <Select
                        className="rounded-r-none border-r-0"
                        inputType="number"
                        isClearable={false}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(value) => field.onChange(value as any)}
                        options={Array.from({ length: 24 }, (_, i) => ({
                          id: String(i),
                          label: `${i}h`,
                        }))}
                        placeholder="Hours"
                        value={field.value as any}
                      />
                    )}
                  />
                  <Controller
                    control={form.control}
                    name={`inputs.${i}.1`}
                    render={({ field }) => (
                      <Select
                        className="rounded-none"
                        inputType="number"
                        isClearable={false}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(value) => field.onChange(value as any)}
                        options={Array.from({ length: 60 }, (_, i) => ({
                          id: String(i),
                          label: `${i}m`,
                        }))}
                        placeholder="Minutes"
                        value={field.value as any}
                      />
                    )}
                  />
                  <Controller
                    control={form.control}
                    name={`inputs.${i}.2`}
                    render={({ field }) => (
                      <Select
                        className="rounded-l-none border-l-0"
                        inputType="number"
                        isClearable={false}
                        name={field.name}
                        onBlur={field.onBlur}
                        onChange={(value) => field.onChange(value as any)}
                        options={Array.from({ length: 60 }, (_, i) => ({
                          id: String(i),
                          label: `${i}s`,
                        }))}
                        placeholder="Seconds"
                        value={field.value as any}
                      />
                    )}
                  />
                </div>
              </fieldset>
            )}
            {input.type === InputTypes.Number && (
              <NumberInput
                id={id}
                label={input.label}
                {...input.settings}
                {...form.register(`inputs.${i}`)}
              />
            )}
            {(input.type === InputTypes.MultiSelect ||
              input.type === InputTypes.Select) && (
              <Controller
                control={form.control}
                name={`inputs.${i}`}
                render={({ field }) => (
                  <EventSelect field={field} input={input} />
                )}
              />
            )}
            {input.type === InputTypes.Stopwatch && (
              <EventStopwatch<EventFormValues>
                form={form}
                input={input}
                inputIndex={i}
              />
            )}
          </div>
        );
      })}
      {!event && (
        <Controller
          control={form.control}
          name="comment"
          render={({ field }) => <RichTextarea label="Comment" {...field} />}
        />
      )}
      <Button
        className="mt-8 w-full"
        colorScheme={event ? 'transparent' : 'accent'}
        loading={form.formState.isSubmitting || isTransitioning}
        loadingText="Saving…"
        type="submit"
      >
        {event
          ? 'Save inputs'
          : isMission
          ? 'Mark as complete'
          : 'Record event'}
      </Button>
    </form>
  );
};

export type { EventFormValues, MultiSelectInputType, SelectInputType };
export default EventForm;
