'use client';

import IconButton from '@/(account)/_components/icon-button';
import Select from '@/(account)/_components/select';
import { GetMissionWithEventTypesData } from '@/(account)/_server/get-mission-with-event-types';
import { ListInputsData } from '@/(account)/_server/list-inputs';
import { ListTemplatesData } from '@/(account)/_server/list-templates';
import { TemplateType } from '@/(account)/_types/template';
import { PlusIcon } from '@heroicons/react/24/outline';
import { FieldValues, useFieldArray, UseFormReturn } from 'react-hook-form';
import PartFormSection from './part-form-section';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface PartsFormSection<T extends FieldValues> {
  eventsMap: Record<
    string,
    GetMissionWithEventTypesData['sessions'][0]['parts'][0]['event']
  >;
  form: UseFormReturn<T>;
  inputOptions: NonNullable<ListInputsData>;
  sessionIndex: number;
  templateOptions: NonNullable<ListTemplatesData>;
  userId?: string;
}

const PartsFormSection = <T extends FieldValues>({
  eventsMap,
  form,
  inputOptions,
  sessionIndex,
  templateOptions,
  userId,
}: PartsFormSection<T>) => {
  const name = `sessions.${sessionIndex}.parts`;

  const partsArray = useFieldArray({
    control: form.control,
    keyName: 'key',
    name: name as T[string],
  });

  const sensors = useSensors(useSensor(PointerSensor));

  return (
    <>
      <ul>
        <DndContext
          collisionDetection={closestCenter}
          id={name}
          onDragEnd={(event: DragEndEvent) => {
            const { active, over } = event;

            if (over && active.id !== over.id) {
              partsArray.move(
                partsArray.fields.findIndex((f) => f.key === active.id),
                partsArray.fields.findIndex((f) => f.key === over.id)
              );
            }
          }}
          sensors={sensors}
        >
          <SortableContext
            items={partsArray.fields.map((eventType) => eventType.key)}
            strategy={verticalListSortingStrategy}
          >
            {partsArray.fields.map((eventType, eventTypeIndex) => (
              <PartFormSection<T>
                eventTypeArray={partsArray}
                eventTypeId={
                  (
                    eventType as GetMissionWithEventTypesData['sessions'][0]['parts'][0]
                  ).id
                }
                eventTypeIndex={eventTypeIndex}
                eventTypeKey={eventType.key}
                eventsMap={eventsMap}
                form={form}
                inputOptions={inputOptions}
                key={eventType.key}
                name={name}
                sessionIndex={sessionIndex}
                userId={userId}
              />
            ))}
          </SortableContext>
        </DndContext>
      </ul>
      <div className="flex items-center gap-4">
        <div className="flex-grow">
          <Select
            instanceId={`${name}Template`}
            noOptionsMessage={() => 'No templates'}
            onChange={(e) => {
              const template = e as TemplateType;
              if (!template) return;

              partsArray.append({
                content: template?.data?.content || '',
                inputs: inputOptions.filter((input) =>
                  template?.data?.inputIds?.includes(input.id)
                ),
              } as T[string]);
            }}
            options={templateOptions}
            placeholder="Add from template…"
            value={null}
          />
        </div>
        <span className="text-fg-3">or</span>
        <IconButton
          className="p-2"
          colorScheme="transparent"
          icon={<PlusIcon className="m-0.5 w-5" />}
          label="Add event type"
          onClick={() =>
            partsArray.append({
              content: '',
              inputs: [],
            } as T[string])
          }
          type="button"
          variant="primary"
        />
      </div>
    </>
  );
};

export default PartsFormSection;
