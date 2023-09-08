'use client';

import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import NumberInput from '@/_components/input-number';
import Select from '@/_components/select';
import INPUT_LABELS from '@/_constants/constant-input-labels';
import CacheKeys from '@/_constants/enum-cache-keys';
import InputTypes from '@/_constants/enum-input-types';
import useDefaultValues from '@/_hooks/use-default-values';
import useSubmitRedirect from '@/_hooks/use-submit-redirect';
import useSupabase from '@/_hooks/use-supabase';
import useUpdateGlobalValueCache from '@/_hooks/use-update-global-value-cache';
import { GetInputData } from '@/_server/get-input';
import { ListSubjectsByTeamIdData } from '@/_server/list-subjects-by-team-id';
import { Database } from '@/_types/database';
import { InputType } from '@/_types/input';
import forceArray from '@/_utilities/force-array';
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

const INPUT_TYPE_OPTIONS = [
  { id: InputTypes.Select, label: INPUT_LABELS[InputTypes.Select] },
  { id: InputTypes.MultiSelect, label: INPUT_LABELS[InputTypes.MultiSelect] },
  { id: InputTypes.Number, label: INPUT_LABELS[InputTypes.Number] },
  { id: InputTypes.Duration, label: INPUT_LABELS[InputTypes.Duration] },
  { id: InputTypes.Checkbox, label: INPUT_LABELS[InputTypes.Checkbox] },
  { id: InputTypes.Stopwatch, label: INPUT_LABELS[InputTypes.Stopwatch] },
];

interface InputFormProps {
  duplicateInputData?: GetInputData;
  input?: GetInputData;
  subjects?: ListSubjectsByTeamIdData;
}

type InputFormValues = InputType & {
  options: Database['public']['Tables']['input_options']['Insert'][];
  subjects: { id: string; image_uri: string; name: string }[];
  type: { id: Database['public']['Enums']['input_type'] };
};

