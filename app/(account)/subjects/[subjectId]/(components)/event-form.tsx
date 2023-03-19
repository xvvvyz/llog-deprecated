'use client';

import Button from '(components)/button';
import Checkbox from '(components)/checkbox';
import Input from '(components)/input';
import NumberInput from '(components)/input-number';
import { Database } from '(types)/database';
import supabase from '(utilities)/browser-supabase-client';
import forceArray from '(utilities)/force-array';
import { GetEventData } from '(utilities)/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '(utilities)/get-event-type-with-inputs-and-options';
import { ListSessionRoutinesData } from '(utilities)/list-session-routines';
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
      {eventTypeInputs.map(({ input }, i) => (
        <Controller
          control={form.control}
          key={input.id}
          name={`inputs.${i}`}
          render={({ field }) => {
            const id = `${eventType.id}-inputs-${i}`;

            switch (input.type) {
              case 'checkbox': {
                return <Checkbox label={input.label} {...field} />;
              }

              case 'duration': {
                return <NumberInput id={id} label={input.label} {...field} />;
              }

              case 'multi_select':
              case 'select': {
                return <EventSelect field={field} input={input} />;
              }

              case 'number': {
                return (
                  <NumberInput
                    id={id}
                    label={input.label}
                    {...input.settings}
                    {...field}
                  />
                );
              }

              default: {
                return <Input label={input.label} {...field} />;
              }
            }
          }}
        />
      ))}
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
