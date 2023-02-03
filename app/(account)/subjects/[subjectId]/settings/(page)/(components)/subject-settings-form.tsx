'use client';

import Button from '(components)/button';
import { LabelSpan } from '(components)/label';
import Select from '(components)/select';
import { Database } from '(types)/database';
import { EventTemplate } from '(types)/event-template';
import supabase from '(utilities)/browser-supabase-client';
import CacheKeys from '(utilities)/enum-cache-keys';
import EventTypes from '(utilities)/enum-event-types';
import TemplateTypes from '(utilities)/enum-template-types';
import forceArray from '(utilities)/force-array';
import formatCacheLink from '(utilities)/format-cache-link';
import useDefaultValues from '(utilities)/get-default-values';
import { GetSubjectWithEventTypesData } from '(utilities)/get-subject-with-event-types-and-missions';
import globalValueCache from '(utilities)/global-value-cache';
import { ListTemplatesData } from '(utilities)/list-templates';
import uploadSubjectAvatar from '(utilities)/upload-subject-avatar';
import useAvatarDropzone from '(utilities)/use-avatar-dropzone';
import useBackLink from '(utilities)/use-back-link';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import { PencilIcon, PlusIcon } from '@heroicons/react/24/outline';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import SubjectDetailsFormSection from '../../../../(components)/subject-details-form-section';

interface SubjectSettingsFormProps {
  availableTemplates: ListTemplatesData;
  subject: NonNullable<GetSubjectWithEventTypesData>;
}

type SubjectSettingsFormValues =
  Database['public']['Tables']['subjects']['Row'];

const SubjectSettingsForm = ({
  availableTemplates,
  subject,
}: SubjectSettingsFormProps) => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const backLink = useBackLink({ useCache: true });
  const dropzone = useAvatarDropzone();
  const eventTypes = forceArray(subject.event_types);
  const missions = forceArray(subject.missions);
  const router = useRouter();
  const routines = eventTypes.filter((e) => e.type === EventTypes.Routine);

  const observations = eventTypes.filter(
    (e) => e.type === EventTypes.Observation
  );

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.SubjectSettingsForm,
    defaultValues: { id: subject.id, name: subject.name },
  });

  const form = useForm<SubjectSettingsFormValues>({ defaultValues });

  const saveToCache = () =>
    globalValueCache.set(CacheKeys.SubjectSettingsForm, form.getValues());

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(async ({ id, name }) => {
        const { error: subjectError } = await supabase
          .from('subjects')
          .upsert({ id, name: name.trim() });

        if (subjectError) {
          alert(subjectError.message);
          return;
        }

        await uploadSubjectAvatar({ dropzone, subjectId: id });
        await redirect(`/subjects/${id}`);
      })}
    >
      <SubjectDetailsFormSection<SubjectSettingsFormValues>
        dropzone={dropzone}
        file={dropzone.acceptedFiles[0] ?? subject?.image_uri}
        form={form}
      />
      <section>
        <LabelSpan className="pb-2">Missions</LabelSpan>
        {!!missions.length && (
          <ul className="mb-3 space-y-3">
            {missions.map((mission) => (
              <li key={mission.id}>
                <Button
                  className="w-full justify-between"
                  colorScheme="transparent"
                  href={`/subjects/${subject.id}/settings/mission/${mission.id}?back=${backLink}`}
                  onClick={saveToCache}
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
          onClick={saveToCache}
          type="button"
        >
          <PlusIcon className="w-5" />
          Add mission
        </Button>
      </section>
      <section>
        <LabelSpan className="pb-2">Routines</LabelSpan>
        {!!routines.length && (
          <ul className="mb-3 space-y-3">
            {routines.map((routine) => (
              <li key={routine.id}>
                <Button
                  className="w-full justify-between"
                  colorScheme="transparent"
                  href={`/subjects/${subject.id}/settings/routine/${routine.id}?back=${backLink}`}
                  onClick={saveToCache}
                >
                  {routine.name}
                  <PencilIcon className="w-5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
        <Select
          creatable
          instanceId="routineTemplate"
          noOptionsMessage={() => null}
          onChange={(e) => {
            saveToCache();

            globalValueCache.set(CacheKeys.EventTypeForm, {
              order: routines.length,
            });

            const template = e as EventTemplate;

            router.push(
              formatCacheLink({
                backLink,
                path: `/subjects/${subject.id}/settings/routine?templateId=${template.id}`,
              })
            );
          }}
          onCreateOption={async (value: unknown) => {
            saveToCache();

            globalValueCache.set(CacheKeys.EventTypeForm, {
              name: value,
              order: routines.length,
            });

            router.push(
              formatCacheLink({
                backLink,
                path: `/subjects/${subject.id}/settings/routine`,
                useCache: true,
              })
            );
          }}
          options={forceArray(availableTemplates).filter(
            (template) => template.type === TemplateTypes.Routine
          )}
          placeholder="Add routine"
          value={null}
        />
      </section>
      <section>
        <LabelSpan className="pb-2">Observations</LabelSpan>
        {!!observations.length && (
          <ul className="mb-3 space-y-3">
            {observations.map((observation) => (
              <li key={observation.id}>
                <Button
                  className="w-full justify-between"
                  colorScheme="transparent"
                  href={`/subjects/${subject.id}/settings/observation/${observation.id}?back=${backLink}`}
                  onClick={saveToCache}
                >
                  {observation.name}
                  <PencilIcon className="w-5" />
                </Button>
              </li>
            ))}
          </ul>
        )}
        <Select
          creatable
          instanceId="observationTemplate"
          noOptionsMessage={() => null}
          onChange={(e) => {
            saveToCache();

            globalValueCache.set(CacheKeys.EventTypeForm, {
              order: observations.length,
            });

            const template = e as EventTemplate;

            router.push(
              formatCacheLink({
                backLink,
                path: `/subjects/${subject.id}/settings/observation?templateId=${template.id}`,
              })
            );
          }}
          onCreateOption={async (value: unknown) => {
            saveToCache();

            globalValueCache.set(CacheKeys.EventTypeForm, {
              name: value,
              order: observations.length,
            });

            router.push(
              formatCacheLink({
                backLink,
                path: `/subjects/${subject.id}/settings/observation`,
                useCache: true,
              })
            );
          }}
          options={forceArray(availableTemplates).filter(
            (template) => template.type === TemplateTypes.Observation
          )}
          placeholder="Add observation"
          value={null}
        />
      </section>
      <Button
        className="mt-6 w-full"
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
};

export default SubjectSettingsForm;
