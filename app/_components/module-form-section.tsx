'use client';

import Alert from '@/_components/alert';
import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import InputForm from '@/_components/input-form';
import Menu from '@/_components/menu';
import PageModalHeader from '@/_components/page-modal-header';
import RichTextarea from '@/_components/rich-textarea';
import Select, { IOption } from '@/_components/select';
import TemplateForm from '@/_components/template-form';
import { GetInputData } from '@/_queries/get-input';
import { GetTemplateData } from '@/_queries/get-template';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesWithDataData } from '@/_queries/list-templates-with-data';
import { TemplateDataJson } from '@/_types/template-data-json';
import forceArray from '@/_utilities/force-array';
import { useSortable } from '@dnd-kit/sortable';
import { Dialog } from '@headlessui/react';
import Bars2Icon from '@heroicons/react/24/outline/Bars2Icon';
import DocumentDuplicateIcon from '@heroicons/react/24/outline/DocumentDuplicateIcon';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import EllipsisHorizontalIcon from '@heroicons/react/24/outline/EllipsisHorizontalIcon';
import TrashIcon from '@heroicons/react/24/outline/TrashIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { twMerge } from 'tailwind-merge';

import {
  ArrayPath,
  Controller,
  FieldValue,
  FieldValues,
  Path,
  PathValue,
  useFieldArray,
  UseFieldArrayReturn,
  UseFormReturn,
} from 'react-hook-form';

interface ModuleFormSectionProps<
  T extends FieldValues,
  U extends ArrayPath<T>,
> {
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  availableTemplates: NonNullable<ListTemplatesWithDataData>;
  eventTypeArray: UseFieldArrayReturn<T, U, 'key'>;
  eventTypeIndex: number;
  eventTypeKey: string;
  form: UseFormReturn<T>;
  hasOnlyOne?: boolean;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
}

