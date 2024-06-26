'use client';

import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import FormBanner from '@/_components/form-banner';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import Select, { IOption } from '@/_components/select';
import INPUT_LABELS from '@/_constants/constant-input-labels';
import InputType from '@/_constants/enum-input-type';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertInput from '@/_mutations/upsert-input';
import { GetInputData } from '@/_queries/get-input';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { Database } from '@/_types/database';
import { InputSettingsJson } from '@/_types/input-settings-json';
import forceArray from '@/_utilities/force-array';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import stopPropagation from '@/_utilities/stop-propagation';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';
import { PropsValue } from 'react-select';

const INPUT_TYPE_OPTIONS = [
  { id: InputType.Select, label: INPUT_LABELS[InputType.Select] },
  { id: InputType.MultiSelect, label: INPUT_LABELS[InputType.MultiSelect] },
  { id: InputType.Number, label: INPUT_LABELS[InputType.Number] },
  { id: InputType.Duration, label: INPUT_LABELS[InputType.Duration] },
  { id: InputType.Checkbox, label: INPUT_LABELS[InputType.Checkbox] },
  { id: InputType.Stopwatch, label: INPUT_LABELS[InputType.Stopwatch] },
];

interface InputFormProps {
  disableCache?: boolean;
  input?: Partial<GetInputData>;
  isDuplicate?: boolean;
  onClose?: () => void;
  onSubmit?: (values: NonNullable<ListInputsBySubjectIdData>[0]) => void;
  subjects?: NonNullable<ListSubjectsByTeamIdData>;
}

type InputFormValues = {
  label: string;
  options: Array<Database['public']['Tables']['input_options']['Insert']>;
  settings?: InputSettingsJson;
  subjects: Array<Database['public']['Tables']['subjects']['Row']>;
  type: { id: Database['public']['Enums']['input_type'] };
};

const InputForm = ({
  disableCache,
  input,
  isDuplicate,
  onClose,
  onSubmit,
  subjects,
}: InputFormProps) => {
  const [isTransitioning, startTransition] = useTransition();

  const form = useCachedForm<InputFormValues>(
    getFormCacheKey.input({ id: input?.id, isDuplicate }),
    {
      defaultValues: {
        label: input?.label ?? '',
        options: input?.options ?? [],
        settings: input?.settings as InputSettingsJson,
        subjects: forceArray(subjects).filter(({ id }) =>
          input?.subjects_for?.some(({ subject_id }) => subject_id === id),
        ),
        type: INPUT_TYPE_OPTIONS.find(({ id }) => id === input?.type),
      },
    },
    { disableCache },
  );

  const optionsArray = useFieldArray({
    control: form.control,
    name: 'options',
  });

  const router = useRouter();
  const type = form.watch('type')?.id;

  return (
    <form
      className="divide-y divide-alpha-1"
      onSubmit={stopPropagation(
        form.handleSubmit((values) =>
          startTransition(async () => {
            const res = await upsertInput(
              { inputId: isDuplicate ? undefined : input?.id },
              values,
            );

            if (res?.error) {
              form.setError('root', { message: res.error, type: 'custom' });
            } else if (res?.data) {
              onSubmit?.({
                id: res.data.id,
                label: res.data.label,
                subjects: values.subjects,
                type: values.type.id,
              });

              if (!onClose) {
                localStorage.setItem('refresh', '1');
                router.back();
              }
            }
          }),
        ),
      )}
    >
      {!disableCache && <FormBanner<InputFormValues> form={form} />}
      <div className="px-4 py-8 sm:px-8">
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
              onChange={(value) => field.onChange(value)}
              options={subjects as IOption[]}
              placeholder="All subjects…"
              tooltip={
                <>
                  If this input isn&rsquo;t applicable to all of your subjects,
                  you can specify the relevant subjects here.
                </>
              }
              value={field.value as PropsValue<IOption>}
            />
          )}
        />
      </div>
      <div className="flex flex-col gap-6 px-4 py-8 sm:px-8">
        <Input label="Label" required {...form.register('label')} />
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
                field.onChange(option);
                form.setValue('settings', null, { shouldDirty: true });

                switch ((option as InputFormValues['options'][0])?.id) {
                  case InputType.Number: {
                    form.setValue(
                      'settings',
                      { max: '100', min: '0', step: '1' },
                      { shouldDirty: true },
                    );

                    return;
                  }

                  case InputType.MultiSelect:
                  case InputType.Select: {
                    form.setValue(
                      'settings',
                      { isCreatable: false },
                      { shouldDirty: true },
                    );

                    return;
                  }

                  default: {
                    // noop
                  }
                }
              }}
              options={INPUT_TYPE_OPTIONS}
              placeholder="Select type…"
              required
              value={field.value as PropsValue<IOption>}
            />
          )}
        />
      </div>
      {(type === InputType.Select ||
        type === InputType.MultiSelect ||
        type === InputType.Number) && (
        <div className="flex flex-col gap-6 px-4 py-8 sm:px-8">
          {(type === InputType.Select || type === InputType.MultiSelect) && (
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
                                      input_id: input?.id ?? '',
                                      label: '',
                                      order: optionIndex + 1,
                                    });
                                  }
                                }}
                                placeholder="Label…"
                                required
                                right={
                                  <IconButton
                                    className="m-0 h-full w-full justify-center p-0"
                                    icon={<XMarkIcon className="w-5" />}
                                    label="Delete option"
                                    onClick={() =>
                                      optionsArray.remove(optionIndex)
                                    }
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
                        input_id: input?.id ?? '',
                        label: '',
                        order: optionsArray.fields.length,
                      })
                    }
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
                    Enable this when you don&rsquo;t know all possible options
                    in advance.
                  </>
                }
                {...form.register('settings.isCreatable')}
              />
            </>
          )}
          {type === InputType.Number && (
            <>
              <fieldset className="flex gap-4">
                <Input
                  label="Min value"
                  max={form.watch('settings.max')}
                  required
                  step={form.watch('settings.step')}
                  type="number"
                  {...form.register('settings.min')}
                />
                <Input
                  label="Max value"
                  min={form.watch('settings.min')}
                  required
                  step={form.watch('settings.step')}
                  type="number"
                  {...form.register('settings.max')}
                />
              </fieldset>
              <fieldset>
                <Input
                  label="Step"
                  min={0}
                  required
                  step="any"
                  // explain html number input step so it's not confusing
                  tooltip={
                    <>
                      Step is the interval between values. For example, if you
                      set the step to 5, you can only enter values that are
                      multiples of 5 (5, 10, 15, etc).
                    </>
                  }
                  type="number"
                  {...form.register('settings.step')}
                />
              </fieldset>
            </>
          )}
        </div>
      )}
      {form.formState.errors.root && (
        <div className="px-4 py-8 text-center sm:px-8">
          {form.formState.errors.root.message}
        </div>
      )}
      <div className="flex gap-4 px-4 py-8 sm:px-8">
        <BackButton
          className="w-full"
          colorScheme="transparent"
          onClick={onClose}
        >
          Close
        </BackButton>
        <Button
          className="w-full"
          loading={isTransitioning}
          loadingText="Saving…"
          type="submit"
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export type { InputFormValues };
export default InputForm;
