'use client';

import Select from '(components)/select';
import { TemplateType } from '(types)/template';
import TemplateTypes from '(utilities)/enum-template-types';
import { GetMissionWithEventTypesData } from '(utilities)/get-mission-with-routines';
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
  routineEventsMap: Record<
    string,
    GetMissionWithEventTypesData['sessions'][0]['routines'][0]['event']
  >;
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
  const name = `sessions.${sessionIndex}.routines`;

  const routinesArray = useFieldArray({
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
              routinesArray.move(
                routinesArray.fields.findIndex((f) => f.key === active.id),
                routinesArray.fields.findIndex((f) => f.key === over.id)
              );
            }
          }}
          sensors={sensors}
        >
          <SortableContext
            items={routinesArray.fields.map((eventType) => eventType.key)}
            strategy={verticalListSortingStrategy}
          >
            {routinesArray.fields.map((eventType, eventTypeIndex) => (
              <RoutineFormSection<T>
                eventType={eventType}
                eventTypeArray={routinesArray}
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
        noOptionsMessage={() => 'No templates—type to create a routine'}
        onChange={(e) => {
          const template = e as TemplateType;

          routinesArray.append({
            content: template?.data?.content || '',
            inputs: inputOptions.filter((input) =>
              template?.data?.inputIds?.includes(input.id)
            ),
          } as T[string]);
        }}
        onCreateOption={async (value: unknown) =>
          routinesArray.append({
            content: value,
            inputs: [],
          } as T[string])
        }
        options={templateOptions.filter(
          (template) => template.type === TemplateTypes.Routine
        )}
        placeholder="Add routine. Type to create…"
        value={null}
      />
    </>
  );
};

export default RoutinesFormSection;