const ModuleFormSection = <T extends FieldValues, U extends ArrayPath<T>>({
  availableInputs,
  availableTemplates,
  eventTypeArray,
  eventTypeIndex,
  eventTypeKey,
  form,
  hasOnlyOne,
  subjects,
}: ModuleFormSectionProps<T, U>) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: eventTypeKey });

  const [createInputModal, setCreateInputModal] =
    useState<Partial<GetInputData>>(null);

  const [createTemplateModal, setCreateTemplateModal] =
    useState<Partial<GetTemplateData>>(null);

  const [deleteAlert, toggleDeleteAlert] = useToggle(false);
  const [useTemplateModal, toggleUseTemplateModal] = useToggle(false);

  const inputsArray = useFieldArray({
    control: form.control,
    name: `modules[${eventTypeIndex}].inputs` as ArrayPath<T>,
  });

  const router = useRouter();

  return (
    <li
      className={twMerge(
        'relative rounded bg-bg-2',
        isDragging && 'z-10 shadow-2xl',
      )}
      ref={setNodeRef}
      style={{
        transform: transform
          ? isDragging
            ? `translate(${transform.x}px, ${transform.y}px) scale(1.03)`
            : `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        transition,
      }}
    >
      <div className="flex items-center justify-between rounded-t border border-alpha-1 bg-alpha-1">
        <IconButton
          className="m-0 h-full cursor-move touch-none px-4"
          icon={<Bars2Icon className="w-5" />}
          {...attributes}
          {...listeners}
        />
        <div className="smallcaps text-fg-4">Module {eventTypeIndex + 1}</div>
        <Menu>
          <Menu.Button className="group flex h-full items-center justify-center px-2 text-fg-3 hover:text-fg-2">
            <div className="rounded-full p-2 group-hover:bg-alpha-1">
              <EllipsisHorizontalIcon className="w-5" />
            </div>
          </Menu.Button>
          <Menu.Items className="mr-2 mt-2">
            <Menu.Item onClick={() => toggleUseTemplateModal()}>
              <DocumentTextIcon className="w-5 text-fg-4" />
              Use template
            </Menu.Item>
            <Menu.Item
              onClick={() => {
                const { content, inputs } = form.getValues(
                  `modules[${eventTypeIndex}]` as Path<T>,
                );

                setCreateTemplateModal({
                  data: {
                    content,
                    inputIds: inputs.map(({ id }: { id: string }) => id),
                  },
                });
              }}
            >
              <DocumentDuplicateIcon className="w-5 text-fg-4" />
              Create template
            </Menu.Item>
            <Menu.Item
              disabled={hasOnlyOne}
              onClick={() => toggleDeleteAlert(true)}
            >
              <TrashIcon className="w-5 text-fg-4" />
              Delete
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </div>
      <Controller
        control={form.control}
        name={`modules[${eventTypeIndex}].content` as T[string]}
        render={({ field }) => (
          <RichTextarea
            className="rounded-none border-t-0"
            key={field.name}
            placeholder="Description or instructions"
            {...field}
          />
        )}
      />
      <Controller
        control={form.control}
        name={`modules[${eventTypeIndex}].inputs` as T[string]}
        render={({ field }) => (
          <Select
            className="rounded-t-none border-t-0"
            formatCreateLabel={(value) => `Create "${value}" input`}
            isCreatable
            isMulti
            name={field.name}
            noOptionsMessage={() => 'Type to create a new input'}
            onBlur={field.onBlur}
            onChange={field.onChange}
            onCreateOption={(value) => setCreateInputModal({ label: value })}
            options={availableInputs as IOption[]}
            placeholder="Select inputs or type to create…"
            value={field.value}
          />
        )}
      />
      <Dialog onClose={toggleUseTemplateModal} open={useTemplateModal}>
        <Dialog.Backdrop className="fixed inset-0 z-20 bg-alpha-reverse-1 backdrop-blur-sm" />
        <div className="fixed inset-0 z-30 overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="w-full max-w-sm rounded border border-alpha-1 bg-bg-2 p-8 text-center shadow-lg">
              <Dialog.Title className="text-2xl">Use template</Dialog.Title>
              <Dialog.Description className="mt-4 px-4 text-fg-4">
                Selecting a template will overwrite any existing module values.
              </Dialog.Description>
              <Select
                className="mt-16 text-left"
                instanceId="template-select"
                noOptionsMessage={() => 'No templates'}
                onChange={(t) => {
                  const template = (
                    t as NonNullable<ListTemplatesWithDataData>[0]
                  )?.data as TemplateDataJson;

                  const inputs = availableInputs.filter(({ id }) =>
                    forceArray(template?.inputIds).includes(id),
                  ) as PathValue<T, T[string]>;

                  form.setValue(
                    `modules[${eventTypeIndex}].content` as Path<T>,
                    template?.content as PathValue<T, Path<T>>,
                    { shouldDirty: true },
                  );

                  form.setValue(
                    `modules[${eventTypeIndex}].inputs` as Path<T>,
                    inputs as PathValue<T, Path<T>>,
                    { shouldDirty: true },
                  );

                  toggleUseTemplateModal();
                }}
                options={availableTemplates}
                placeholder="Select a template…"
                value={null}
              />
              <Button
                className="-mb-3 mt-14 w-full justify-center p-0 py-3"
                onClick={() => toggleUseTemplateModal()}
                variant="link"
              >
                Close
              </Button>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
      <Dialog
        onClose={() => setCreateTemplateModal(null)}
        open={!!createTemplateModal}
      >
        <Dialog.Backdrop className="fixed inset-0 z-20 bg-alpha-reverse-1 backdrop-blur-sm" />
        <div className="fixed inset-0 z-30 overflow-y-auto py-16">
          <div className="flex min-h-full items-start justify-center">
            <Dialog.Panel className="relative w-full max-w-lg divide-y divide-alpha-1 rounded border-y border-alpha-1 bg-bg-2 shadow-lg sm:border-x">
              <PageModalHeader
                onClose={() => setCreateTemplateModal(null)}
                title="Create template"
              />
              <TemplateForm
                availableInputs={availableInputs}
                disableCache
                onClose={() => setCreateTemplateModal(null)}
                onSubmit={() => {
                  setCreateTemplateModal(null);
                  router.refresh();
                }}
                subjects={subjects}
                template={createTemplateModal}
              />
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
      <Alert
        confirmText="Delete module"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={() => eventTypeArray.remove(eventTypeIndex)}
      />
      <Dialog
        onClose={() => setCreateInputModal(null)}
        open={!!createInputModal}
      >
        <Dialog.Backdrop className="fixed inset-0 z-20 bg-alpha-reverse-1 backdrop-blur-sm" />
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
                  inputsArray.append(values as FieldValue<T>);
                  setCreateInputModal(null);
                  router.refresh();
                }}
                subjects={subjects}
              />
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </li>
  );
};

export default ModuleFormSection;
