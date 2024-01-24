'use client';

import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import useStopwatch from '@/_hooks/use-stopwatch';
import { Database } from '@/_types/database';
import ArrowUturnLeftIcon from '@heroicons/react/24/outline/ArrowUturnLeftIcon';
import PauseIcon from '@heroicons/react/24/outline/PauseIcon';
import PlayIcon from '@heroicons/react/24/outline/PlayIcon';
import { useThrottle } from '@uidotdev/usehooks';
import { useEffect } from 'react';
import { FieldValues, PathValue, UseFormReturn } from 'react-hook-form';

interface EventStopwatchProps<T extends FieldValues> {
  form: UseFormReturn<T>;
  input: Pick<Database['public']['Tables']['inputs']['Row'], 'label'>;
  inputIndex: number;
}

const EventStopwatch = <T extends FieldValues>({
  form,
  input,
  inputIndex,
}: EventStopwatchProps<T>) => {
  const name = `inputs.${inputIndex}`;
  const stopwatch = useStopwatch(form.getValues(name as T[string]));
  const throttledTime = useThrottle(stopwatch.time, 1000);

  useEffect(() => {
    form.setValue(
      name as T[string],
      String(throttledTime) as PathValue<T, T[string]>,
      { shouldDirty: true },
    );
  }, [form, name, throttledTime]);

  return (
    <fieldset>
      <legend className="label">{input.label}</legend>
      <div className="flex gap-2">
        <Button
          className="w-full justify-between"
          colorScheme="transparent"
          onClick={() => stopwatch.toggle()}
        >
          <div className="font-mono text-fg-2" role="timer">
            {stopwatch.hasHours && `${stopwatch.hours}:`}
            {stopwatch.hasMinutes && `${stopwatch.minutes}:`}
            {stopwatch.seconds}
            <span className="text-fg-4">.{stopwatch.fraction}</span>
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
          onClick={stopwatch.reset}
          variant="primary"
        />
      </div>
    </fieldset>
  );
};

export default EventStopwatch;
