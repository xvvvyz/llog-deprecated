'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import InputForm from '@/_components/input-form';
import * as Modal from '@/_components/modal';
import PageModalBackButton from '@/_components/page-modal-back-button';
import PageModalHeader from '@/_components/page-modal-header';
import RichTextarea from '@/_components/rich-textarea';
import Select, { IOption } from '@/_components/select';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertModuleTemplate from '@/_mutations/upsert-module-template';
import { GetInputData } from '@/_queries/get-input';
import { GetTemplateData } from '@/_queries/get-template';
import { ListInputsData } from '@/_queries/list-inputs';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ModuleTemplateDataJson } from '@/_types/module-template-data-json';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import stopPropagation from '@/_utilities/stop-propagation';
import { sortBy } from 'lodash';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';

interface ModuleTemplateFormProps {
  availableInputs: NonNullable<ListInputsData>;
  disableCache?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  template?: Partial<GetTemplateData>;
}

export type ModuleTemplateFormValues = {
  content: string;
  inputs: NonNullable<ListInputsData>;
  name: string;
};

const ModuleTemplateForm = ({
  availableInputs,
  disableCache,
  onClose,
  onSubmit,
  subjects,
  template,
}: ModuleTemplateFormProps) => {
  const [createInputModal, setCreateInputModal] =
    useState<Partial<GetInputData>>(null);

  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const templateData = template?.data as ModuleTemplateDataJson;
  const cacheKey = getFormCacheKey.moduleTemplate({ id: template?.id });

  const form = useCachedForm<ModuleTemplateFormValues>(
    cacheKey,
    {
      defaultValues: {
        content: templateData?.content ?? '',
        inputs: availableInputs.filter((input) =>
          templateData?.inputIds?.includes(input.id),
        ),
        name: template?.name ?? '',
      },
    },
    { disableCache },
  );

  const inputsArray = useFieldArray({ control: form.control, name: 'inputs' });

  return (
    <form
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={stopPropagation(
        form.handleSubmit((values) =>
          startTransition(async () => {
            const res = await upsertModuleTemplate(
              { templateId: template?.id },
              values,
            );

            if (res?.error) {
              form.setError('root', { message: res.error, type: 'custom' });
            } else if (res?.data) {
              onSubmit?.();
              if (!onClose) router.back();
            }
          }),
        ),
      )}
    >
      <Input label="Name" maxLength={49} required {...form.register('name')} />
      <Controller
        control={form.control}
        name="content"
        render={({ field }) => (
          <RichTextarea label="Description or instructions" {...field} />
        )}
      />
      <Modal.Root
        onOpenChange={() => setCreateInputModal(null)}
        open={!!createInputModal}
      >
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
              noOptionsMessage={() => 'Type to create a new input.'}
              onBlur={field.onBlur}
              onChange={(value) => field.onChange(value)}
              onCreateOption={(value) => setCreateInputModal({ label: value })}
              options={sortBy(availableInputs, 'subjects[0].name') as IOption[]}
              placeholder="Select inputs or type to create…"
              value={field.value as IOption[]}
            />
          )}
        />
        <Modal.Portal>
          <Modal.Overlay>
            <Modal.Content>
              <PageModalHeader
                onClose={() => setCreateInputModal(null)}
                title="New input"
              />
              <InputForm
                disableCache
                input={createInputModal}
                onClose={() => setCreateInputModal(null)}
                onSubmit={(values) => {
                  inputsArray.append(values);
                  setCreateInputModal(null);
                  router.refresh();
                }}
                subjects={subjects}
              />
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      <div className="flex gap-4 pt-8">
        <PageModalBackButton
          className="w-full"
          colorScheme="transparent"
          onClick={onClose}
        >
          Close
        </PageModalBackButton>
        <Button
          className="w-full"
          loading={isTransitioning}
          loadingText="Saving…"
          type="submit"
        >
          Save
        </Button>
      </div>
      {!disableCache && (
        <UnsavedChangesBanner<ModuleTemplateFormValues> form={form} />
      )}
    </form>
  );
};

export default ModuleTemplateForm;
