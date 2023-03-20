'use client';

import Button from '(components)/button';
import Checkbox from '(components)/checkbox';
import NumberInput from '(components)/input-number';
import Select from '(components)/select';
import { Database } from '(types)/database';
import supabase from '(utilities)/browser-supabase-client';
import InputTypes from '(utilities)/enum-input-types';
import forceArray from '(utilities)/force-array';
import { GetEventData } from '(utilities)/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '(utilities)/get-event-type-with-inputs-and-options';
import { ListSessionRoutinesData } from '(utilities)/list-session-routines';
import parseSeconds from '(utilities)/parse-seconds';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import EventSelect from './event-select';

interface EventFormProps {
  event?: GetEventData | ListSessionRoutinesData['event'];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<ListSessionRoutinesData>[0];
  isMission: boolean;
  subjectId: string;
}

interface EventFormValues {
  id?: string;
  inputs: any[];
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
      id: event?.id,
      inputs: eventTypeInputs.map(({ input }) => {
        const inputInputs = eventInputs.filter(
          ({ input_id }) => input_id === input.id
        );

        const eventInput = inputInputs[0];

        switch (input.type) {
          case InputTypes.Checkbox: {
            return Boolean(eventInput?.value ?? false);
          }

          case InputTypes.Duration: {
            if (!eventInput?.value) return [];
            const [hours, minutes, seconds] = parseSeconds(eventInput.value);

            return [
              { id: String(hours), label: `${hours}h` },
              { id: String(minutes), label: `${minutes}m` },
              { id: String(seconds), label: `${seconds}s` },
            ];
          }

          case InputTypes.Number: {
            return eventInput?.value ?? '';
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
                  id === eventInput?.input_option_id
              ) ?? null
            );
          }
        }
      }),
    },
  });

  if (event && !eventTypeInputs.length) return null;

  return (
    <form
      className="flex flex-col gap-6 sm:px-8"
      onSubmit={form.handleSubmit(async ({ id, inputs }) => {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .upsert({ event_type_id: eventType.id, id, subject_id: subjectId })
          .select('id')
          .single();

        if (eventError) {
          alert(eventError.message);
          return;
        }

        form.setValue('id', eventData.id);
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
                  Number(input[0]?.id || 0) * 60 * 60 +
                    Number(input[1]?.id || 0) * 60 +
                    Number(input[2]?.id || 0)
                );

                acc.insertedEventInputs.push(payload);
                return acc;
              }

              case InputTypes.MultiSelect: {
                input.forEach(({ id }: { id: string }) =>
                  acc.insertedEventInputs.push({
                    ...payload,
                    input_option_id: id,
                  })
                );

                return acc;
              }

              case InputTypes.Select: {
                payload.input_option_id = input.id;
                acc.insertedEventInputs.push(payload);
                return acc;
              }

              default: {
                return acc;
              }
            }
          },
          { insertedEventInputs: [] }
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
              <fieldset className="group">
                <legend
                  className="label"
                  onClick={() => form.setFocus(`inputs.${i}.0`)}
                >
                  {input.label}
                </legend>
                <div className="grid grid-cols-3">
                  <Controller
                    control={form.control}
                    name={`inputs.${i}.0`}
                    render={({ field }) => (
                      <Select
                        className="rounded-r-none border-r-0"
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
          </div>
        );
      })}
      <Button
        className={twMerge('w-full', eventTypeInputs.length && 'mt-8')}
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
