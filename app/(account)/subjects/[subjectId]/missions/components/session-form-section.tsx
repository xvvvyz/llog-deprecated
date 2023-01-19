import { PlusIcon } from '@heroicons/react/24/solid';
import Button from 'components/button';
import Input from 'components/input';
import RichTextarea from 'components/rich-textarea';
import Select from 'components/select';
import { Dispatch, SetStateAction } from 'react';
import { Controller, useFieldArray, UseFormReturn } from 'react-hook-form';
import { EventTemplate } from 'types/event-template';
import forceArray from 'utilities/force-array';
import { ListInputsData } from 'utilities/list-inputs';
import { ListTemplatesData } from 'utilities/list-templates';
import { MissionFormValues } from './mission-form';

interface SessionFormSectionProps {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesData;
  form: UseFormReturn<MissionFormValues>;
  index: number;
  setTemplate: Dispatch<SetStateAction<EventTemplate | null>>;
  subjectId: string;
  template: EventTemplate | null;
}

const SessionFormSection = ({
  availableInputs,
  availableTemplates,
  form,
  index: sessionIndex,
  setTemplate,
  subjectId,
  template,
}: SessionFormSectionProps) => {
  const routinesArray = useFieldArray({
    control: form.control,
    name: `routines.${sessionIndex}`,
  });

  return (
    <fieldset>
      <legend className="mb-2 text-fg-2">Session {sessionIndex + 1}</legend>
      <ul>
        {routinesArray.fields.map((routine, index) => (
          <li className="mb-3" key={routine.id}>
            <Controller
              control={form.control}
              name={`routines.${sessionIndex}.${index}.name`}
              render={({ field }) => (
                <Input
                  aria-label="Routine name"
                  className="rounded-b-none"
                  placeholder="Name"
                  {...field}
                />
              )}
            />
            <Controller
              control={form.control}
              name={`routines.${sessionIndex}.${index}.content`}
              render={({ field }) => (
                <RichTextarea
                  className="rounded-none border-t-0"
                  placeholder="Content"
                  {...field}
                />
              )}
            />
            <Controller
              control={form.control}
              name={`routines.${sessionIndex}.${index}.inputs`}
              render={({ field }) => (
                <Select
                  className="rounded-t-none border-t-0"
                  isMulti
                  options={availableInputs ?? []}
                  placeholder="Inputs"
                  {...field}
                />
              )}
            />
          </li>
        ))}
      </ul>
      <div className="flex">
        <Select
          className="w-full rounded-r-none"
          name={`routines.${sessionIndex}.template`}
          onChange={(template) => setTemplate(template as EventTemplate)}
          options={availableTemplates ?? []}
          placeholder="No template"
          value={template}
        />
        <Button
          className="shrink-0 rounded-l-none border-l-0 pl-6"
          colorScheme="transparent"
          onClick={() => {
            routinesArray.append({
              content: template?.data?.content ?? '',
              inputs: forceArray(availableInputs).filter((input) =>
                template?.data?.inputIds?.includes(input.id)
              ),
              mission_id: form.getValues().id ?? '',
              name: template?.name ?? '',
              order: routinesArray.fields.length,
              session: sessionIndex + 1,
              subject_id: subjectId,
            });
          }}
          size="sm"
          type="button"
        >
          Add
          <PlusIcon className="w-5" />
        </Button>
      </div>
    </fieldset>
  );
};

export default SessionFormSection;
