'use client';

import upsertTemplate from '@/_actions/upsert-template';
import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import FormBanner from '@/_components/form-banner';
import Input from '@/_components/input';
import InputForm from '@/_components/input-form';
import PageModalHeader from '@/_components/page-modal-header';
import RichTextarea from '@/_components/rich-textarea';
import Select, { IOption } from '@/_components/select';
import useCachedForm from '@/_hooks/use-cached-form';
import { GetInputData } from '@/_queries/get-input';
import { GetTemplateData } from '@/_queries/get-template';
import { ListInputsData } from '@/_queries/list-inputs';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { TemplateDataJson } from '@/_types/template-data-json';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import sortInputs from '@/_utilities/sort-inputs';
import stopPropagation from '@/_utilities/stop-propagation';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';

interface TemplateFormProps {
  availableInputs: NonNullable<ListInputsData>;
  disableCache?: boolean;
  isDuplicate?: boolean;
  onClose?: () => void;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  template?: Partial<GetTemplateData>;
}

type TemplateFormValues = {
  content: string;
  inputs: NonNullable<ListInputsData>;
  name: string;
};

const TemplateForm = ({
  availableInputs,
  disableCache,
  isDuplicate,
  onClose,
  subjects,
  template,
}: TemplateFormProps) => {
  const [createInputModal, setCreateInputModal] =
    useState<Partial<GetInputData>>(null);

  const [isTransitioning, startTransition] = useTransition();
  const cacheKey = getFormCacheKey.template({ id: template?.id, isDuplicate });
  const router = useRouter();
  const templateData = template?.data as TemplateDataJson;

  const form = useCachedForm<TemplateFormValues>(
    cacheKey,
    {
      defaultValues: {
        content: templateData?.content ?? '',
        inputs: availableInputs.filter(({ id }) =>
          templateData?.inputIds?.includes(id),
        ),
        name: template?.name ?? '',
      },
    },
    { disableCache },
  );

  const inputsArray = useFieldArray({ control: form.control, name: 'inputs' });

  return (
    <>
      <form
        className="divide-y divide-alpha-1"
        onSubmit={stopPropagation(
          form.handleSubmit((values) =>
            startTransition(async () => {
              const res = await upsertTemplate(
                { templateId: template?.id },
                values,
              );

              if (res?.error) {
                form.setError('root', { message: res.error, type: 'custom' });
              } else if (res?.data) {
                if (onClose) {
                  router.refresh();
                  onClose();
                } else {
                  localStorage.setItem('refresh', '1');
                  router.back();
                }
              }
            }),
          ),
        )}
      >
        {!disableCache && <FormBanner<TemplateFormValues> form={form} />}
        <div className="flex flex-col gap-6 px-4 py-8 sm:px-8">
          <Input
            label="Name"
            maxLength={49}
            required
            {...form.register('name')}
          />
          <Controller
            control={form.control}
            name="content"
            render={({ field }) => (
              <RichTextarea label="Description or instructions" {...field} />
            )}
          />
          <Controller
            control={form.control}
            name="inputs"
            render={({ field }) => (
              <Select
                formatCreateLabel={(value) => `Create "${value}" input`}
                isCreatable
                isMulti
                label="Inputs"
                name={field.name}
                noOptionsMessage={() => 'Type to create a new input'}
                onBlur={field.onBlur}
                onChange={(value) => field.onChange(value)}
                onCreateOption={(value) =>
                  setCreateInputModal({ label: value })
                }
                options={availableInputs.sort(sortInputs) as IOption[]}
                placeholder="Select inputs or type to create…"
                value={field.value as IOption[]}
              />
            )}
          />
        </div>
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
      <Dialog
        onClose={() => setCreateInputModal(null)}
        open={!!createInputModal}
      >
        <Dialog.Backdrop className="fixed inset-0 z-20 bg-alpha-reverse-1 backdrop-blur" />
        <div className="fixed inset-0 z-30 overflow-y-auto py-16">
          <div className="flex min-h-full items-start justify-center">
            <Dialog.Panel className="relative w-full max-w-lg divide-y divide-alpha-1 rounded border-y border-alpha-1 bg-bg-2 shadow-lg sm:border-x">
              <PageModalHeader
                onClose={() => setCreateInputModal(null)}
                title="Create input"
              />
              <InputForm
                disableCache
                input={createInputModal}
                onClose={() => setCreateInputModal(null)}
                onSubmit={(values) => {
                  inputsArray.append(values);
                  setCreateInputModal(null);
                }}
                subjects={subjects}
              />
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export type { TemplateFormValues };
export default TemplateForm;
