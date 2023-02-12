'use client';

import Button from '(components)/button';
import { LabelSpan } from '(components)/label';
import LinkList from '(components)/link-list';
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
import { nanoid } from 'nanoid';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { twMerge } from 'tailwind-merge';
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
        <LabelSpan as="h1" className="pb-2">
          Missions
        </LabelSpan>
        <div className="rounded bg-bg-2">
          {!!missions.length && (
            <LinkList className="rounded-b-none border-b-0">
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
            className={twMerge('w-full', missions.length && 'rounded-t-none')}
            colorScheme="transparent"
            href={`/subjects/${subject.id}/settings/mission?back=${backLink}`}
            onClick={saveToCache}
            type="button"
          >
            <PlusIcon className="w-5" />
            Add mission
          </Button>
        </div>
      </section>
      <section>
        <LabelSpan as="h1" className="pb-2">
          Routines
        </LabelSpan>
        <div className="rounded bg-bg-2">
          {!!routines.length && (
            <LinkList className="rounded-b-none border-b-0">
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
            className={twMerge(routines.length && 'rounded-t-none')}
            creatable
            instanceId="routineTemplate"
            isLoading={newRoutineTransition[0]}
            noOptionsMessage={() => null}
            onChange={(e) => {
              saveToCache();

              globalValueCache.set(CacheKeys.EventTypeForm, {
                order: routines.length,
              });

              const template = e as EventTemplate;

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
        </div>
      </section>
      <section>
        <LabelSpan as="h1" className="pb-2">
          Observations
        </LabelSpan>
        <div className="rounded bg-bg-2">
          {!!observations.length && (
            <LinkList className="rounded-b-none border-b-0">
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
            className={twMerge(observations.length && 'rounded-t-none')}
            creatable
            instanceId="observationTemplate"
            isLoading={newObservationTransition[0]}
            noOptionsMessage={() => null}
            onChange={(e) => {
              saveToCache();

              globalValueCache.set(CacheKeys.EventTypeForm, {
                order: observations.length,
              });

              const template = e as EventTemplate;

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
        </div>
      </section>
      <section>
        <LabelSpan as="h1" className="pb-2">
          Clients
        </LabelSpan>
        <div className="rounded bg-bg-2">
          {!!managers.length && (
            <LinkList className="rounded-b-none border-b-0">
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
            className={twMerge('w-full', managers.length && 'rounded-t-none')}
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
        </div>
        <p className="mx-auto mt-2 max-w-sm text-center leading-tight text-fg-3">
          Clients can complete missions and routines, make observations and add
          comments.
        </p>
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
