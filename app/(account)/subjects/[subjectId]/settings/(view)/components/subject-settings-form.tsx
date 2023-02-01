'use client';

import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import Button from 'components/button';
import { useForm } from 'react-hook-form';
import { Database } from 'types/database';
import { EventTemplate } from 'types/event-template';
import supabase from 'utilities/browser-supabase-client';
import EventTypes from 'utilities/enum-event-types';
import TemplateTypes from 'utilities/enum-template-types';
import forceArray from 'utilities/force-array';
import useDefaultValues from 'utilities/get-default-values';
import { GetSubjectWithEventTypesData } from 'utilities/get-subject-with-event-types-and-missions';
import globalValueCache from 'utilities/global-value-cache';
import { ListInputsData } from 'utilities/list-inputs';
import { ListTemplatesData } from 'utilities/list-templates';
import sanitizeHtml from 'utilities/sanitize-html';
import uploadSubjectAvatar from 'utilities/upload-subject-avatar';
import useAvatarDropzone from 'utilities/use-avatar-dropzone';
import useBackLink from 'utilities/use-back-link';
import useSubmitRedirect from 'utilities/use-submit-redirect';
import EventTypesFormSection from '../../../../../components/event-types-form-section';
import SubjectDetailsFormSection from '../../../../components/subject-details-form-section';

interface SubjectSettingsFormProps {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesData;
  subject: NonNullable<GetSubjectWithEventTypesData>;
}

type EventType = Database['public']['Tables']['event_types']['Row'] & {
  inputs: Database['public']['Tables']['inputs']['Row'][];
};

type SubjectSettingsFormValues =
  Database['public']['Tables']['subjects']['Row'] & {
    observationTemplate: EventTemplate | null;
    observations: EventType[];
    routineTemplate: EventTemplate | null;
    routines: EventType[];
  };

const SubjectSettingsForm = ({
  availableInputs,
  availableTemplates,
  subject,
}: SubjectSettingsFormProps) => {
  const backLink = useBackLink({ useCache: 'true' });
  const dropzone = useAvatarDropzone();
  const eventTypes = forceArray(subject.event_types);
  const missions = forceArray(subject.missions);
  const submitRedirect = useSubmitRedirect();

  const defaultValues = useDefaultValues({
    cacheKey: 'subject_settings_form_values',
    defaultValues: {
      id: subject.id,
      name: subject.name,
      observationTemplate: null,
      observations: eventTypes.filter((e) => e.type === EventTypes.Observation),
      routineTemplate: null,
      routines: eventTypes.filter((e) => e.type === EventTypes.Routine),
    },
  });

  const form = useForm<SubjectSettingsFormValues>({ defaultValues });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(
        async ({ id, name, observations, routines }) => {
          const { data: subjectData, error: subjectError } = await supabase
            .from('subjects')
            .upsert({ id, name: name.trim() })
            .select('id')
            .single();

          if (subjectError) {
            alert(subjectError.message);
            return;
          }

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
                name: (eventType.name ?? '').trim(),
                order,
                subject_id: subjectData.id,
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

          const deletedEventTypeIds = eventTypes.reduce((acc, eventType) => {
            if (!updatedEventTypes.some(({ id }) => id === eventType.id)) {
              acc.push(eventType.id);
            }

            return acc;
          }, [] as string[]);

          if (deletedEventTypeIds.length) {
            const { error: deletedEventTypesError } = await supabase
              .from('event_types')
              .update({ deleted: true })
              .in('id', deletedEventTypeIds);

            if (deletedEventTypesError) {
              alert(deletedEventTypesError.message);
              return;
            }
          }

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
              eventType: SubjectSettingsFormValues[
                | 'observations'
                | 'routines'][number]
            ) => {
              if (eventType.id) return eventType;
              eventType.id = insertEventTypesDataReverse.pop()?.id as string;
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

          await uploadSubjectAvatar({ dropzone, subjectId: id });
          await submitRedirect(`/subjects/${id}`);
        }
      )}
    >
      <SubjectDetailsFormSection<SubjectSettingsFormValues>
        dropzone={dropzone}
        file={dropzone.acceptedFiles[0] ?? subject?.image_uri}
        form={form}
      />
      <section>
        <h1 className="mb-2 text-fg-2">Missions</h1>
        {!!missions.length && (
          <ul className="mb-3 space-y-3">
            {missions.map((mission) => (
              <li key={mission.id}>
                <Button
                  className="w-full justify-between"
                  colorScheme="transparent"
                  href={`/subjects/${subject.id}/settings/mission/${mission.id}?back=${backLink}`}
                  onClick={() =>
                    globalValueCache.set(
                      'subject_settings_form_values',
                      form.getValues()
                    )
                  }
                >
                  {mission.name}
                  <PencilIcon className="w-5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
        <Button
          className="w-full"
          colorScheme="transparent"
          href={`/subjects/${subject.id}/settings/mission?back=${backLink}`}
          onClick={() =>
            globalValueCache.set(
              'subject_settings_form_values',
              form.getValues()
            )
          }
          type="button"
        >
          <PlusIcon className="w-5" />
          Add mission
        </Button>
      </section>
      <EventTypesFormSection<SubjectSettingsFormValues>
        cacheKey="subject_settings_form_values"
        form={form}
        inputOptions={availableInputs}
        label="Observations"
        name="observations"
        templateOptions={availableTemplates}
        templateType={TemplateTypes.Observation}
        type={EventTypes.Observation}
      />
      <EventTypesFormSection<SubjectSettingsFormValues>
        cacheKey="subject_settings_form_values"
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

export default SubjectSettingsForm;
