'use client';

import SubjectDetailsFormSection from '@/(account)/subjects/_components/subject-details-form-section';
import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import LinkList from '@/_components/link-list';
import Select from '@/_components/select';
import CacheKeys from '@/_constants/enum-cache-keys';
import EventTypes from '@/_constants/enum-event-types';
import TemplateTypes from '@/_constants/enum-template-types';
import useAvatarDropzone from '@/_hooks/use-avatar-dropzone';
import useBackLink from '@/_hooks/use-back-link';
import useDefaultValues from '@/_hooks/use-default-values';
import useSupabase from '@/_hooks/use-supabase';
import { GetSubjectWithEventTypesData } from '@/_server/get-subject-with-event-types-and-missions';
import { ListTemplatesData } from '@/_server/list-templates';
import { Database } from '@/_types/database';
import { TemplateType } from '@/_types/template';
import forceArray from '@/_utilities/force-array';
import formatCacheLink from '@/_utilities/format-cache-link';
import globalValueCache from '@/_utilities/global-value-cache';
import uploadSubjectAvatar from '@/_utilities/upload-subject-avatar';
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useCopyToClipboard, useToggle } from 'usehooks-ts';

import {
  CheckIcon,
  ClipboardDocumentIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';

interface SubjectSettingsFormProps {
  availableTemplates: ListTemplatesData;
  subject: NonNullable<GetSubjectWithEventTypesData>;
}

type SubjectSettingsFormValues =
  Database['public']['Tables']['subjects']['Row'] & {
    avatar?: File | string;
  };

const SubjectSettingsForm = ({
  availableTemplates,
  subject,
}: SubjectSettingsFormProps) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [isCopyingToClipboard, toggleCopyingToClipboard] = useToggle();
  const backLink = useBackLink({ useCache: true });
  const dropzone = useAvatarDropzone();
  const eventTypes = forceArray(subject.event_types);
  const managers = forceArray(subject.managers);
  const missions = forceArray(subject.missions);
  const newObservationTransition = useTransition();
  const newRoutineTransition = useTransition();
  const router = useRouter();
  const routines = eventTypes.filter((e) => e.type === EventTypes.Routine);
  const supabase = useSupabase();

  const observations = eventTypes.filter(
    (e) => e.type === EventTypes.Observation
  );

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.SubjectSettingsForm,
    defaultValues: {
      avatar: subject.image_uri,
      birthdate: subject.birthdate,
      id: subject.id,
      name: subject.name,
      share_code: subject.share_code,
      species: subject.species,
    },
  });

  const form = useForm<SubjectSettingsFormValues>({ defaultValues });

  const saveToCache = () =>
    globalValueCache.set(CacheKeys.SubjectSettingsForm, form.getValues());

  return (
    <form
      className="flex flex-col gap-6 rounded border border-alpha-1 bg-bg-2 px-4 py-8 sm:px-8"
      onSubmit={form.handleSubmit(async (values) => {
        const { error: subjectError } = await supabase.from('subjects').upsert({
          birthdate: values.birthdate,
          id: values.id,
          name: values.name.trim(),
          species: values.species?.trim(),
        });

        if (subjectError) {
          alert(subjectError.message);
          return;
        }

        await uploadSubjectAvatar({
          avatar: values.avatar,
          subjectId: values.id,
          supabase,
        });

        form.reset(values);
      })}
    >
      <SubjectDetailsFormSection<SubjectSettingsFormValues>
        dropzone={dropzone}
        form={form}
      />
      <Button
        className="mb-4 mt-8 w-full"
        loading={form.formState.isSubmitting}
        loadingText="Saving…"
        type="submit"
      >
        Save subject
      </Button>
      <section className="mt-2">
        <h1 className="px-2 text-xl text-fg-1">Missions</h1>
        <p className="mt-2 max-w-xs px-2 leading-tight text-fg-3">
          Missions are a sequence of routines that form a long-term
          modification&nbsp;plan.
        </p>
        {!!missions.length && (
          <LinkList className="mx-0 mt-4">
            {missions.map((mission) => (
              <LinkList.Item
                href={`/subjects/${subject.id}/settings/mission/${mission.id}?back=${backLink}`}
                icon="edit"
                key={mission.id}
                onClick={saveToCache}
                text={mission.name}
              />
            ))}
          </LinkList>
        )}
        <Button
          className="mt-4 w-full"
          colorScheme="transparent"
          href={`/subjects/${subject.id}/settings/mission/create?back=${backLink}`}
          onClick={saveToCache}
          type="button"
        >
          <PlusIcon className="w-5" />
          Create mission
        </Button>
      </section>
      <section className="mt-2">
        <h1 className="px-2 text-xl text-fg-1">Routines</h1>
        <p className="mt-2 max-w-xs px-2 leading-tight text-fg-3">
          Routines are a sequence of actions that can be performed
          at&nbsp;any&nbsp;time.
        </p>
        {!!routines.length && (
          <LinkList className="mx-0 mt-4">
            {routines.map((routine) => (
              <LinkList.Item
                href={`/subjects/${subject.id}/settings/routine/${routine.id}?back=${backLink}`}
                icon="edit"
                key={routine.id}
                onClick={saveToCache}
                text={routine.name}
              />
            ))}
          </LinkList>
        )}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-grow">
            <Select
              instanceId="routineTemplate"
              noOptionsMessage={() => 'No templates'}
              onChange={(e) => {
                saveToCache();

                globalValueCache.set(CacheKeys.EventTypeForm, {
                  order: routines.length,
                });

                const template = e as TemplateType;

                newRoutineTransition[1](() =>
                  router.push(
                    formatCacheLink({
                      backLink,
                      path: `/subjects/${subject.id}/settings/routine/create/from-template/${template.id}`,
                      useCache: true,
                    })
                  )
                );
              }}
              options={forceArray(availableTemplates).filter(
                (template) => template.type === TemplateTypes.Routine
              )}
              placeholder="Create from template…"
              value={null}
            />
          </div>
          <span className="text-fg-3">or</span>
          <IconButton
            className="p-2"
            colorScheme="transparent"
            icon={<PlusIcon className="m-0.5 w-5" />}
            label="Create routine"
            onClick={() => {
              saveToCache();

              globalValueCache.set(CacheKeys.EventTypeForm, {
                order: routines.length,
              });

              newRoutineTransition[1](() =>
                router.push(
                  formatCacheLink({
                    backLink,
                    path: `/subjects/${subject.id}/settings/routine/create`,
                    useCache: true,
                  })
                )
              );
            }}
            type="button"
            variant="primary"
          />
        </div>
      </section>
      <section className="mt-2">
        <h1 className="px-2 text-xl text-fg-1">Observations</h1>
        <p className="mt-2 max-w-xs px-2 leading-tight text-fg-3">
          Observations allow you to track events or behaviors that occur
          over&nbsp;time.
        </p>
        {!!observations.length && (
          <LinkList className="mx-0 mt-4">
            {observations.map((observation) => (
              <LinkList.Item
                href={`/subjects/${subject.id}/settings/observation/${observation.id}?back=${backLink}`}
                icon="edit"
                key={observation.id}
                onClick={saveToCache}
                text={observation.name}
              />
            ))}
          </LinkList>
        )}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-grow">
            <Select
              instanceId="observationTemplate"
              noOptionsMessage={() => 'No templates'}
              onChange={(e) => {
                saveToCache();

                globalValueCache.set(CacheKeys.EventTypeForm, {
                  order: observations.length,
                });

                const template = e as TemplateType;

                newObservationTransition[1](() =>
                  router.push(
                    formatCacheLink({
                      backLink,
                      path: `/subjects/${subject.id}/settings/observation/create/from-template/${template.id}`,
                      useCache: true,
                    })
                  )
                );
              }}
              options={forceArray(availableTemplates).filter(
                (template) => template.type === TemplateTypes.Observation
              )}
              placeholder="Create from template…"
              value={null}
            />
          </div>
          <span className="text-fg-3">or</span>
          <IconButton
            className="p-2"
            colorScheme="transparent"
            icon={<PlusIcon className="m-0.5 w-5" />}
            label="Create observation"
            onClick={() => {
              saveToCache();

              globalValueCache.set(CacheKeys.EventTypeForm, {
                order: observations.length,
              });

              newObservationTransition[1](() =>
                router.push(
                  formatCacheLink({
                    backLink,
                    path: `/subjects/${subject.id}/settings/observation/create`,
                    useCache: true,
                  })
                )
              );
            }}
            type="button"
            variant="primary"
          />
        </div>
      </section>
      <section className="mt-2">
        <h1 className="px-2 text-xl text-fg-1">Clients</h1>
        <p className="mt-2 max-w-xs px-2 leading-tight text-fg-3">
          Clients can complete routines, make observations and
          add&nbsp;comments.
        </p>
        {!!managers.length && (
          <LinkList className="mx-0 mt-4">
            {managers.map((manager) => (
              <LinkList.Item
                icon="trash"
                key={manager.id}
                onClick={() => null}
                text={`${manager.first_name} ${manager.last_name}`}
              />
            ))}
          </LinkList>
        )}
        <Button
          className="mt-4 w-full"
          colorScheme="transparent"
          loading={isCopyingToClipboard}
          loadingText="Generating link…"
          onClick={async () => {
            toggleCopyingToClipboard();
            let { share_code } = form.getValues();

            if (!share_code) {
              share_code = nanoid(8);

              const { error: subjectError } = await supabase
                .from('subjects')
                .update({ share_code })
                .eq('id', subject.id);

              if (subjectError) {
                alert(subjectError.message);
                toggleCopyingToClipboard();
                return;
              }

              form.setValue('share_code', share_code);
            }

            await copyToClipboard(
              `${location.origin}/subjects/${subject.id}/join/${share_code}`
            );

            toggleCopyingToClipboard();
          }}
          type="button"
        >
          {copiedText ? (
            <>
              <CheckIcon className="w-5" />
              Link copied&hellip; Share it!
            </>
          ) : (
            <>
              <ClipboardDocumentIcon className="w-5" />
              Copy client link
            </>
          )}
        </Button>
      </section>
    </form>
  );
};

export default SubjectSettingsForm;
