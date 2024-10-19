'use client';

import Avatar from '@/_components/avatar';
import Button from '@/_components/button';
import Checkbox from '@/_components/checkbox';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import * as Modal from '@/_components/modal';
import Select, { IOption } from '@/_components/select-v1';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import INPUT_TYPE_LABELS from '@/_constants/constant-input-type-labels';
import InputType from '@/_constants/enum-input-type';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertInput from '@/_mutations/upsert-input';
import { GetInputData } from '@/_queries/get-input';
import { GetInputWithUsesData } from '@/_queries/get-input-with-uses';
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
  { id: InputType.Select, label: INPUT_TYPE_LABELS[InputType.Select] },
  {
    id: InputType.MultiSelect,
    label: INPUT_TYPE_LABELS[InputType.MultiSelect],
  },
  { id: InputType.Number, label: INPUT_TYPE_LABELS[InputType.Number] },
  { id: InputType.Checkbox, label: INPUT_TYPE_LABELS[InputType.Checkbox] },
  { id: InputType.Duration, label: INPUT_TYPE_LABELS[InputType.Duration] },
  { id: InputType.Stopwatch, label: INPUT_TYPE_LABELS[InputType.Stopwatch] },
];

interface InputFormProps {
  disableCache?: boolean;
  input?: Partial<GetInputData>;
  isDuplicate?: boolean;
  onClose?: () => void;
  onSubmit?: (values: NonNullable<ListInputsBySubjectIdData>[0]) => void;
  subjects?: NonNullable<ListSubjectsByTeamIdData>;
  usedBy?: Array<
    NonNullable<NonNullable<GetInputWithUsesData>['uses'][0]['subject']>
  >;
}

export interface InputFormValues {
  label: string;
  options: Array<Database['public']['Tables']['input_options']['Insert']>;
  settings?: InputSettingsJson;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  type: { id: Database['public']['Enums']['input_type'] };
}

const InputForm = ({
  disableCache,
  input,
  isDuplicate,
  onClose,
  onSubmit,
  subjects,
  usedBy,
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
          input?.subjects?.some((sf) => sf.id === id),
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
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
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

              if (!onClose) router.back();
            }
          }),
        ),
      )}
    >
      <InputRoot>
        <Label.Root htmlFor="label">Label</Label.Root>
        <Input required {...form.register('label')} />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="react-select-subjects-input">For</Label.Root>
        <Label.Tip>
          The input will only be available for the&nbsp;specified subjects.
        </Label.Tip>
        <Controller
          control={form.control}
          name="subjects"
          render={({ field }) => (
            <Select
              hasAvatar
              isMulti
              name={field.name}
              noOptionsMessage={() => 'No subjects.'}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange(value)}
              options={subjects as IOption[]}
              placeholder="All subjects…"
              value={field.value as PropsValue<IOption>}
            />
          )}
        />
        {!!usedBy?.length && (
          <div className="smallcaps flex flex-wrap items-center gap-3 px-4 pt-3">
            <div className="text-fg-4">Used by</div>
            {usedBy.map((subject) => (
              <Button
                className="m-0 mr-1 p-0"
                href={`/subjects/${subject.id}`}
                key={`used-by-${subject.id}`}
                variant="link"
              >
                <Avatar
                  className="-my-[0.15rem] size-5"
                  file={subject.image_uri}
                  id={subject.id}
                />
                {subject.name}
              </Button>
            ))}
          </div>
        )}
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="react-select-type-input">Type</Label.Root>
        <Controller
          control={form.control}
          name="type"
          render={({ field }) => (
            <Select
              isClearable={false}
              isSearchable={false}
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
      </InputRoot>
      {(type === InputType.Select || type === InputType.MultiSelect) && (
        <>
          <fieldset className="group">
            <span className="label">Options</span>
            <div className="space-y-2">
              {!!optionsArray.fields.length && (
                <ul className="flex flex-col gap-2">
                  {optionsArray.fields.map((option, optionIndex) => (
                    <li className="relative" key={option.id}>
                      <Controller
                        control={form.control}
                        name={`options.${optionIndex}.label`}
                        render={({ field }) => (
                          <Input
                            className="pr-[2.4rem]"
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
                            {...field}
                          />
                        )}
                      />
                      <div className="absolute right-0 top-0 flex h-[2.625rem] w-[2.4rem] items-center justify-center">
                        <IconButton
                          className="m-0 h-full w-full justify-center p-0"
                          icon={<XMarkIcon className="w-5" />}
                          label="Delete option"
                          onClick={() => optionsArray.remove(optionIndex)}
                          tabIndex={-1}
                        />
                      </div>
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
          <InputRoot>
            <Label.Root htmlFor="settings.isCreatable">
              Allow options to be created
            </Label.Root>
            <Label.Tip>
              Enable this when you don&rsquo;t know all possible options in
              advance.
            </Label.Tip>
            <Checkbox {...form.register('settings.isCreatable')} />
          </InputRoot>
        </>
      )}
      {type === InputType.Number && (
        <>
          <fieldset className="flex gap-4">
            <InputRoot>
              <Label.Root htmlFor="settings.min">Min value</Label.Root>
              <Input
                max={form.watch('settings.max')}
                required
                step={form.watch('settings.step')}
                type="number"
                {...form.register('settings.min')}
              />
            </InputRoot>
            <InputRoot>
              <Label.Root htmlFor="settings.max">Max value</Label.Root>
              <Input
                min={form.watch('settings.min')}
                required
                step={form.watch('settings.step')}
                type="number"
                {...form.register('settings.max')}
              />
            </InputRoot>
          </fieldset>
          <fieldset>
            <InputRoot>
              <Label.Root htmlFor="settings.step">Step</Label.Root>
              <Label.Tip>
                Step is the interval between values. For example, if you set the
                step to 5, you can only enter values that are multiples of 5 (5,
                10, 15, etc).
              </Label.Tip>
              <Input
                min={0}
                required
                step="any"
                type="number"
                {...form.register('settings.step')}
              />
            </InputRoot>
          </fieldset>
        </>
      )}
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      <div className="flex gap-4 pt-8">
        <Modal.Close asChild>
          <Button
            className="w-full"
            colorScheme="transparent"
            onClick={onClose}
          >
            Close
          </Button>
        </Modal.Close>
        <Button
          className="w-full"
          loading={isTransitioning}
          loadingText="Saving…"
          type="submit"
        >
          Save
        </Button>
      </div>
      {!disableCache && <UnsavedChangesBanner<InputFormValues> form={form} />}
    </form>
  );
};

export default InputForm;
