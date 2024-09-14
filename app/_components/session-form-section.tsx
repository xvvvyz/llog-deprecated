'use client';

import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import * as Modal from '@/_components/modal';
import ModuleFormSection from '@/_components/module-form-section';
import Tip from '@/_components/tip';
import { ListInputsData } from '@/_queries/list-inputs';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesData } from '@/_queries/list-templates';
import { ListTemplatesBySubjectIdAndTypeData } from '@/_queries/list-templates-by-subject-id-and-type';
import formatDatetimeLocal from '@/_utilities/format-datetime-local';
import * as DndCore from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import * as DndSortable from '@dnd-kit/sortable';
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useState } from 'react';
import * as Form from 'react-hook-form';

interface SessionFormSectionProps<T extends Form.FieldValues> {
  availableInputs: NonNullable<ListInputsBySubjectIdData | ListInputsData>;
  availableModuleTemplates: NonNullable<
    ListTemplatesBySubjectIdAndTypeData | ListTemplatesData
  >;
  fieldPath?: string;
  form: Form.UseFormReturn<T>;
  includeScheduledFor?: boolean;
  includeTitle?: boolean;
  subjectId?: string;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
}

const SessionFormSection = <T extends Form.FieldValues>({
  availableInputs,
  availableModuleTemplates,
  fieldPath,
  form,
  includeScheduledFor,
  includeTitle,
  subjectId,
  subjects,
}: SessionFormSectionProps<T>) => {
  const [ogScheduledFor, setOgScheduledFor] = useState<string | null>(null);
  const [scheduleModal, toggleScheduleModal] = useToggle(false);
  const sensors = DndCore.useSensors(DndCore.useSensor(DndCore.PointerSensor));

  const titleFieldPath = (
    fieldPath ? `${fieldPath}.title` : 'title'
  ) as Form.FieldPath<T>;

  const scheduledForFieldPath = (
    fieldPath ? `${fieldPath}.scheduledFor` : 'scheduledFor'
  ) as Form.FieldPath<T>;

  const modulesFieldPath = (
    fieldPath ? `${fieldPath}.modules` : 'modules'
  ) as Form.ArrayPath<T>;

  const modulesArray = Form.useFieldArray({
    control: form.control,
    keyName: 'key',
    name: modulesFieldPath,
  });

  const scheduledFor = form.watch(scheduledForFieldPath);

  const cancelScheduleModal = () => {
    form.setValue(
      scheduledForFieldPath,
      (ogScheduledFor ?? null) as Form.PathValue<T, Form.FieldPath<T>>,
      { shouldDirty: true },
    );

    setOgScheduledFor(null);
    toggleScheduleModal(false);
  };

  const openScheduleModal = () => {
    setOgScheduledFor(scheduledFor);
    toggleScheduleModal(true);
  };

  return (
    <>
      {(includeTitle || includeScheduledFor) && (
        <div>
          {includeTitle && (
            <InputRoot>
              <Label.Root htmlFor={titleFieldPath}>Title</Label.Root>
              <Input maxLength={49} {...form.register(titleFieldPath)} />
            </InputRoot>
          )}
          {includeScheduledFor && (
            <Modal.Root onOpenChange={cancelScheduleModal} open={scheduleModal}>
              <Modal.Trigger asChild onClick={(e) => e.preventDefault()}>
                <Button
                  className="mt-4 w-full pl-3"
                  colorScheme="transparent"
                  onClick={openScheduleModal}
                >
                  <ClockIcon className="w-5" />
                  {scheduledFor ? (
                    <span>
                      Scheduled for{' '}
                      <DateTime date={scheduledFor} formatter="date-time" />
                    </span>
                  ) : (
                    'Schedule'
                  )}
                </Button>
              </Modal.Trigger>
              <Modal.Portal>
                <Modal.Overlay>
                  <Modal.Content className="max-w-sm p-8 text-center">
                    <Modal.Title className="text-2xl">
                      Schedule session
                    </Modal.Title>
                    <Modal.Description className="mt-4 px-4 text-fg-4">
                      Scheduled sessions are not visible to clients until the
                      specified time.
                    </Modal.Description>
                    <div className="mt-16 flex flex-col gap-4">
                      <Input
                        // hack to keep height on ios when input is empty
                        className="h-[2.625em]"
                        min={formatDatetimeLocal(new Date(), {
                          seconds: false,
                        })}
                        onKeyDown={(e) => {
                          if (e.key !== 'Enter') return;
                          e.preventDefault();
                          toggleScheduleModal(false);
                        }}
                        step={60}
                        type="datetime-local"
                        {...form.register(scheduledForFieldPath)}
                      />
                      <div className="flex gap-4">
                        <Button
                          className="w-full"
                          colorScheme="transparent"
                          disabled={!scheduledFor}
                          onClick={() => {
                            form.setValue(
                              scheduledForFieldPath,
                              null as Form.PathValue<T, Form.Path<T>>,
                              { shouldDirty: true },
                            );

                            toggleScheduleModal(false);
                          }}
                        >
                          Clear
                        </Button>
                        <Button
                          className="w-full"
                          disabled={!scheduledFor}
                          onClick={() => toggleScheduleModal(false)}
                        >
                          Schedule
                        </Button>
                      </div>
                      <Modal.Close asChild onClick={(e) => e.preventDefault()}>
                        <Button
                          className="m-0 -mb-3 w-full justify-center p-0 py-3"
                          onClick={cancelScheduleModal}
                          variant="link"
                        >
                          Close
                        </Button>
                      </Modal.Close>
                    </div>
                  </Modal.Content>
                </Modal.Overlay>
              </Modal.Portal>
            </Modal.Root>
          )}
        </div>
      )}
      <div>
        <ul className="space-y-4">
          <DndCore.DndContext
            collisionDetection={DndCore.closestCenter}
            id="modules"
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={({ active, over }: DndCore.DragEndEvent) => {
              if (!over || active.id === over.id) return;

              modulesArray.move(
                modulesArray.fields.findIndex((f) => f.key === active.id),
                modulesArray.fields.findIndex((f) => f.key === over.id),
              );
            }}
            sensors={sensors}
          >
            <DndSortable.SortableContext
              items={modulesArray.fields.map((eventType) => eventType.key)}
              strategy={DndSortable.verticalListSortingStrategy}
            >
              {modulesArray.fields.map((module, i) => (
                <ModuleFormSection<T, Form.ArrayPath<T>>
                  availableInputs={availableInputs}
                  availableTemplates={availableModuleTemplates}
                  fieldPath={`${modulesFieldPath}[${i}]` as Form.FieldPath<T>}
                  form={form}
                  hasOnlyOne={modulesArray.fields.length === 1}
                  key={module.key}
                  moduleArray={modulesArray}
                  moduleIndex={i}
                  moduleKey={module.key}
                  subjectId={subjectId}
                  subjects={subjects}
                />
              ))}
            </DndSortable.SortableContext>
          </DndCore.DndContext>
        </ul>
      </div>
      <div className="flex items-center gap-4">
        <Tip side="right">
          Modules break up your sessions into sections with inputs. You can add
          as many modules as you need.
        </Tip>
        <Button
          className="w-full"
          colorScheme="transparent"
          onClick={() =>
            modulesArray.append({
              content: '',
              inputs: [],
              name: '',
            } as Form.FieldArray<T, Form.ArrayPath<T>>)
          }
        >
          <PlusIcon className="w-5" />
          Add module
        </Button>
      </div>
    </>
  );
};

export default SessionFormSection;
