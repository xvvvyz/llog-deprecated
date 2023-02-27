'use client';

import Button from '(components)/button';
import { LabelSpan } from '(components)/label';
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
import useSubmitRedirect from '(utilities)/use-submit-redirect';
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
  Database['public']['Tables']['subjects']['Row'];

const SubjectSettingsForm = ({
  availableTemplates,
  subject,
}: SubjectSettingsFormProps) => {
  const [copiedText, copyToClipboard] = useCopyToClipboard();
  const [isCopyingToClipboard, toggleCopyingToClipboard] = useToggle();
  const [redirect, isRedirecting] = useSubmitRedirect();
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
      <section className="mt-2">
        <LabelSpan className="text-xl text-fg-1">Missions</LabelSpan>
        <LabelSpan className="mt-2 max-w-xs leading-tight text-fg-3">
          Missions are a sequence of routines that form a long-term
          modification&nbsp;plan.
        </LabelSpan>
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
          href={`/subjects/${subject.id}/settings/mission?back=${backLink}`}
          onClick={saveToCache}
          type="button"
        >
          <PlusIcon className="w-5" />
          Add mission
        </Button>
      </section>
      <section className="mt-2">
        <LabelSpan className="text-xl text-fg-1">Routines</LabelSpan>
        <LabelSpan className="mt-2 max-w-xs leading-tight text-fg-3">
          Routines are a sequence of actions that can be performed
          at&nbsp;any&nbsp;time.
        </LabelSpan>
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
                  path: `/subjects/${subject.id}/settings/routine?templateId=${template.id}`,
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
                  path: `/subjects/${subject.id}/settings/routine`,
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
        <LabelSpan className="text-xl text-fg-1">Observations</LabelSpan>
        <LabelSpan className="mt-2 max-w-xs leading-tight text-fg-3">
          Observations allow you to track events or behaviors that occur
          over&nbsp;time.
        </LabelSpan>
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
                  path: `/subjects/${subject.id}/settings/observation?templateId=${template.id}`,
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
                  path: `/subjects/${subject.id}/settings/observation`,
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
        <LabelSpan className="text-xl text-fg-1">Clients</LabelSpan>
        <LabelSpan className="mt-2 max-w-xs leading-tight text-fg-3">
          Clients can complete routines, make observations and
          add&nbsp;comments.
        </LabelSpan>
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
              `${location.origin}/subjects/${subject.id}?share=${share_code}`
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
      <Button
        className="mt-4 w-full"
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
