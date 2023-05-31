'use client';

import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import Select from '@/_components/select';
import useStopwatch from '@/_hooks/use-stopwatch';
import useSupabase from '@/_hooks/use-supabase';
import { Database } from '@/_types/database';
import { InputType } from '@/_types/input';
import parseSeconds from '@/_utilities/parse-seconds';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useTransition } from 'react';
import { twMerge } from 'tailwind-merge';
import { useBoolean } from 'usehooks-ts';

import {
  FieldArray,
  FieldValues,
  PathValue,
  UseFormReturn,
  useFieldArray,
} from 'react-hook-form';

import {
  ArrowUturnLeftIcon,
  PauseIcon,
  PlayIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';

interface EventStopwatchProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  input: InputType & {
    options: Array<
      Pick<Database['public']['Tables']['input_options']['Row'], 'id' | 'label'>
    >;
    settings?: {
      isCreatable?: boolean;
    };
  };
  inputIndex: number;
}

const EventStopwatch = <T extends FieldValues>({
  form,
  input,
  inputIndex,
}: EventStopwatchProps<T>) => {
  const [isTransitioning, startTransition] = useTransition();
  const name = `inputs.${inputIndex}`;
  const router = useRouter();
  const supabase = useSupabase();

  const initialTIme = useMemo(
    () => form.getValues(`${name}.time` as T[string]),
    [form, name]
  );

  const stopwatch = useStopwatch(initialTIme);
  const { value: isCreating, toggle: toggleIsCreating } = useBoolean();

  const timedNoteArray = useFieldArray({
    control: form.control,
    name: `${name}.notes` as T[string],
  });

  useEffect(() => {
    form.setValue(
      `${name}.time` as T[string],
      stopwatch.debouncedTime as PathValue<T, T[string]>
    );
  }, [form, name, stopwatch.debouncedTime]);

  const typeToCreate = input.settings?.isCreatable ? '. Type to create' : '';

  return (
    <fieldset>
      <legend className="label">{input.label}</legend>
      <div className="flex gap-2">
        <Button
          className="w-full justify-between"
          colorScheme="transparent"
          onClick={stopwatch.toggle}
        >
          <div className="font-mono text-fg-1" role="timer">
            {stopwatch.hasHours && `${stopwatch.hours}:`}
            {stopwatch.hasMinutes && `${stopwatch.minutes}:`}
            {stopwatch.seconds}
            <span className="text-fg-3">.{stopwatch.fraction}</span>
          </div>
          {stopwatch.isRunning ? (
            <PauseIcon className="w-5" />
          ) : (
            <PlayIcon className="w-5" />
          )}
        </Button>
        <IconButton
          colorScheme="transparent"
          disabled={stopwatch.isRunning || !stopwatch.hasTime}
          icon={<ArrowUturnLeftIcon className="w-5" />}
          onClick={() => {
            stopwatch.reset();
            timedNoteArray.remove();
          }}
          variant="primary"
        />
      </div>
      {(!!input.options.length || input.settings?.isCreatable) && (
        <>
          <Select
            className={twMerge(
              'mt-2',
              !!timedNoteArray.fields.length && 'rounded-b-none'
            )}
            instanceId={`inputs-${inputIndex}-select`}
            isCreatable={input.settings?.isCreatable}
            isDisabled={!stopwatch.isRunning}
            isLoading={isCreating || isTransitioning}
            onChange={(e) => {
              if (!e) return;

              timedNoteArray.prepend({
                ...e,
                time: stopwatch.time,
              } as FieldArray<T, T[string]>);
            }}
            onCreateOption={async (value: string) => {
              const label = value.trim();
              if (!label) return;
              toggleIsCreating();
              const time = stopwatch.time;

              const { data, error } = await supabase
                .from('input_options')
                .insert({
                  input_id: input.id,
                  label,
                  order: input.options.length,
                })
                .select('id, label')
                .single();

              if (error) {
                alert(error.message);
                toggleIsCreating();
                return;
              }

              timedNoteArray.prepend({ ...data, time } as FieldArray<
                T,
                T[string]
              >);
              startTransition(router.refresh);
              toggleIsCreating();
            }}
            options={input.options}
            placeholder={`Add timed note${typeToCreate}…`}
            value={null}
          />
          {!!timedNoteArray.fields.length && (
            <ul className="divide-y divide-alpha-1 rounded-b border border-t-0 border-alpha-1 bg-alpha-1">
              {timedNoteArray.fields.map((note, noteIndex) => {
                const t = parseSeconds(
                  form.getValues(`${name}.notes.${noteIndex}.time` as T[string])
                );

                return (
                  <li
                    className="relative flex items-baseline gap-4 pb-1.5 pl-4 pr-2 pt-1 leading-snug"
                    key={note.id}
                  >
                    <div className="font-mono">
                      {t.hasHours && `${t.hours}:`}
                      {t.hasMinutes && `${t.minutes}:`}
                      {t.seconds}
                      <span className="text-fg-3">.{t.fraction}</span>
                    </div>
                    <div className="text-fg-3">
                      {form.getValues(
                        `${name}.notes.${noteIndex}.label` as T[string]
                      )}
                    </div>
                    <IconButton
                      className="relative top-1 ml-auto"
                      icon={<XMarkIcon className="w-5" />}
                      onClick={() => timedNoteArray.remove(noteIndex)}
                    />
                  </li>
                );
              })}
            </ul>
          )}
        </>
      )}
    </fieldset>
  );
};

export default EventStopwatch;
