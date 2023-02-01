'use client';

import Button from '(components)/button';
import Checkbox from '(components)/checkbox';
import Input from '(components)/input';
import Label from '(components)/label';
import Select from '(components)/select';
import { Database } from '(types)/database';
import supabase from '(utilities)/browser-supabase-client';
import forceArray from '(utilities)/force-array';
import formatTimeForInput from '(utilities)/format-time-for-input';
import { GetEventData } from '(utilities)/get-event';
import { GetEventTypeData } from '(utilities)/get-event-type';
import { ListSessionRoutinesData } from '(utilities)/list-session-routines';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface EventFormProps {
  event?: GetEventData;
  eventType:
    | NonNullable<GetEventTypeData>
    | NonNullable<ListSessionRoutinesData>[0];
  isMission: boolean;
  redirectOnSubmit: boolean;
  subjectId: string;
}

interface EventFormValues {
  id?: string;
  inputs: any[]; // 😱
}

const EventForm = ({
  event,
  eventType,
  isMission,
  redirectOnSubmit,
  subjectId,
}: EventFormProps) => {
  const eventInputs = forceArray(event?.inputs);
  const eventTypeInputs = forceArray(eventType?.inputs);
  const submitRedirect = useSubmitRedirect();

  const form = useForm<EventFormValues>({
    defaultValues: {
      id: event?.id,
      inputs: eventTypeInputs.map(({ input }) => {
        const inputInputs = eventInputs.filter(
          ({ input_id }) => input_id === input.id
        );

        const eventInput = inputInputs[0];

        switch (input.type) {
          case 'checkbox': {
            return Boolean(eventInput?.value ?? false);
          }

          case 'duration':
          case 'number': {
            return eventInput?.value ?? '';
          }

          case 'multi_select': {
            return input.options.filter(
              ({ id }: Database['public']['Tables']['input_options']['Row']) =>
                inputInputs.some(
                  ({ input_option_id }) => input_option_id === id
                )
            );
          }

          case 'select': {
            return (
              input.options.find(
                ({
                  id,
                }: Database['public']['Tables']['input_options']['Row']) =>
                  id === eventInput?.input_option_id
              ) ?? null
            );
          }

          case 'time': {
            return formatTimeForInput(eventInput?.value ?? new Date());
          }
        }
      }),
    },
  });

  return (
    <form
      className="flex flex-col gap-6"
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
            if (input === '' || input === null) return acc;
            const eventTypeInput = eventTypeInputs[i].input;

            const payload: Database['public']['Tables']['event_inputs']['Insert'] =
              {
                event_id: eventData.id,
                input_id: eventTypeInput.id,
                input_option_id: null,
                value: null,
              };

            switch (eventTypeInput.type) {
              case 'checkbox':
              case 'duration':
              case 'number': {
                payload.value = input;
                acc.insertedEventInputs.push(payload);
                return acc;
              }

              case 'multi_select': {
                input.forEach(({ id }: { id: string }) =>
                  acc.insertedEventInputs.push({
                    ...payload,
                    input_option_id: id,
                  })
                );

                return acc;
              }

              case 'select': {
                payload.input_option_id = input.id;
                acc.insertedEventInputs.push(payload);
                return acc;
              }

              case 'time': {
                payload.value = new Date(input).toISOString();
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

        await submitRedirect(`/subjects/${subjectId}`, {
          redirect: redirectOnSubmit,
        });
      })}
    >
      {eventTypeInputs.map(({ input }, i) => (
        <Label
          className={twMerge(
            input.type === 'checkbox' &&
              'mt-1 flex-row-reverse items-start justify-end gap-4 text-fg-1 first-of-type:mt-0'
          )}
          key={input.id}
        >
          {input.label}
          <Controller
            control={form.control}
            name={`inputs.${i}`}
            render={({ field }) => {
              switch (input.type) {
                case 'checkbox': {
                  return <Checkbox {...field} />;
                }

                case 'duration': {
                  return (
                    <Input className="" min={0} type="number" {...field} />
                  );
                }

                case 'multi_select': {
                  return (
                    <Select
                      isMulti
                      isSearchable={false}
                      options={input.options}
                      {...field}
                    />
                  );
                }

                case 'number': {
                  return <Input min={0} type="number" {...field} />;
                }

                case 'select': {
                  return (
                    <Select
                      isSearchable={false}
                      options={input.options}
                      {...field}
                    />
                  );
                }

                case 'time': {
                  return <Input type="datetime-local" {...field} />;
                }

                default: {
                  return <Input {...field} />;
                }
              }
            }}
          />
        </Label>
      ))}
      <Button
        className={twMerge('w-full', eventTypeInputs.length && 'mt-6')}
        colorScheme={event ? 'transparent' : 'accent'}
        loading={form.formState.isSubmitting}
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
