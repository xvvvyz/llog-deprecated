'use client';

import Button from 'components/button';
import Checkbox from 'components/checkbox';
import Input from 'components/input';
import Label from 'components/label';
import Select from 'components/select';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import { Database } from 'types/database';
import supabase from 'utilities/browser-supabase-client';
import forceArray from 'utilities/force-array';
import formatTimeForInput from 'utilities/format-time-for-input';
import { GetEventData } from 'utilities/get-event';
import { GetEventTypeData } from 'utilities/get-event-type';
import { ListSessionRoutinesData } from 'utilities/list-session-routines';
import sleep from 'utilities/sleep';

interface EventFormProps {
  event?: GetEventData;
  eventType:
    | NonNullable<GetEventTypeData>
    | NonNullable<ListSessionRoutinesData>[0];
  subjectId: string;
}

interface EventFormValues {
  id?: string;
  inputs: any[]; // 😱
}

const EventForm = ({ event, eventType, subjectId }: EventFormProps) => {
  const eventInputs = forceArray(event?.inputs);
  const eventTypeInputs = forceArray(eventType?.inputs);
  const router = useRouter();

  const form = useForm<EventFormValues>({
    defaultValues: {
      id: event?.id,
      inputs: eventTypeInputs.map(({ input }) => {
        const eventInput = eventInputs.find(
          (eventInput) => eventInput.input_id === input.id
        );

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
                id === eventInput?.input_option_id
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
      className="mt-12 flex flex-col gap-6"
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

        const eventInputItems = inputs.reduce((acc, input, i) => {
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
              acc.push(payload);
              return acc;
            }

            case 'multi_select': {
              return acc.concat(
                input.map(({ id }: { id: string }) => ({
                  ...payload,
                  input_option_id: id,
                }))
              );
            }

            case 'select': {
              payload.input_option_id = input.id;
              acc.push(payload);
              return acc;
            }

            case 'time': {
              payload.value = new Date(input).toISOString();
              acc.push(payload);
              return acc;
            }

            default: {
              return acc;
            }
          }
        }, []);

        const { error: eventInputsError } = await supabase
          .from('event_inputs')
          .upsert(eventInputItems);

        if (eventInputsError) {
          alert(eventInputsError.message);
          return;
        }

        await router.push(`/subjects/${subjectId}`);
        await router.refresh();
        await sleep();
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
                  return <Select isMulti options={input.options} {...field} />;
                }

                case 'number': {
                  return <Input min={0} type="number" {...field} />;
                }

                case 'select': {
                  return <Select options={input.options} {...field} />;
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
        Save
      </Button>
    </form>
  );
};

export type { EventFormValues };
export default EventForm;
