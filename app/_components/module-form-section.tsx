'use client';

import * as Drawer from '@/_components/drawer';
import DrawerDeleteButton from '@/_components/drawer-delete-button';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import InputForm from '@/_components/input-form';
import * as Modal from '@/_components/modal';
import ModuleTemplateForm from '@/_components/module-template-form';
import ModuleUseTemplateDrawer from '@/_components/module-use-template-drawer';
import PageModalHeader from '@/_components/page-modal-header';
import RichTextarea from '@/_components/rich-textarea';
import Select, { IOption } from '@/_components/select-v1';
import { SessionFormValues } from '@/_components/session-form';
import { GetInputData } from '@/_queries/get-input';
import { GetTemplateData } from '@/_queries/get-template';
import { ListInputsData } from '@/_queries/list-inputs';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesData } from '@/_queries/list-templates';
import { ListTemplatesBySubjectIdAndTypeData } from '@/_queries/list-templates-by-subject-id-and-type';
import { useSortable } from '@dnd-kit/sortable';
import ArrowDownIcon from '@heroicons/react/24/outline/ArrowDownIcon';
import ArrowUpIcon from '@heroicons/react/24/outline/ArrowUpIcon';
import Bars2Icon from '@heroicons/react/24/outline/Bars2Icon';
import EllipsisVerticalIcon from '@heroicons/react/24/outline/EllipsisVerticalIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import * as Form from 'react-hook-form';
import { twMerge } from 'tailwind-merge';

interface ModuleFormSectionProps<
  T extends Form.FieldValues,
  U extends Form.ArrayPath<T>,
> {
  availableInputs: NonNullable<ListInputsBySubjectIdData | ListInputsData>;
  availableTemplates: NonNullable<
    ListTemplatesBySubjectIdAndTypeData | ListTemplatesData
  >;
  fieldPath: Form.FieldPath<T>;
  form: Form.UseFormReturn<T>;
  hasOnlyOne?: boolean;
  moduleArray: Form.UseFieldArrayReturn<T, U, 'key'>;
  moduleIndex: number;
  moduleKey: string;
  subjectId?: string;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
}

const ModuleFormSection = <
  T extends Form.FieldValues,
  U extends Form.ArrayPath<T>,
>({
  availableInputs,
  availableTemplates,
  fieldPath,
  form,
  hasOnlyOne,
  moduleArray,
  moduleIndex,
  moduleKey,
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
  } = useSortable({ id: moduleKey });

  const [createInputModal, setCreateInputModal] =
    useState<Partial<GetInputData>>(null);

  const [createTemplateModal, setCreateTemplateModal] =
    useState<Partial<GetTemplateData>>(null);

  const inputsArray = Form.useFieldArray({
    control: form.control,
    name: `${fieldPath}.inputs` as Form.ArrayPath<T>,
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
          className="m-0 h-full cursor-ns-resize touch-none px-4"
          icon={<Bars2Icon className="w-5" />}
          {...attributes}
          {...listeners}
        />
        <div className="smallcaps pr-1.5 text-fg-4">
          Module {moduleIndex + 1}
        </div>
        <Drawer.Root>
          <Drawer.Trigger>
            <div className="group -mr-1 flex items-center justify-center p-1 text-fg-3 transition-colors hover:text-fg-2">
              <div className="rounded-full p-2">
                <EllipsisVerticalIcon className="w-5" />
              </div>
            </div>
          </Drawer.Trigger>
          <Drawer.Portal>
            <Drawer.Overlay />
            <Drawer.Content>
              <Drawer.Title>Module menu</Drawer.Title>
              <Drawer.Description />
              <ModuleUseTemplateDrawer<T>
                availableInputs={availableInputs}
                availableModuleTemplates={availableTemplates}
                fieldPath={fieldPath}
                form={form}
              />
              <Modal.Root
                onOpenChange={(open) => {
                  if (open) {
                    const { content, inputs, name } = form.getValues(
                      fieldPath,
                    ) as SessionFormValues['modules'][0];

                    setCreateTemplateModal({
                      data: {
                        content,
                        inputIds: inputs.map(({ id }) => id),
                      },
                      name: name ?? '',
                    });
                  } else {
                    setCreateTemplateModal(null);
                  }
                }}
                open={!!createTemplateModal}
              >
                <Modal.Trigger asChild>
                  <Drawer.Button>
                    <PlusIcon className="w-5 text-fg-4" />
                    New template
                  </Drawer.Button>
                </Modal.Trigger>
                <Modal.Portal>
                  <Modal.Overlay>
                    <Modal.Content>
                      <PageModalHeader
                        onClose={() => setCreateTemplateModal(null)}
                        title="New module template"
                      />
                      <ModuleTemplateForm
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
                    </Modal.Content>
                  </Modal.Overlay>
                </Modal.Portal>
              </Modal.Root>
              <Drawer.Separator />
              <Drawer.Button
                onClick={() =>
                  moduleArray.insert(moduleIndex, {
                    content: '',
                    inputs: [],
                    name: '',
                  } as Form.FieldValue<T>)
                }
              >
                <ArrowUpIcon className="w-5 text-fg-4" />
                Add module above
              </Drawer.Button>
              <Drawer.Button
                onClick={() =>
                  moduleArray.insert(moduleIndex + 1, {
                    content: '',
                    inputs: [],
                    name: '',
                  } as Form.FieldValue<T>)
                }
              >
                <ArrowDownIcon className="w-5 text-fg-4" />
                Add module below
              </Drawer.Button>
              {!hasOnlyOne && (
                <>
                  <Drawer.Separator />
                  <DrawerDeleteButton
                    confirmText="Delete module"
                    onConfirm={() => moduleArray.remove(moduleIndex)}
                  />
                </>
              )}
            </Drawer.Content>
          </Drawer.Portal>
        </Drawer.Root>
      </div>
      <Input
        className="rounded-none border-t-0"
        maxLength={49}
        placeholder="Title"
        {...form.register(`${fieldPath}.name` as Form.Path<T>)}
      />
      <Form.Controller
        control={form.control}
        name={`${fieldPath}.content` as T[string]}
        render={({ field }) => (
          <RichTextarea
            className="rounded-none border-t-0"
            placeholder="Instructions"
            {...field}
          />
        )}
      />
      <Modal.Root
        onOpenChange={() => setCreateInputModal(null)}
        open={!!createInputModal}
      >
        <Form.Controller
          control={form.control}
          name={`${fieldPath}.inputs` as T[string]}
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
                  subjects: subjectId ? [{ id: subjectId }] : [],
                })
              }
              options={availableInputs as IOption[]}
              placeholder="Select inputs or type to create…"
              value={field.value}
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
                  inputsArray.append(values as Form.FieldValue<T>);
                  setCreateInputModal(null);
                  router.refresh();
                }}
                subjects={subjects}
              />
            </Modal.Content>
          </Modal.Overlay>
        </Modal.Portal>
      </Modal.Root>
    </li>
  );
};

export default ModuleFormSection;
