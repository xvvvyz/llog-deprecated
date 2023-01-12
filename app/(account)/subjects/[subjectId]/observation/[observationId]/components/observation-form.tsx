'use client';

import Button from 'components/button';
import Checkbox from 'components/checkbox';
import Input from 'components/input';
import Label from 'components/label';
import Select from 'components/select';
import { useRouter } from 'next/navigation';
import { Controller, useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
import supabase from 'utilities/browser-supabase-client';
import forceArray from 'utilities/force-array';
import formatTimeForInput from 'utilities/format-time-for-input';
import { GetObservationData } from 'utilities/get-observation';
import sleep from 'utilities/sleep';

interface ObservationFormProps {
  observation: GetObservationData;
  subjectId: string;
}

interface ObservationFormValues {
  inputs: any[]; // 😱
}

const INPUT_DEFAULTS_MAP = {
  checkbox: false,
  duration: '0',
  multi_select: [],
  number: '0',
  select: null,
  time: formatTimeForInput(new Date()),
};

const ObservationForm = ({ observation, subjectId }: ObservationFormProps) => {
  const router = useRouter();
  const observationInputs = forceArray(observation?.inputs);

  const form = useForm<ObservationFormValues>({
    defaultValues: {
      inputs: observationInputs.map(
        ({ input }) =>
          INPUT_DEFAULTS_MAP[input.type.id as keyof typeof INPUT_DEFAULTS_MAP]
      ),
    },
  });

  if (!observation) return null;

  return (
    <form
      onSubmit={form.handleSubmit(async ({ inputs }) => {
        const { data: eventData, error: eventError } = await supabase
          .from('events')
          .insert({ observation_id: observation.id, subject_id: subjectId })
          .select('id')
          .single();

        if (eventError) {
          alert(eventError.message);
          return;
        }

        const eventInputItems = inputs.reduce((acc, input, i) => {
          if (input === '' || input === null) return acc;
          const observationInput = observationInputs[i].input;

          const payload = {
            event_id: eventData.id,
            input_id: observationInput.id,
            input_option_id: null,
            value: null as string | null | boolean,
          };

          switch (observationInput.type.id) {
            case 'checkbox': {
              payload.value = String(input);
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
              payload.value = input;
              acc.push(payload);
              return acc;
            }
          }
        }, []);

        const { error: eventInputsError } = await supabase
          .from('event_inputs')
          .insert(eventInputItems);

        if (eventInputsError) {
          alert(eventInputsError.message);
          return;
        }

        await router.push(`/subjects/${subjectId}`);
        await router.refresh();
        await sleep();
      })}
    >
      <fieldset className="flex flex-col gap-6">
        {observationInputs.map(({ input }, i) => (
          <Label
            className={
              input.type.id === 'checkbox'
                ? 'flex-row-reverse items-start justify-end gap-4 text-fg-1'
                : ''
            }
            key={input.id}
          >
            {input.label}
            <Controller
              control={form.control}
              name={`inputs.${i}`}
              render={({ field }) => {
                switch (input.type.id) {
                  case 'checkbox': {
                    return <Checkbox {...field} />;
                  }

                  case 'duration': {
                    return <Input className="" type="number" {...field} />;
                  }

                  case 'multi_select': {
                    return (
                      <Select isMulti options={input.options} {...field} />
                    );
                  }

                  case 'number': {
                    return <Input type="number" {...field} />;
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
      </fieldset>
      <Button
        className={twMerge('w-full', observationInputs.length && 'mt-12')}
        loading={form.formState.isSubmitting}
        loadingText="Saving…"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
};

export type { ObservationFormValues };
export default ObservationForm;
