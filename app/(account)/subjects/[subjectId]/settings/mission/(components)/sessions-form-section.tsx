import Button from '(components)/button';
import { ListInputsData } from '(utilities)/list-inputs';
import { ListTemplatesData } from '(utilities)/list-templates';
import { PlusIcon } from '@heroicons/react/24/outline';
import { FieldValues, useFieldArray, UseFormReturn } from 'react-hook-form';
import SessionFormSection from './session-form-section';

interface SessionsFormSectionProps<T extends FieldValues> {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesData;
  form: UseFormReturn<T>;
  routineEventsMap: Record<string, any>;
  subjectId: string;
}

const SessionsFormSection = <T extends FieldValues>({
  availableInputs,
  availableTemplates,
  form,
  routineEventsMap,
  subjectId,
}: SessionsFormSectionProps<T>) => {
  const sessionArray = useFieldArray({
    control: form.control,
    name: 'routines' as T[string],
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
            />
          ))}
        </ul>
      )}
      <Button
        className="mt-4 w-full"
        colorScheme="transparent"
        onClick={() => sessionArray.append([[]] as any)}
        type="button"
      >
        <PlusIcon className="w-5" />
        Add session
      </Button>
    </>
  );
};

export default SessionsFormSection;
