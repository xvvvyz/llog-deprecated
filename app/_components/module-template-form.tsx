'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import InputForm from '@/_components/input-form';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import RichTextarea from '@/_components/rich-textarea';
import Select, { IOption } from '@/_components/select-v1';
import TemplateVisibilityFormSection from '@/_components/template-visibility-form-section';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertModuleTemplate from '@/_mutations/upsert-module-template';
import { GetInputData } from '@/_queries/get-input';
import { GetTemplateData } from '@/_queries/get-template';
import { ListInputsData } from '@/_queries/list-inputs';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ModuleTemplateDataJson } from '@/_types/module-template-data-json';
import forceArray from '@/_utilities/force-array';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import stopPropagation from '@/_utilities/stop-propagation';
import { sortBy } from 'lodash';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { Controller, useFieldArray } from 'react-hook-form';

interface ModuleTemplateFormProps {
  availableInputs: NonNullable<ListInputsBySubjectIdData | ListInputsData>;
  disableCache?: boolean;
  isDuplicate?: boolean;
  onSubmit?: () => void;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  template?: Partial<GetTemplateData>;
  title: string;
}

export interface ModuleTemplateFormValues {
  content: string;
  description: string;
  inputs: NonNullable<ListInputsBySubjectIdData | ListInputsData>;
  name: string;
  public: boolean;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
}

const ModuleTemplateForm = ({
  availableInputs,
  disableCache,
  isDuplicate,
  onSubmit,
  subjects,
  template,
  title,
}: ModuleTemplateFormProps) => {
  const [createInputModal, setCreateInputModal] =
    useState<Partial<GetInputData>>(null);

  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const templateData = template?.data as ModuleTemplateDataJson;

  const cacheKey = getFormCacheKey.moduleTemplate({
    id: template?.id,
    isDuplicate,
  });

  const form = useCachedForm<ModuleTemplateFormValues>(
    cacheKey,
    {
      defaultValues: {
        content: templateData?.content ?? '',
        description: template?.description ?? '',
        inputs: availableInputs.filter((input) =>
          templateData?.inputIds?.includes(input.id),
        ),
        name: template?.name ?? '',
        public: template?.public ?? false,
        subjects: forceArray(subjects).filter(({ id }) =>
          template?.subjects?.some((sf) => sf.id === id),
        ),
      },
    },
    { disableCache },
  );

  const inputsArray = useFieldArray({ control: form.control, name: 'inputs' });

  return (
    <form
      className="flex flex-col gap-8 pb-8"
      onSubmit={stopPropagation(
        form.handleSubmit((values) =>
          startTransition(async () => {
            const res = await upsertModuleTemplate(
              { templateId: isDuplicate ? undefined : template?.id },
              values,
            );

            if (res?.error) {
              form.setError('root', { message: res.error, type: 'custom' });
              return;
            }

            if (onSubmit) {
              onSubmit();
              return;
            }

            router.back();
          }),
        ),
      )}
    >
      <PageModalHeader
        right={
          <TemplateVisibilityFormSection form={form} subjects={subjects} />
        }
        title={title}
      />
      <div className="flex flex-col gap-8 px-4 sm:px-8">
        <InputRoot>
          <Label.Root htmlFor="name">Name</Label.Root>
          <Input maxLength={49} required {...form.register('name')} />
        </InputRoot>
        <InputRoot>
          <Label.Root htmlFor="content">
            Module description or instructions
          </Label.Root>
          <Controller
            control={form.control}
            name="content"
            render={({ field }) => <RichTextarea {...field} />}
          />
        </InputRoot>
        <Modal.Root
          onOpenChange={() => setCreateInputModal(null)}
          open={!!createInputModal}
        >
          <InputRoot>
            <Label.Root htmlFor="react-select-inputs-input">Inputs</Label.Root>
            <Controller
              control={form.control}
              name="inputs"
              render={({ field }) => (
                <Select
                  formatCreateLabel={(value) => `Create "${value}" input`}
                  isCreatable
                  isMulti
                  name={field.name}
                  noOptionsMessage={() => 'Type to create a new input.'}
                  onBlur={field.onBlur}
                  onChange={(value) => field.onChange(value)}
                  onCreateOption={(value) =>
                    setCreateInputModal({ label: value })
                  }
                  options={
                    sortBy(availableInputs, 'subjects[0].name') as IOption[]
                  }
                  placeholder="Select inputs or type to create…"
                  value={field.value as IOption[]}
                />
              )}
            />
          </InputRoot>
          <Modal.Portal>
            <Modal.Overlay>
              <Modal.Content>
                <PageModalHeader title="New input" />
                <InputForm
                  disableCache
                  input={createInputModal}
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
      </div>
      {form.formState.errors.root && (
        <div className="px-4 text-center sm:px-8">
          {form.formState.errors.root.message}
        </div>
      )}
      <div className="flex gap-4 px-4 pt-8 sm:px-8">
        <Modal.Close asChild>
          <Button className="w-full" colorScheme="transparent">
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
      {!disableCache && (
        <UnsavedChangesBanner<ModuleTemplateFormValues> form={form} />
      )}
    </form>
  );
};

export default ModuleTemplateForm;
