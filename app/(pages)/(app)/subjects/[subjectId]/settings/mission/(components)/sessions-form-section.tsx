import Button from '(components)/button';
import formatDatetimeLocal from '(utilities)/format-datetime-local';
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
}

const SessionsFormSection = <T extends FieldValues>({
  availableInputs,
  availableTemplates,
  form,
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
              sessionArray={sessionArray}
              sessionIndex={sessionIndex}
            />
          ))}
        </ul>
      )}
      <Button
        className="mt-8 w-full"
        colorScheme="transparent"
        onClick={() => {
          const sessions = form.watch('sessions' as T[string]);
          const lastScheduledFor = sessions[sessions.length - 1]?.scheduled_for;
          let formattedNewScheduledFor = null;

          if (lastScheduledFor) {
            const newScheduledFor = new Date(lastScheduledFor);
            newScheduledFor.setDate(newScheduledFor.getDate() + 1);

            formattedNewScheduledFor = formatDatetimeLocal(newScheduledFor, {
              seconds: false,
            });
          }

          sessionArray.append({
            routines: [],
            scheduled_for: formattedNewScheduledFor,
          } as FieldArray<T, T[string]>);
        }}
        type="button"
      >
        <PlusIcon className="w-5" />
        Add session
      </Button>
    </>
  );
};

export default SessionsFormSection;
