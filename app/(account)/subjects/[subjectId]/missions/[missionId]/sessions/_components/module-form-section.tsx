import EventTypeFormSection from '@/(account)/subjects/[subjectId]/_components/event-type-form-section';
import CacheKeys from '@/_constants/enum-cache-keys';
import { GetSessionData } from '@/_server/get-session';
import { ListInputsData } from '@/_server/list-inputs';
import { ListTemplatesWithDataData } from '@/_server/list-templates-with-data';
import { useSortable } from '@dnd-kit/sortable';
import { twMerge } from 'tailwind-merge';

import {
  FieldValues,
  UseFieldArrayReturn,
  UseFormReturn,
} from 'react-hook-form';

interface ModuleFormSectionProps<T extends FieldValues> {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesWithDataData;
  event: GetSessionData['modules'][0]['event'];
  eventTypeArray: UseFieldArrayReturn<T, T['modules'], 'key'>;
  eventTypeIndex: number;
  eventTypeKey: string;
  form: UseFormReturn<T>;
  hasOnlyOne?: boolean;
}

const ModuleFormSection = <T extends FieldValues>({
  availableInputs,
  availableTemplates,
  event,
  eventTypeArray,
  eventTypeIndex,
  eventTypeKey,
  form,
  hasOnlyOne,
}: ModuleFormSectionProps<T>) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: eventTypeKey });

  return (
    <li
      className={twMerge(
        'form relative gap-0 p-0',
        isDragging && 'z-10 shadow-2xl',
      )}
      ref={setNodeRef}
      style={{
        transform: transform
          ? isDragging
            ? `translate(${transform.x}px, ${transform.y}px) scale(1.02)`
            : `translate(${transform.x}px, ${transform.y}px)`
          : undefined,
        transition,
      }}
    >
      <EventTypeFormSection
        attributes={attributes}
        availableInputs={availableInputs}
        availableTemplates={availableTemplates}
        cacheKey={CacheKeys.SessionForm}
        event={event}
        eventTypeArray={eventTypeArray}
        eventTypeIndex={eventTypeIndex}
        form={form}
        hasOnlyOne={hasOnlyOne}
        listeners={listeners}
        moduleNumber={eventTypeIndex + 1}
        namePrefix={`modules[${eventTypeIndex}].`}
      />
    </li>
  );
};

export default ModuleFormSection;
