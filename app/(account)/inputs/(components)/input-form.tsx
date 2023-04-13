'use client';

import Button from '(components)/button';
import Checkbox from '(components)/checkbox';
import IconButton from '(components)/icon-button';
import Input from '(components)/input';
import NumberInput from '(components)/input-number';
import Select from '(components)/select';
import { Database } from '(types)/database';
import { InputType } from '(types)/input';
import supabase from '(utilities)/browser-supabase-client';
import INPUT_LABELS from '(utilities)/constant-input-labels';
import CacheKeys from '(utilities)/enum-cache-keys';
import InputTypes from '(utilities)/enum-input-types';
import forceArray from '(utilities)/force-array';
import useDefaultValues from '(utilities)/get-default-values';
import { GetInputData } from '(utilities)/get-input';
import { GetInputWithoutIdsData } from '(utilities)/get-input-without-ids';
import { ListSubjectsByTeamIdData } from '(utilities)/list-subjects-by-team-id';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import useUpdateGlobalValueCache from '(utilities)/use-update-global-value-cache';
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
  duplicateInputData?: GetInputWithoutIdsData;
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
  const updateGlobalValueCache = useUpdateGlobalValueCache();

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.InputForm,
    defaultValues: {
      id: input?.id,
      label: initialInput?.label ?? '',
      options: forceArray(initialInput?.options),
      settings: initialInput?.settings,
      subjects: forceArray(subjects).filter(({ id }) =>
        forceArray(initialInput?.subjects_for).some(
          ({ subject_id }) => subject_id === id
        )
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
    type === InputTypes.Select ||
    type === InputTypes.MultiSelect ||
    type === InputTypes.Stopwatch;

  return (
    <form
      className="flex flex-col gap-6 sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8"
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

            const deletedOptionIds = forceArray(input?.options).reduce(
              (acc, option) => {
                if (!updatedOptions.some(({ id }) => id === option.id)) {
                  acc.push(option.id);
                }

                return acc;
              },
              []
            );

            if (deletedOptionIds.length) {
              const { error: deletedOptionsError } = await supabase
                .from('input_options')
                .update({ deleted: true })
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
                }))
              );

            if (inputSubjectsError) {
              alert(inputSubjectsError.message);
              return;
            }
          }

          updateGlobalValueCache(inputData);
          await redirect('/inputs');
        }
      )}
    >
      <Input label="Label" {...form.register('label')} />
      <Controller
        control={form.control}
        name="subjects"
        render={({ field }) => (
          <Select
            hasAvatar
            isMulti
            label="For"
            noOptionsMessage={() => 'No subjects'}
            options={forceArray(subjects)}
            placeholder="All subjects"
            {...field}
          />
        )}
      />
      <Controller
        control={form.control}
        name="type"
        render={({ field: { onChange, ...field } }) => (
          <Select
            isClearable={false}
            isSearchable={false}
            label="Type"
            onChange={(option) => {
              onChange(option);
              form.setValue('settings', null);

              switch ((option as any)?.id) {
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
                case InputTypes.Select:
                case InputTypes.Stopwatch: {
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
            {...field}
          />
        )}
      />
      {hasOptions && (
        <>
          <fieldset className="group">
            <span className="label">
              {type === InputTypes.Stopwatch ? 'Timed notes' : 'Options'}
            </span>
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
                                  }
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
                            placeholder="Label"
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
            className="mt-2 justify-center"
            label="Allow options to be created"
            {...form.register('settings.isCreatable')}
          />
        </>
      )}
      {type === InputTypes.Number && (
        <>
          <fieldset className="flex gap-6">
            <NumberInput
              id="settings-min-fraction-digits"
              label="Min fraction digits"
              max={maxFractionDigits}
              min={0}
              {...form.register('settings.minFractionDigits')}
            />
            <NumberInput
              id="settings-max-fraction-digits"
              label="Max fraction digits"
              max={6}
              min={minFractionDigits ?? 0}
              {...form.register('settings.maxFractionDigits')}
            />
          </fieldset>
          <fieldset className="flex gap-6">
            <NumberInput
              id="settings-min"
              label="Min value"
              max={form.watch('settings.max')}
              maxFractionDigits={maxFractionDigits}
              minFractionDigits={minFractionDigits}
              {...form.register('settings.min')}
            />
            <NumberInput
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