const InputForm = ({ input, duplicateInputData, subjects }: InputFormProps) => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const initialInput = input ?? duplicateInputData;
  const supabase = useSupabase();
  const updateGlobalValueCache = useUpdateGlobalValueCache();

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.InputForm,
    defaultValues: {
      id: duplicateInputData ? undefined : input?.id,
      label: initialInput?.label ?? '',
      options: forceArray(initialInput?.options),
      settings: initialInput?.settings,
      subjects: forceArray(subjects).filter(({ id }) =>
        forceArray(initialInput?.subjects_for).some(
          ({ subject_id }) => subject_id === id,
        ),
      ),
      type: INPUT_TYPE_OPTIONS.find(({ id }) => id === initialInput?.type),
    },
  });

  const form = useForm<InputFormValues>({ defaultValues });

  const optionsArray = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const id = form.watch('id');
  const maxFractionDigits = form.watch('settings.maxFractionDigits');
  const minFractionDigits = form.watch('settings.minFractionDigits');
  const type = form.watch('type')?.id;

  const hasOptions =
    type === InputTypes.Select || type === InputTypes.MultiSelect;

  return (
    <form
      className="form"
      onSubmit={form.handleSubmit(
        async ({
          id,
          label,
          options,
          settings,
          subjects,
          type: typeObject,
        }) => {
          const type = typeObject?.id;

          const { data: inputData, error: inputError } = await supabase
            .from('inputs')
            .upsert({ id, label: label.trim(), settings, type })
            .select('id, label')
            .single();

          if (inputError) {
            alert(inputError?.message);
            return;
          }

          form.setValue('id', inputData.id);

          if (hasOptions) {
            const { insertedOptions, updatedOptions } = options.reduce(
              (acc, option, order) => {
                const payload: InputFormValues['options'][0] = {
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
                insertedOptions: [] as InputFormValues['options'],
                updatedOptions: [] as InputFormValues['options'],
              },
            );

            const deletedOptionIds = forceArray(input?.options).reduce(
              (acc, option) => {
                if (!updatedOptions.some(({ id }) => id === option.id)) {
                  acc.push(option.id);
                }

                return acc;
              },
              [],
            );

            if (deletedOptionIds.length) {
              const { error: deletedOptionsError } = await supabase
                .from('input_options')
                .delete()
                .in('id', deletedOptionIds);

              if (deletedOptionsError) {
                alert(deletedOptionsError.message);
                return;
              }
            }

            if (updatedOptions.length) {
              const { error: inputOptionsError } = await supabase
                .from('input_options')
                .upsert(updatedOptions);

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

          if (defaultValues.subjects.length) {
            await supabase
              .from('input_subjects')
              .delete()
              .eq('input_id', inputData.id);
          }

          if (subjects.length) {
            const { error: inputSubjectsError } = await supabase
              .from('input_subjects')
              .insert(
                subjects.map(({ id }) => ({
                  input_id: inputData.id,
                  subject_id: id,
                })),
              );

            if (inputSubjectsError) {
              alert(inputSubjectsError.message);
              return;
            }
          }

          updateGlobalValueCache({ ...inputData, subjects });
          await redirect('/inputs');
        },
      )}
    >
      <Input label="Label" required {...form.register('label')} />
      <Controller
        control={form.control}
        name="subjects"
        render={({ field }) => (
          <Select
            hasAvatar
            isMulti
            label="For"
            name={field.name}
            noOptionsMessage={() => 'No subjects'}
            onBlur={field.onBlur}
            onChange={(value) => field.onChange(value as any)}
            options={forceArray(subjects)}
            placeholder="All subjects…"
            tooltip={
              <>
                If this input isn&rsquo;t applicable to all of your subjects,
                you can specify the relevant subjects here.
              </>
            }
            value={field.value as any}
          />
        )}
      />
      <Controller
        control={form.control}
        name="type"
        render={({ field }) => (
          <Select
            isClearable={false}
            isSearchable={false}
            label="Type"
            name={field.name}
            onBlur={field.onBlur}
            onChange={(option) => {
              field.onChange(option as any);
              form.setValue('settings', null);

              switch ((option as InputFormValues['options'][0])?.id) {
                case InputTypes.Number: {
                  form.setValue('settings', {
                    max: '100',
                    maxFractionDigits: '0',
                    min: '0',
                    minFractionDigits: '0',
                  });

                  return;
                }

                case InputTypes.MultiSelect:
                case InputTypes.Select: {
                  form.setValue('settings', {
                    isCreatable: false,
                  });

                  return;
                }

                default: {
                  // noop
                }
              }
            }}
            options={INPUT_TYPE_OPTIONS}
            placeholder="Select type…"
            value={field.value as any}
          />
        )}
      />
      {hasOptions && (
        <>
          <fieldset className="group">
            <span className="label">Options</span>
            <div className="space-y-2">
              {!!optionsArray.fields.length && (
                <ul className="flex flex-col gap-2">
                  {optionsArray.fields.map((option, optionIndex) => (
                    <li key={option.id}>
                      <Controller
                        control={form.control}
                        name={`options.${optionIndex}.label`}
                        render={({ field }) => (
                          <Input
                            onKeyDown={(e) => {
                              if (e.key === 'Backspace' && !field.value) {
                                e.preventDefault();
                                optionsArray.remove(optionIndex);

                                form.setFocus(
                                  `options.${optionIndex - 1}.label`,
                                  {
                                    shouldSelect: true,
                                  },
                                );
                              }

                              if (e.key === 'Enter') {
                                e.preventDefault();

                                optionsArray.insert(optionIndex + 1, {
                                  input_id: id ?? '',
                                  label: '',
                                  order: optionIndex + 1,
                                });
                              }
                            }}
                            placeholder="Label…"
                            right={
                              <IconButton
                                className="m-0 h-full w-full justify-center p-0"
                                icon={<XMarkIcon className="w-5" />}
                                label="Delete option"
                                onClick={() => optionsArray.remove(optionIndex)}
                                tabIndex={-1}
                              />
                            }
                            {...field}
                          />
                        )}
                      />
                    </li>
                  ))}
                </ul>
              )}
              <Button
                className="w-full"
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
            </div>
          </fieldset>
          <Checkbox
            className="mt-2"
            label="Allow options to be created"
            tooltip={
              <>
                Enable this when you don&rsquo;t know all possible options in
                advance.
              </>
            }
            {...form.register('settings.isCreatable')}
          />
        </>
      )}
      {type === InputTypes.Number && (
        <>
          <fieldset className="flex gap-6">
            <NumberInput
              forceValue
              id="settings-min-fraction-digits"
              label="Min fraction digits"
              max={maxFractionDigits}
              min={0}
              {...form.register('settings.minFractionDigits')}
            />
            <NumberInput
              forceValue
              id="settings-max-fraction-digits"
              label="Max fraction digits"
              max={6}
              min={minFractionDigits ?? 0}
              {...form.register('settings.maxFractionDigits')}
            />
          </fieldset>
          <fieldset className="flex gap-6">
            <NumberInput
              forceValue
              id="settings-min"
              label="Min value"
              max={form.watch('settings.max')}
              maxFractionDigits={maxFractionDigits}
              minFractionDigits={minFractionDigits}
              {...form.register('settings.min')}
            />
            <NumberInput
              forceValue
              id="settings-max"
              label="Max value"
              maxFractionDigits={maxFractionDigits}
              min={form.watch('settings.min')}
              minFractionDigits={minFractionDigits}
              {...form.register('settings.max')}
            />
          </fieldset>
        </>
      )}
      <Button
        className="mt-8 w-full"
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        Save input
      </Button>
    </form>
  );
};

export default InputForm;
