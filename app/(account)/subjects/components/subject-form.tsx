'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import Avatar from 'components/avatar';
import Button from 'components/button';
import Input from 'components/input';
import Label from 'components/label';
import RichTextarea from 'components/rich-textarea';
import Select from 'components/select';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Database } from 'types/database';
import { EventTemplate } from 'types/event-template';
import supabase from 'utilities/browser-supabase-client';
import forceArray from 'utilities/force-array';
import { GetSubjectWithEventTypesData } from 'utilities/get-subject-with-event-types';
import { ListInputsData } from 'utilities/list-inputs';
import { ListTemplatesData } from 'utilities/list-templates';
import sleep from 'utilities/sleep';

interface SubjectFormProps {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesData;
  subject?: GetSubjectWithEventTypesData;
}

type SubjectFormValues = Database['public']['Tables']['subjects']['Insert'] & {
  eventTypes: (Database['public']['Tables']['event_types']['Insert'] & {
    inputs: Database['public']['Tables']['inputs']['Row'][];
  })[];
};

const SubjectForm = ({
  availableInputs,
  availableTemplates,
  subject,
}: SubjectFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [template, setTemplate] = useState<EventTemplate | null>(null);

  const form = useForm<SubjectFormValues>({
    defaultValues: {
      eventTypes: forceArray(subject?.event_types),
      id: subject?.id,
      name: subject?.name ?? '',
    },
  });

  const eventTypesArray = useFieldArray({
    control: form.control,
    name: 'eventTypes',
  });

  const dropzone = useDropzone({
    accept: { 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] },
    maxSize: 10000000,
    multiple: false,
    noClick: true,
  });

  const coverImage = dropzone.acceptedFiles[0] ?? subject?.image_uri;

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(async ({ id, name, eventTypes }) => {
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .upsert({ id, name })
          .select('id')
          .single();

        if (subjectError) {
          alert(subjectError.message);
          return;
        }

        form.setValue('id', subjectData.id);

        const { insertedEventTypes, updateEventTypes } = eventTypes.reduce(
          (acc, eventType, order) => {
            const eventTypePayload: Database['public']['Tables']['event_types']['Insert'] =
              {
                content: eventType.content,
                name: eventType.name,
                order,
                subject_id: subjectData.id,
              };

            if (eventType.id) {
              eventTypePayload.id = eventType.id;
              acc.updateEventTypes.push(eventTypePayload);
            } else {
              acc.insertedEventTypes.push(eventTypePayload);
            }

            return acc;
          },
          {
            insertedEventTypes:
              [] as Database['public']['Tables']['event_types']['Insert'][],
            updateEventTypes:
              [] as Database['public']['Tables']['event_types']['Insert'][],
          }
        );

        if (updateEventTypes.length) {
          const { error: updateEventTypesError } = await supabase
            .from('event_types')
            .upsert(updateEventTypes);

          if (updateEventTypesError) {
            alert(updateEventTypesError.message);
            return;
          }
        }

        if (insertedEventTypes.length) {
          const { data: insertEventTypesData, error: insertEventTypesError } =
            await supabase
              .from('event_types')
              .insert(insertedEventTypes)
              .select('id');

          if (insertEventTypesError) {
            alert(insertEventTypesError.message);
            return;
          }

          const insertEventTypesDataReverse = insertEventTypesData.reverse();

          form.setValue(
            'eventTypes',
            form.getValues().eventTypes.map((eventType) => {
              if (eventType.id) return eventType;

              return {
                ...eventType,
                id: insertEventTypesDataReverse.pop()?.id,
              };
            })
          );
        }

        const { deleteEventTypeInputs, insertEventTypeInputs } = form
          .getValues()
          .eventTypes.reduce(
            (acc, eventType) => {
              if (eventType.id) {
                acc.deleteEventTypeInputs.push(eventType.id);
              }

              eventType.inputs.forEach((input, order) => {
                if (!eventType.id) return;

                acc.insertEventTypeInputs.push({
                  event_type_id: eventType.id,
                  input_id: input.id,
                  order,
                });
              });

              return acc;
            },
            {
              deleteEventTypeInputs: [] as string[],
              insertEventTypeInputs:
                [] as Database['public']['Tables']['event_type_inputs']['Insert'][],
            }
          );

        if (deleteEventTypeInputs.length) {
          const { error: deleteEventTypeInputsError } = await supabase
            .from('event_type_inputs')
            .delete()
            .in('event_type_id', deleteEventTypeInputs);

          if (deleteEventTypeInputsError) {
            alert(deleteEventTypeInputsError.message);
            return;
          }
        }

        if (insertEventTypeInputs.length) {
          const { error: insertEventTypeInputsError } = await supabase
            .from('event_type_inputs')
            .insert(insertEventTypeInputs);

          if (insertEventTypeInputsError) {
            alert(insertEventTypeInputsError.message);
            return;
          }
        }

        if (dropzone.acceptedFiles.length) {
          const ext = dropzone.acceptedFiles[0].name.split('.').pop();

          await supabase.storage
            .from('subjects')
            .upload(
              `${subjectData.id}/image.${ext}`,
              dropzone.acceptedFiles[0],
              {
                upsert: true,
              }
            );
        }

        await router.push(searchParams.get('back') ?? '/subjects');
        await router.refresh();
        await sleep();
      })}
    >
      <Label>
        Name
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => <Input {...field} />}
        />
      </Label>
      <Label>
        Profile image
        <div
          className="flex cursor-pointer items-center justify-center gap-6 rounded border-2 border-dashed border-alpha-2 px-4 py-9 ring-accent-2 hover:border-alpha-3 focus:outline-none focus:ring-1"
          {...dropzone.getRootProps()}
        >
          <Avatar file={coverImage} name={form.watch('name')} />
          <p>
            Drag image here or <span className="text-fg-1">browse</span>
          </p>
          <input {...dropzone.getInputProps()} />
        </div>
      </Label>
      <fieldset>
        <legend className="mb-2 text-fg-2">Event types</legend>
        <ul>
          {eventTypesArray.fields.map((eventType, index) => (
            <li className="mb-3" key={eventType.id}>
              <Controller
                control={form.control}
                name={`eventTypes.${index}.name`}
                render={({ field }) => (
                  <Input
                    aria-label="EventType name"
                    className="rounded-b-none"
                    placeholder="Name"
                    {...field}
                  />
                )}
              />
              <Controller
                control={form.control}
                name={`eventTypes.${index}.content`}
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
                name={`eventTypes.${index}.inputs`}
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
            name="template"
            onChange={(template) => setTemplate(template as EventTemplate)}
            options={availableTemplates ?? []}
            placeholder="No template"
            value={template}
          />
          <Button
            className="shrink-0 rounded-l-none border-l-0 pl-6"
            colorScheme="transparent"
            onClick={() => {
              eventTypesArray.append({
                content: template?.data?.content ?? '',
                inputs: forceArray(availableInputs).filter((input) =>
                  template?.data?.inputIds?.includes(input.id)
                ),
                name: template?.name ?? '',
                order: eventTypesArray.fields.length,
                subject_id: form.getValues().id ?? '',
              });

              setTemplate(null);
            }}
            size="sm"
            type="button"
          >
            Add
            <PlusIcon className="w-5" />
          </Button>
        </div>
      </fieldset>
      <Button
        className="mt-6 w-full"
        loading={form.formState.isSubmitting}
        loadingText="Saving…"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
};

export default SubjectForm;
