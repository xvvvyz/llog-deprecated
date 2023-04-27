'use client';

import Button from '(components)/button';
import Checkbox from '(components)/checkbox';
import Input from '(components)/input';
import NumberInput from '(components)/input-number';
import Select from '(components)/select';
import { Database } from '(types)/database';
import InputTypes from '(utilities)/enum-input-types';
import forceArray from '(utilities)/force-array';
import formatDatetimeLocal from '(utilities)/format-datetime-local';
import { GetEventData } from '(utilities)/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '(utilities)/get-event-type-with-inputs-and-options';
import { GetSessionData } from '(utilities)/get-session';
import supabase from '(utilities)/global-supabase-client';
import parseSeconds from '(utilities)/parse-seconds';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import { Controller, useForm } from 'react-hook-form';
import EventSelect from './event-select';
import EventStopwatch from './event-stopwatch';

interface EventFormProps {
  event?: GetEventData | GetSessionData['routines'][0]['event'][0];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<GetSessionData>['routines'][0];
  isMission: boolean;
  subjectId: string;
}

type CheckboxInputType = boolean;

type DurationInputType = Array<{
  id: string;
  label: string;
}>;

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
  event,
  eventType,
  isMission,
  subjectId,
}: EventFormProps) => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const eventInputs = forceArray(event?.inputs);
  const eventTypeInputs = forceArray(eventType?.inputs);

  const form = useForm<EventFormValues>({
    defaultValues: {
      completionTime: formatDatetimeLocal(event?.created_at),
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
            return input.options.filter(
              ({ id }: Database['public']['Tables']['input_options']['Row']) =>
                inputInputs.some(
                  ({ input_option_id }) => input_option_id === id
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
              notes: input.options.reduce(
                (
                  acc: StopwatchInputType['notes'],
                  {
                    id,
                    label,
                  }: Database['public']['Tables']['input_options']['Row']
                ) => {
                  inputInputs.forEach(({ input_option_id, value }) => {
                    if (input_option_id !== id) return;
                    acc.push({ id: input_option_id, label, time: value });
                  });

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

  return (
    <form
      className="flex flex-col gap-6 sm:px-8"
      onSubmit={form.handleSubmit(async ({ completionTime, id, inputs }) => {
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
                (input as MultiSelectInputType).forEach(({ id }) =>
                  acc.insertedEventInputs.push({
                    ...payload,
                    input_option_id: id,
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
                  ({ id, time }: { id: string; time: string }) =>
                    acc.insertedEventInputs.push({
                      ...payload,
                      input_option_id: id,
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

        await redirect(
          `/subjects/${subjectId}/${eventType.type}/${eventType.id}/event/${eventData.id}`,
          { redirect: !isMission }
        );
      })}
    >
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
                        options={Array.from({ length: 24 }, (_, i) => ({
                          id: String(i),
                          label: `${i}h`,
                        }))}
                        placeholder="Hours"
                        {...field}
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
                        options={Array.from({ length: 60 }, (_, i) => ({
                          id: String(i),
                          label: `${i}m`,
                        }))}
                        placeholder="Minutes"
                        {...field}
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
                        options={Array.from({ length: 60 }, (_, i) => ({
                          id: String(i),
                          label: `${i}s`,
                        }))}
                        placeholder="Seconds"
                        {...field}
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
      {event && (
        <Input
          label="Completion time"
          step="any"
          type="datetime-local"
          {...form.register('completionTime')}
        />
      )}
      <Button
        className="mt-8 w-full"
        colorScheme={event ? 'transparent' : 'accent'}
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        {isMission && !event ? 'Complete' : 'Save'}
      </Button>
    </form>
  );
};

export type { EventFormValues };
export default EventForm;
