'use client';

import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import EventSelect from '@/_components/event-select';
import EventStopwatch from '@/_components/event-stopwatch';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import * as Modal from '@/_components/modal';
import RichTextarea from '@/_components/rich-textarea';
import Select, { IOption } from '@/_components/select-v1';
import InputType from '@/_constants/enum-input-type';
import upsertEvent from '@/_mutations/upsert-event';
import { GetEventData } from '@/_queries/get-event';
import { GetEventTypeWithInputsAndOptionsData } from '@/_queries/get-event-type-with-inputs-and-options';
import { GetSessionWithDetailsData } from '@/_queries/get-session-with-details';
import DurationInputType from '@/_types/duration-input';
import { InputSettingsJson } from '@/_types/input-settings-json';
import forceArray from '@/_utilities/force-array';
import formatDatetimeLocal from '@/_utilities/format-datetime-local';
import parseSeconds from '@/_utilities/parse-seconds';
import { useRouter } from 'next/navigation';
import { useEffect, useRef, useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { PropsValue } from 'react-select';
import { twMerge } from 'tailwind-merge';

interface EventFormProps {
  className?: string;
  event?:
    | NonNullable<GetEventData>
    | NonNullable<GetSessionWithDetailsData>['modules'][0]['event'][0];
  eventType:
    | NonNullable<NonNullable<GetEventData>['type']>
    | NonNullable<GetEventTypeWithInputsAndOptionsData>
    | NonNullable<GetSessionWithDetailsData>['modules'][0];
  isArchived?: boolean;
  isProtocol?: boolean;
  isPreviousModulePending?: boolean;
  isPublic?: boolean;
  subjectId: string;
}

export interface EventFormValues {
  comment: string;
  completionTime: string;
  inputs: Array<DurationInputType | string[] | string | boolean>;
}

const EventForm = ({
  className,
  event,
  eventType,
  isArchived,
  isProtocol,
  isPreviousModulePending,
  isPublic,
  subjectId,
}: EventFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const eventInputs = forceArray(event?.inputs);

  const form = useForm<EventFormValues>({
    defaultValues: {
      comment: '',
      completionTime: formatDatetimeLocal(event?.created_at ?? new Date()),
      inputs: eventType.inputs.map(({ input }) => {
        const inputInputs = eventInputs.filter(
          ({ input_id }) => input_id === input?.id,
        );

        switch (input?.type) {
          case InputType.Checkbox: {
            return Boolean(inputInputs[0]?.value ?? false);
          }

          case InputType.Duration: {
            if (!inputInputs[0]?.value) return [null, null, null];

            const { hours, minutes, seconds } = parseSeconds(
              inputInputs[0].value as string,
            );

            return [
              { id: String(hours), label: `${Number(hours)}h` },
              { id: String(minutes), label: `${Number(minutes)}m` },
              { id: String(seconds), label: `${Number(seconds)}s` },
            ];
          }

          case InputType.Number:
          case InputType.Stopwatch: {
            return inputInputs[0]?.value ?? '';
          }

          case InputType.MultiSelect: {
            return inputInputs.map(({ input_option_id }) => input_option_id);
          }

          case InputType.Select: {
            return inputInputs[0]?.input_option_id ?? null;
          }
        }
      }) as EventFormValues['inputs'],
    },
  });

  const pendingComment = useRef('');
  const router = useRouter();

  useEffect(() => {
    if (!isProtocol || event) return;

    const interval: NodeJS.Timeout = setInterval(() => {
      if (form.formState.dirtyFields.completionTime) {
        clearInterval(interval);
        return;
      }

      form.setValue('completionTime', formatDatetimeLocal(new Date()));
    }, 1000);

    return () => clearInterval(interval);
  }, [event, form, isProtocol]);

  return (
    <form
      action={() => {}}
      className={twMerge('flex flex-col gap-8 px-4 sm:px-8', className)}
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          pendingComment.current = values.comment;
          form.setValue('comment', '');
          values.completionTime = new Date(values.completionTime).toISOString();

          const res = await upsertEvent(
            {
              eventId: event?.id,
              eventTypeId: eventType.id,
              eventTypeInputs: eventType.inputs,
              isProtocol: !!isProtocol,
              subjectId,
            },
            values,
          );

          if (res?.error) {
            form.setValue('comment', pendingComment.current);
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          if (isProtocol) router.refresh();
          else if (!event) router.back();
        }),
      )}
    >
      <InputRoot>
        <Label.Root htmlFor={`${eventType.id}-completion-time`}>
          {isProtocol ? 'Completion time' : 'Event time'}
        </Label.Root>
        <Input
          id={`${eventType.id}-completion-time`}
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
      </InputRoot>
      {eventType.inputs.map(({ input }, i) => {
        const id = `${eventType.id}-inputs-${i}`;

        return (
          <div key={id}>
            {input?.type === InputType.Checkbox && (
              <InputRoot>
                <Label.Root htmlFor={`inputs.${i}`}>{input.label}</Label.Root>
                <Checkbox {...form.register(`inputs.${i}`)} />
              </InputRoot>
            )}
            {input?.type === InputType.Duration && (
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
            {input?.type === InputType.Number && (
              <InputRoot>
                <Label.Root htmlFor={`inputs.${i}`}>{input.label}</Label.Root>
                <Input
                  max={(input.settings as InputSettingsJson)?.max}
                  min={(input.settings as InputSettingsJson)?.min}
                  step={(input.settings as InputSettingsJson)?.step}
                  type="number"
                  {...form.register(`inputs.${i}`)}
                />
              </InputRoot>
            )}
            {(input?.type === InputType.MultiSelect ||
              input?.type === InputType.Select) && (
              <Controller
                control={form.control}
                name={`inputs.${i}`}
                render={({ field }) => (
                  <EventSelect field={field} input={input} />
                )}
              />
            )}
            {input?.type === InputType.Stopwatch && (
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
        <InputRoot>
          <Label.Root htmlFor={`${eventType.id}-comment`}>Comment</Label.Root>
          <Controller
            control={form.control}
            name="comment"
            render={({ field }) => (
              <RichTextarea id={`${eventType.id}-comment`} {...field} />
            )}
          />
        </InputRoot>
      )}
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      {!isPublic && !isArchived && (!event || form.formState.isDirty) && (
        <div className="flex gap-4 pt-8">
          {!event && !isProtocol && (
            <Modal.Close asChild>
              <Button className="w-full" colorScheme="transparent">
                Close
              </Button>
            </Modal.Close>
          )}
          {(!event || form.formState.isDirty) && (
            <Button
              className="w-full"
              colorScheme={
                isPreviousModulePending || event ? 'transparent' : 'accent'
              }
              disabled={isPreviousModulePending}
              loading={isTransitioning}
              loadingText="Saving…"
              type="submit"
            >
              {isPreviousModulePending
                ? 'Previous module incomplete'
                : event
                  ? 'Save'
                  : isProtocol
                    ? 'Complete'
                    : 'Record'}
            </Button>
          )}
        </div>
      )}
    </form>
  );
};

export default EventForm;
