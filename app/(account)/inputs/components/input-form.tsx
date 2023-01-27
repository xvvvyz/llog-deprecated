'use client';

import { PlusIcon } from '@heroicons/react/24/outline';
import Button from 'components/button';
import Input from 'components/input';
import Label from 'components/label';
import Select from 'components/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Database } from 'types/database';
import supabase from 'utilities/browser-supabase-client';
import InputTypes from 'utilities/enum-input-types';
import forceArray from 'utilities/force-array';
import { GetInputData } from 'utilities/get-input';
import globalValueCache from 'utilities/global-value-cache';
import sleep from 'utilities/sleep';

const INPUT_TYPE_OPTIONS = [
  // { id: InputTypes.Duration, label: 'Duration' },
  { id: InputTypes.Select, label: 'Select' },
  { id: InputTypes.MultiSelect, label: 'Multi-select' },
  { id: InputTypes.Number, label: 'Number' },
  { id: InputTypes.Checkbox, label: 'Checkbox' },
  // { id: InputTypes.Time, label: 'Time' },
];

interface InputFormProps {
  input?: GetInputData;
}

type InputFormValues = Database['public']['Tables']['inputs']['Insert'] & {
  options: Database['public']['Tables']['input_options']['Insert'][];
  type: { id: Database['public']['Enums']['input_type'] };
};

const InputForm = ({ input }: InputFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const form = useForm<InputFormValues>({
    defaultValues: {
      id: input?.id,
      label: input?.label ?? '',
      options: forceArray(input?.options),
      type: INPUT_TYPE_OPTIONS.find(({ id }) => id === input?.type),
    },
  });

  const optionsArray = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const id = form.watch('id');
  const type = form.watch('type')?.id;

  useEffect(() => {
    if (
      optionsArray.fields.length > 0 ||
      (type !== InputTypes.Select && type !== InputTypes.MultiSelect)
    ) {
      return;
    }

    optionsArray.append({ input_id: id ?? '', label: '', order: 0 });
  }, [id, optionsArray, type]);

  return (
    <form
      onSubmit={form.handleSubmit(
        async ({ id, label, options, type: { id: type } }) => {
          const { data: inputData, error: inputError } = await supabase
            .from('inputs')
            .upsert({ id, label, type })
            .select('id, label')
            .single();

          if (inputError) {
            alert(inputError?.message);
            return;
          }

          form.setValue('id', inputData.id);

          if (type === InputTypes.Select || type === InputTypes.MultiSelect) {
            const { insertedOptions, updatedOptions } = options.reduce(
              (acc, option, order) => {
                const payload: Database['public']['Tables']['input_options']['Insert'] =
                  {
                    input_id: inputData.id,
                    label: option.label,
                    order,
                  };

                if (option.id) {
                  payload.id = option.id;
                  acc.updatedOptions.push(payload);
                } else {
                  acc.insertedOptions.push(payload);
                }

                return acc;
              },
              {
                insertedOptions:
                  [] as Database['public']['Tables']['input_options']['Insert'][],
                updatedOptions:
                  [] as Database['public']['Tables']['input_options']['Insert'][],
              }
            );

            if (updatedOptions.length) {
              const { error: inputOptionsError } = await supabase
                .from('input_options')
                .upsert(updatedOptions.sort((a, b) => b.order - a.order));

              if (inputOptionsError) {
                alert(inputOptionsError.message);
                return;
              }
            }

            if (insertedOptions.length) {
              const { error: inputOptionsError } = await supabase
                .from('input_options')
                .insert(insertedOptions);

              if (inputOptionsError) {
                alert(inputOptionsError.message);
                return;
              }
            }
          }

          if (globalValueCache.has('template_form_values')) {
            const cache = globalValueCache.get('template_form_values');
            cache.inputs.push(inputData);
            globalValueCache.set('template_form_values', cache);
          }

          await router.push(searchParams.get('back') ?? '/inputs');
          await router.refresh();
          await sleep();
        }
      )}
    >
      <Label>
        Label
        <Controller
          control={form.control}
          name="label"
          render={({ field }) => <Input {...field} />}
        />
      </Label>
      <Label className="mt-6">
        Type
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <Select
              isClearable={false}
              options={INPUT_TYPE_OPTIONS}
              {...field}
            />
          )}
        />
      </Label>
      {(type === InputTypes.Select || type === InputTypes.MultiSelect) && (
        <fieldset className="mt-6">
          <legend className="text-fg-2">Options</legend>
          <ul className="flex flex-col gap-3 pt-2">
            {optionsArray.fields.map((option, optionIndex) => (
              <li key={option.id}>
                <Controller
                  control={form.control}
                  name={`options.${optionIndex}.label`}
                  render={({ field }) => (
                    <Input placeholder="Label" {...field} />
                  )}
                />
              </li>
            ))}
          </ul>
          <Button
            className="mt-3 w-full"
            colorScheme="transparent"
            onClick={() =>
              optionsArray.append({
                input_id: id ?? '',
                label: '',
                order: optionsArray.fields.length,
              })
            }
            type="button"
          >
            <PlusIcon className="w-5" />
            Add option
          </Button>
        </fieldset>
      )}
      <Button
        className="mt-12 w-full"
        loading={form.formState.isSubmitting}
        loadingText="Saving…"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
};

export default InputForm;
