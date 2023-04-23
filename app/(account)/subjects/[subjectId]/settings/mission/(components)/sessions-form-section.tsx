import Button from '(components)/button';
import { GetMissionWithEventTypesData } from '(utilities)/get-mission-with-routines';
import { ListInputsData } from '(utilities)/list-inputs';
import { ListTemplatesData } from '(utilities)/list-templates';
import { PlusIcon } from '@heroicons/react/24/outline';
import SessionFormSection from './session-form-section';

import {
  FieldArray,
  FieldValues,
  useFieldArray,
  UseFormReturn,
} from 'react-hook-form';

interface SessionsFormSectionProps<T extends FieldValues> {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesData;
  form: UseFormReturn<T>;
  routineEventsMap: Record<
    string,
    GetMissionWithEventTypesData['sessions'][0]['routines'][0]['event']
  >;
  subjectId: string;
  userId: string;
}

const SessionsFormSection = <T extends FieldValues>({
  availableInputs,
  availableTemplates,
  form,
  routineEventsMap,
  subjectId,
  userId,
}: SessionsFormSectionProps<T>) => {
  const sessionArray = useFieldArray({
    control: form.control,
    name: 'sessions' as T[string],
  });

  return (
    <>
      {sessionArray.fields.length > 0 && (
        <ul className="flex flex-col gap-6">
          {sessionArray.fields.map((session, sessionIndex) => (
            <SessionFormSection<T>
              availableInputs={availableInputs}
              availableTemplates={availableTemplates}
              form={form}
              key={session.id}
              routineEventsMap={routineEventsMap}
              sessionArray={sessionArray}
              sessionIndex={sessionIndex}
              subjectId={subjectId}
              userId={userId}
            />
          ))}
        </ul>
      )}
      <Button
        className="mt-8 w-full"
        colorScheme="transparent"
        onClick={() =>
          sessionArray.append({ routines: [] } as FieldArray<T, T[string]>)
        }
        type="button"
      >
        <PlusIcon className="w-5" />
        Add session
      </Button>
    </>
  );
};

export default SessionsFormSection;
