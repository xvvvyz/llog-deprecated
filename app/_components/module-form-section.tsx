'use client';

import Alert from '@/_components/alert';
import Button from '@/_components/button';
import DropdownMenu from '@/_components/dropdown-menu';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import InputForm from '@/_components/input-form';
import Modal from '@/_components/modal';
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
  subjectId: string;
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
  subjectId,
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
        'bg-bg-2',
        isDragging && 'relative z-10 drop-shadow-2xl',
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
        <DropdownMenu
          trigger={
            <div className="group flex items-center justify-center px-2 text-fg-3 hover:text-fg-2 active:text-fg-2">
              <div className="rounded-full p-2 group-hover:bg-alpha-1 group-active:bg-alpha-1">
                <EllipsisHorizontalIcon className="w-5" />
              </div>
            </div>
          }
        >
          <DropdownMenu.Content className="-mt-10 mr-1">
            <DropdownMenu.Button onClick={() => toggleUseTemplateModal()}>
              <DocumentTextIcon className="w-5 text-fg-4" />
              Use template
            </DropdownMenu.Button>
            <DropdownMenu.Button
              onClick={() => {
                const { content, inputs, name } = form.getValues(
                  `modules[${eventTypeIndex}]` as Path<T>,
                );

                setCreateTemplateModal({
                  data: {
                    content,
                    inputIds: inputs.map(({ id }: { id: string }) => id),
                  },
                  name,
                });
              }}
            >
              <DocumentDuplicateIcon className="w-5 text-fg-4" />
              New template
            </DropdownMenu.Button>
            <DropdownMenu.Button
              disabled={hasOnlyOne}
              onClick={() => toggleDeleteAlert(true)}
            >
              <TrashIcon className="w-5 text-fg-4" />
              Delete
            </DropdownMenu.Button>
          </DropdownMenu.Content>
        </DropdownMenu>
      </div>
      <Input
        className="rounded-none border-t-0"
        maxLength={49}
        placeholder="Module title"
        {...form.register(`modules[${eventTypeIndex}].name` as Path<T>)}
      />
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
            noOptionsMessage={() => 'Type to create a new input.'}
            onBlur={field.onBlur}
            onChange={field.onChange}
            onCreateOption={(value) =>
              setCreateInputModal({
                label: value,
                subjects: [{ id: subjectId }],
              })
            }
            options={availableInputs as IOption[]}
            placeholder="Select inputs or type to create…"
            value={field.value}
          />
        )}
      />
      <Modal
        className="max-w-sm p-8 text-center"
        onOpenChange={toggleUseTemplateModal}
        open={useTemplateModal}
      >
        <h1 className="text-2xl">Use template</h1>
        <p className="mt-4 px-4 text-fg-4">
          Selecting a template will overwrite any existing module values.
        </p>
        <div className="pt-16 text-left">
          <Select
            instanceId="template-select"
            noOptionsMessage={() => 'No templates.'}
            onChange={(t) => {
              const template = t as NonNullable<ListTemplatesWithDataData>[0];

              const data = template?.data as TemplateDataJson;

              const inputs = availableInputs.filter(({ id }) =>
                forceArray(data?.inputIds).includes(id),
              ) as PathValue<T, T[string]>;

              form.setValue(
                `modules[${eventTypeIndex}].name` as Path<T>,
                template?.name as PathValue<T, Path<T>>,
                { shouldDirty: true },
              );

              form.setValue(
                `modules[${eventTypeIndex}].content` as Path<T>,
                data?.content as PathValue<T, Path<T>>,
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
        </div>
        <Button
          className="-mb-3 mt-14 w-full justify-center p-0 py-3"
          onClick={() => toggleUseTemplateModal()}
          variant="link"
        >
          Close
        </Button>
      </Modal>
      <Modal
        onOpenChange={() => setCreateTemplateModal(null)}
        open={!!createTemplateModal}
      >
        <PageModalHeader
          onClose={() => setCreateTemplateModal(null)}
          title="New template"
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
      </Modal>
      <Alert
        confirmText="Delete module"
        isOpen={deleteAlert}
        onClose={toggleDeleteAlert}
        onConfirm={() => eventTypeArray.remove(eventTypeIndex)}
      />
      <Modal
        onOpenChange={() => setCreateInputModal(null)}
        open={!!createInputModal}
      >
        <PageModalHeader
          onClose={() => setCreateInputModal(null)}
          title="New input"
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
      </Modal>
    </li>
  );
};

export default ModuleFormSection;
