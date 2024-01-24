'use client';

import upsertEvent from '@/_actions/upsert-event';
import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import Input from '@/_components/input';
import RichTextarea from '@/_components/rich-textarea';
import Select, { IOption } from '@/_components/select';
import InputTypes from '@/_constants/enum-input-types';
import { GetEventData } from '@/_queries/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '@/_queries/get-event-type-with-inputs-and-options';
import { GetSessionWithDetailsData } from '@/_queries/get-session-with-details';
import DurationInputType from '@/_types/duration-input';
import { InputSettingsJson } from '@/_types/input-settings-json';
import MultiSelectInputType from '@/_types/multi-select-input-type';
import SelectInputType from '@/_types/select-input-type';
import forceArray from '@/_utilities/force-array';
import formatDatetimeLocal from '@/_utilities/format-datetime-local';
import parseSeconds from '@/_utilities/parse-seconds';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { Controller, useForm } from 'react-hook-form';
import { PropsValue } from 'react-select';
import EventSelect from './event-select';
import EventStopwatch from './event-stopwatch';

interface EventFormProps {
  disabled?: boolean;
  event?:
    | NonNullable<GetEventData>
    | NonNullable<GetSessionWithDetailsData>['modules'][0]['event'][0];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<GetSessionWithDetailsData>['modules'][0];
  isMission?: boolean;
  isPublic?: boolean;
  subjectId: string;
}

interface EventFormValues {
  comment?: string;
  completionTime: string;
  inputs: Array<
    | DurationInputType
    | MultiSelectInputType
    | SelectInputType
    | boolean
    | string
  >;
}

const EventForm = ({
  disabled,
  event,
  eventType,
  isMission,
  isPublic,
  subjectId,
}: EventFormProps) => {
  const eventInputs = forceArray(event?.inputs);

  const form = useForm<EventFormValues>({
    defaultValues: {
      completionTime: formatDatetimeLocal(event?.created_at ?? new Date()),
      inputs: eventType.inputs.map(({ input }) => {
        const inputInputs = eventInputs.filter(
          ({ input_id }) => input_id === input?.id,
        );

        switch (input?.type) {
          case InputTypes.Checkbox: {
            return Boolean(inputInputs[0]?.value ?? false);
          }

          case InputTypes.Duration: {
            if (!inputInputs[0]?.value) return [];

            const { hours, minutes, seconds } = parseSeconds(
              inputInputs[0].value as string,
            );

            return [
              { id: String(hours), label: `${Number(hours)}h` },
              { id: String(minutes), label: `${Number(minutes)}m` },
              { id: String(seconds), label: `${Number(seconds)}s` },
            ];
          }

          case InputTypes.Number:
          case InputTypes.Stopwatch: {
            return inputInputs[0]?.value ?? '';
          }

          case InputTypes.MultiSelect: {
            return inputInputs.map(({ input_option_id }) =>
              input.options.find(({ id }) => input_option_id === id),
            );
          }

          case InputTypes.Select: {
            return (
              input.options.find(
                ({ id }) => id === inputInputs[0]?.input_option_id,
              ) ?? null
            );
          }
        }
      }) as EventFormValues['inputs'],
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

  const [state, action] = useFormState(
    upsertEvent.bind(null, {
      eventId: event?.id,
      eventTypeId: eventType.id,
      eventTypeInputs: eventType.inputs,
      isMission: !!isMission,
      subjectId,
    }),
    null,
  );

  return (
    <form
      action={() => {
        const data = form.getValues();
        data.completionTime = new Date(data.completionTime).toISOString();
        return action(data);
      }}
      className="border-t border-alpha-1"
    >
      <div className="flex flex-col gap-6 px-4 py-8 sm:px-8">
        <Input
          id={`${eventType.id}-completionTime`}
          label={
            isMission ? 'When was this completed?' : 'When did this happen?'
          }
          max={formatDatetimeLocal(
            (() => {
              const today = new Date();
              const tomorrow = new Date(today);
              tomorrow.setDate(tomorrow.getDate() + 1);
              return tomorrow;
            })(),
          )}
          required
          step="any"
          type="datetime-local"
          {...form.register('completionTime')}
        />
        {eventType.inputs.map(({ input }, i) => {
          const id = `${eventType.id}-inputs-${i}`;

          return (
            <div key={id}>
              {input?.type === InputTypes.Checkbox && (
                <Checkbox
                  label={input.label}
                  {...form.register(`inputs.${i}`)}
                />
              )}
              {input?.type === InputTypes.Duration && (
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
                          onChange={(value) => field.onChange(value)}
                          options={Array.from({ length: 24 }, (_, i) => ({
                            id: String(i),
                            label: `${i}h`,
                          }))}
                          placeholder="Hours"
                          value={field.value as PropsValue<IOption>}
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
                          onChange={(value) => field.onChange(value)}
                          options={Array.from({ length: 60 }, (_, i) => ({
                            id: String(i),
                            label: `${i}m`,
                          }))}
                          placeholder="Minutes"
                          value={field.value as PropsValue<IOption>}
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
                          onChange={(value) => field.onChange(value)}
                          options={Array.from({ length: 60 }, (_, i) => ({
                            id: String(i),
                            label: `${i}s`,
                          }))}
                          placeholder="Seconds"
                          value={field.value as PropsValue<IOption>}
                        />
                      )}
                    />
                  </div>
                </fieldset>
              )}
              {input?.type === InputTypes.Number && (
                <Input
                  label={input.label}
                  max={(input.settings as InputSettingsJson)?.max}
                  min={(input.settings as InputSettingsJson)?.min}
                  step={(input.settings as InputSettingsJson)?.step}
                  type="number"
                  {...form.register(`inputs.${i}`)}
                />
              )}
              {(input?.type === InputTypes.MultiSelect ||
                input?.type === InputTypes.Select) && (
                <Controller
                  control={form.control}
                  name={`inputs.${i}`}
                  render={({ field }) => (
                    <EventSelect field={field} input={input} />
                  )}
                />
              )}
              {input?.type === InputTypes.Stopwatch && (
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
      </div>
      {state?.error && (
        <div className="px-4 py-8 text-center sm:px-8">{state.error}</div>
      )}
      {!isPublic && (
        <div className="flex gap-4 border-t border-alpha-1 px-4 py-8 sm:px-8">
          {!event && !isMission && (
            <Button
              className="w-full"
              colorScheme="transparent"
              href={`/${isPublic ? 'share' : 'subjects'}/${subjectId}`}
              scroll={false}
            >
              Close
            </Button>
          )}
          <Button
            className="w-full"
            colorScheme={event ? 'transparent' : 'accent'}
            disabled={disabled}
            loadingText="Saving…"
            type="submit"
          >
            {event ? 'Save' : isMission ? 'Complete' : 'Record'}
          </Button>
        </div>
      )}
    </form>
  );
};

export type { EventFormValues };
export default EventForm;
