'use client';

import Avatar from 'components/avatar';
import Button from 'components/button';
import Input from 'components/input';
import Label from 'components/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';
import { Database } from 'types/database';
import { EventTemplate } from 'types/event-template';
import supabase from 'utilities/browser-supabase-client';
import EventTypes from 'utilities/enum-event-types';
import TemplateTypes from 'utilities/enum-template-types';
import forceArray from 'utilities/force-array';
import { GetSubjectWithEventTypesData } from 'utilities/get-subject-with-event-types';
import { ListInputsData } from 'utilities/list-inputs';
import { ListTemplatesData } from 'utilities/list-templates';
import sanitizeHtml from 'utilities/sanitize-html';
import sleep from 'utilities/sleep';
import EventTypesFormSection from '../../components/event-types-form-section';

interface SubjectFormProps {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesData;
  subject?: GetSubjectWithEventTypesData;
}

type EventType = Database['public']['Tables']['event_types']['Insert'] & {
  inputs: Database['public']['Tables']['inputs']['Row'][];
};

type SubjectFormValues = Database['public']['Tables']['subjects']['Insert'] & {
  observationTemplate: EventTemplate | null;
  observations: EventType[];
  routineTemplate: EventTemplate | null;
  routines: EventType[];
};

const SubjectForm = ({
  availableInputs,
  availableTemplates,
  subject,
}: SubjectFormProps) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const eventTypes = forceArray(subject?.event_types);

  const form = useForm<SubjectFormValues>({
    defaultValues: {
      id: subject?.id,
      name: subject?.name ?? '',
      observationTemplate: null,
      observations: eventTypes.filter(
        ({ type }) => type === EventTypes.Observation
      ),
      routineTemplate: null,
      routines: eventTypes.filter(({ type }) => type === EventTypes.Routine),
    },
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
      onSubmit={form.handleSubmit(
        async ({ id, name, observations, routines }) => {
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

          const reduceEventTypes = (
            acc: {
              insertedEventTypes: Database['public']['Tables']['event_types']['Insert'][];
              updatedEventTypes: Database['public']['Tables']['event_types']['Insert'][];
            },
            eventType: Database['public']['Tables']['event_types']['Insert'],
            order: number
          ) => {
            const eventTypePayload: Database['public']['Tables']['event_types']['Insert'] =
              {
                content: sanitizeHtml(eventType.content),
                name: eventType.name,
                order,
                subject_id: subjectData.id,
                template_id: eventType.template_id,
                type: eventType.type,
              };

            if (eventType.id) {
              eventTypePayload.id = eventType.id;
              acc.updatedEventTypes.push(eventTypePayload);
            } else {
              acc.insertedEventTypes.push(eventTypePayload);
            }

            return acc;
          };

          const { insertedEventTypes, updatedEventTypes } = routines.reduce(
            reduceEventTypes,
            observations.reduce(reduceEventTypes, {
              insertedEventTypes:
                [] as Database['public']['Tables']['event_types']['Insert'][],
              updatedEventTypes:
                [] as Database['public']['Tables']['event_types']['Insert'][],
            })
          );

          if (updatedEventTypes.length) {
            const { error: updateEventTypesError } = await supabase
              .from('event_types')
              .upsert(updatedEventTypes);

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

            const attachEventTypeIds = (
              eventType: SubjectFormValues['observations' | 'routines'][number]
            ) => {
              if (eventType.id) return eventType;
              eventType.id = insertEventTypesDataReverse.pop()?.id;
              return eventType;
            };

            form.setValue('observations', observations.map(attachEventTypeIds));
            form.setValue('routines', routines.map(attachEventTypeIds));
          }

          const { deleteEventTypeInputs, insertEventTypeInputs } = observations
            .concat(routines)
            .reduce(
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

          await router.push(
            searchParams.get('back') ?? `/subjects/${subjectData.id}`
          );

          await router.refresh();
          await sleep();
        }
      )}
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
      <EventTypesFormSection<SubjectFormValues>
        form={form}
        inputOptions={availableInputs}
        label="Observations"
        name="observations"
        templateOptions={availableTemplates}
        templateType={TemplateTypes.Observation}
        type={EventTypes.Observation}
      />
      <EventTypesFormSection<SubjectFormValues>
        form={form}
        inputOptions={availableInputs}
        label="Routines"
        name="routines"
        templateOptions={availableTemplates}
        templateType={TemplateTypes.Routine}
        type={EventTypes.Routine}
      />
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
