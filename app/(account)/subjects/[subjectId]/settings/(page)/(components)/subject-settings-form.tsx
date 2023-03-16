'use client';

import Button from '(components)/button';
import LinkList from '(components)/link-list';
import Select from '(components)/select';
import { Database } from '(types)/database';
import { TemplateType } from '(types)/template';
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
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { useCopyToClipboard, useToggle } from 'usehooks-ts';
import SubjectDetailsFormSection from '../../../../(components)/subject-details-form-section';

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

  const observations = eventTypes.filter(
    (e) => e.type === EventTypes.Observation
  );

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.SubjectSettingsForm,
    defaultValues: {
      avatar: subject.image_uri,
      id: subject.id,
      name: subject.name,
      share_code: subject.share_code,
    },
  });

  const form = useForm<SubjectSettingsFormValues>({ defaultValues });

  const saveToCache = () =>
    globalValueCache.set(CacheKeys.SubjectSettingsForm, form.getValues());

  return (
    <form
      className="flex flex-col gap-6 sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8"
      onSubmit={form.handleSubmit(async (values) => {
        const { error: subjectError } = await supabase
          .from('subjects')
          .upsert({ id: values.id, name: values.name.trim() });

        if (subjectError) {
          alert(subjectError.message);
          return;
        }

        await uploadSubjectAvatar({
          avatar: values.avatar,
          subjectId: values.id,
        });

        form.reset(values);
      })}
    >
      <SubjectDetailsFormSection<SubjectSettingsFormValues>
        dropzone={dropzone}
        form={form}
      />
      <Button
        className="my-6 w-full"
        disabled={!form.formState.isDirty}
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
          <LinkList className="mt-4">
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
          href={`/subjects/${subject.id}/settings/mission/add?back=${backLink}`}
          onClick={saveToCache}
          type="button"
        >
          <PlusIcon className="w-5" />
          Add mission
        </Button>
      </section>
      <section className="mt-2">
        <h1 className="px-2 text-xl text-fg-1">Routines</h1>
        <p className="mt-2 max-w-xs px-2 leading-tight text-fg-3">
          Routines are a sequence of actions that can be performed
          at&nbsp;any&nbsp;time.
        </p>
        {!!routines.length && (
          <LinkList className="mt-4">
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
        <Select
          className="mt-4"
          instanceId="routineTemplate"
          isCreatable
          isLoading={newRoutineTransition[0]}
          noOptionsMessage={() => 'No templates—type to add a routine'}
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
                  path: `/subjects/${subject.id}/settings/routine/add/from-template/${template.id}`,
                  useCache: true,
                })
              )
            );
          }}
          onCreateOption={async (value: unknown) => {
            saveToCache();

            globalValueCache.set(CacheKeys.EventTypeForm, {
              name: value,
              order: routines.length,
            });

            newRoutineTransition[1](() =>
              router.push(
                formatCacheLink({
                  backLink,
                  path: `/subjects/${subject.id}/settings/routine/add`,
                  useCache: true,
                })
              )
            );
          }}
          options={forceArray(availableTemplates).filter(
            (template) => template.type === TemplateTypes.Routine
          )}
          placeholder="Add routine"
          value={null}
        />
      </section>
      <section className="mt-2">
        <h1 className="px-2 text-xl text-fg-1">Observations</h1>
        <p className="mt-2 max-w-xs px-2 leading-tight text-fg-3">
          Observations allow you to track events or behaviors that occur
          over&nbsp;time.
        </p>
        {!!observations.length && (
          <LinkList className="mt-4">
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
        <Select
          className="mt-4"
          instanceId="observationTemplate"
          isCreatable
          isLoading={newObservationTransition[0]}
          noOptionsMessage={() => 'No templates—type to add an observation'}
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
                  path: `/subjects/${subject.id}/settings/observation/add/from-template/${template.id}`,
                  useCache: true,
                })
              )
            );
          }}
          onCreateOption={async (value: unknown) => {
            saveToCache();

            globalValueCache.set(CacheKeys.EventTypeForm, {
              name: value,
              order: observations.length,
            });

            newObservationTransition[1](() =>
              router.push(
                formatCacheLink({
                  backLink,
                  path: `/subjects/${subject.id}/settings/observation/add`,
                  useCache: true,
                })
              )
            );
          }}
          options={forceArray(availableTemplates).filter(
            (template) => template.type === TemplateTypes.Observation
          )}
          placeholder="Add observation"
          value={null}
        />
      </section>
      <section className="mt-2">
        <h1 className="px-2 text-xl text-fg-1">Clients</h1>
        <p className="mt-2 max-w-xs px-2 leading-tight text-fg-3">
          Clients can complete routines, make observations and
          add&nbsp;comments.
        </p>
        {!!managers.length && (
          <LinkList className="mt-4">
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
