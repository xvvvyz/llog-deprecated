'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import Label, { LabelSpan } from '(components)/label';
import Select from '(components)/select';
import { Database } from '(types)/database';
import supabase from '(utilities)/browser-supabase-client';
import INPUT_LABELS from '(utilities)/constant-input-labels';
import CacheKeys from '(utilities)/enum-cache-keys';
import InputTypes from '(utilities)/enum-input-types';
import forceArray from '(utilities)/force-array';
import useDefaultValues from '(utilities)/get-default-values';
import { GetInputData } from '(utilities)/get-input';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import useUpdateGlobalValueCache from '(utilities)/use-update-global-value-cache';
import { PlusIcon } from '@heroicons/react/24/outline';
import { useEffect } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

const INPUT_TYPE_OPTIONS = [
  // { id: InputTypes.Duration, label: INPUT_LABELS[InputTypes.Duration] },
  { id: InputTypes.Select, label: INPUT_LABELS[InputTypes.Select] },
  { id: InputTypes.MultiSelect, label: INPUT_LABELS[InputTypes.MultiSelect] },
  { id: InputTypes.Number, label: INPUT_LABELS[InputTypes.Number] },
  { id: InputTypes.Checkbox, label: INPUT_LABELS[InputTypes.Checkbox] },
];

interface InputFormProps {
  input?: GetInputData;
}

type InputFormValues = Database['public']['Tables']['inputs']['Insert'] & {
  options: Database['public']['Tables']['input_options']['Insert'][];
  type: { id: Database['public']['Enums']['input_type'] };
};

const InputForm = ({ input }: InputFormProps) => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const updateGlobalValueCache = useUpdateGlobalValueCache();

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.InputForm,
    defaultValues: {
      id: input?.id,
      label: input?.label ?? '',
      options: forceArray(input?.options),
      type: INPUT_TYPE_OPTIONS.find(({ id }) => id === input?.type),
    },
  });

  const form = useForm<InputFormValues>({ defaultValues });

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
        async ({ id, label, options, type: typeObject }) => {
          const type = typeObject?.id;

          const { data: inputData, error: inputError } = await supabase
            .from('inputs')
            .upsert({ id, label: label.trim(), type })
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
                    label: option.label.trim(),
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

          updateGlobalValueCache(inputData);
          await redirect('/inputs');
        }
      )}
    >
      <Label>
        <LabelSpan>Label</LabelSpan>
        <Controller
          control={form.control}
          name="label"
          render={({ field }) => <Input {...field} />}
        />
      </Label>
      <Label className="mt-6">
        <LabelSpan>Type</LabelSpan>
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <Select
              isClearable={false}
              isSearchable={false}
              options={INPUT_TYPE_OPTIONS}
              {...field}
            />
          )}
        />
      </Label>
      {(type === InputTypes.Select || type === InputTypes.MultiSelect) && (
        <fieldset className="mt-6">
          <LabelSpan as="legend">Options</LabelSpan>
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
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
};

export default InputForm;
