'use client';

import Select from '(components)/select';
import { TemplateType } from '(types)/template';
import EventTypes from '(utilities)/enum-event-types';
import TemplateTypes from '(utilities)/enum-template-types';
import { ListInputsData } from '(utilities)/list-inputs';
import { ListTemplatesData } from '(utilities)/list-templates';
import { FieldValues, useFieldArray, UseFormReturn } from 'react-hook-form';
import RoutineFormSection from './routine-form-section';

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

interface RoutinesFormSection<T extends FieldValues> {
  form: UseFormReturn<T>;
  inputOptions: NonNullable<ListInputsData>;
  routineEventsMap: Record<string, any>;
  sessionIndex: number;
  templateOptions: NonNullable<ListTemplatesData>;
  userId: string;
}

const RoutinesFormSection = <T extends FieldValues>({
  form,
  inputOptions,
  routineEventsMap,
  sessionIndex,
  templateOptions,
  userId,
}: RoutinesFormSection<T>) => {
  const name = `routines.${sessionIndex}`;

  const eventTypeArray = useFieldArray({
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
              eventTypeArray.move(
                eventTypeArray.fields.findIndex((f) => f.key === active.id),
                eventTypeArray.fields.findIndex((f) => f.key === over.id)
              );
            }
          }}
          sensors={sensors}
        >
          <SortableContext
            items={eventTypeArray.fields.map((eventType) => eventType.key)}
            strategy={verticalListSortingStrategy}
          >
            {eventTypeArray.fields.map((eventType, eventTypeIndex) => (
              <RoutineFormSection<T>
                eventType={eventType}
                eventTypeArray={eventTypeArray}
                eventTypeIndex={eventTypeIndex}
                form={form}
                inputOptions={inputOptions}
                key={eventType.key}
                name={name}
                routineEventsMap={routineEventsMap}
                sessionIndex={sessionIndex}
                userId={userId}
              />
            ))}
          </SortableContext>
        </DndContext>
      </ul>
      <Select
        instanceId={`${name}Template`}
        isCreatable
        noOptionsMessage={() => 'No templates—type to add a routine'}
        onChange={(e) => {
          const template = e as TemplateType;

          eventTypeArray.append({
            content: template?.data?.content || '',
            inputs: inputOptions.filter((input) =>
              template?.data?.inputIds?.includes(input.id)
            ),
            name: template?.name,
            type: EventTypes.Routine,
          } as T[string]);
        }}
        onCreateOption={async (value: unknown) =>
          eventTypeArray.append({
            content: value,
            inputs: [],
            type: EventTypes.Routine,
          } as T[string])
        }
        options={templateOptions.filter(
          (template) => template.type === TemplateTypes.Routine
        )}
        placeholder="Add routine"
        value={null}
      />
    </>
  );
};

export default RoutinesFormSection;
