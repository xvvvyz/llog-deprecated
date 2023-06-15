'use client';

import IconButton from '@/(account)/_components/icon-button';
import LinkList from '@/(account)/_components/link-list';
import Select from '@/(account)/_components/select';
import CacheKeys from '@/(account)/_constants/enum-cache-keys';
import useAvatarDropzone from '@/(account)/_hooks/use-avatar-dropzone';
import useBackLink from '@/(account)/_hooks/use-back-link';
import useDefaultValues from '@/(account)/_hooks/use-default-values';
import { GetSubjectWithEventTypesData } from '@/(account)/_server/get-subject-with-event-types-and-missions';
import { ListTemplatesData } from '@/(account)/_server/list-templates';
import { TemplateType } from '@/(account)/_types/template';
import forceArray from '@/(account)/_utilities/force-array';
import formatCacheLink from '@/(account)/_utilities/format-cache-link';
import globalValueCache from '@/(account)/_utilities/global-value-cache';
import sanitizeHtml from '@/(account)/_utilities/sanitize-html';
import uploadSubjectAvatar from '@/(account)/_utilities/upload-subject-avatar';
import SubjectDetailsFormSection from '@/(account)/subjects/_components/subject-details-form-section';
import Button from '@/_components/button';
import useSupabase from '@/_hooks/use-supabase';
import { Database } from '@/_types/database';
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
  const [isTransitioning, startTransition] = useTransition();
  const backLink = useBackLink({ useCache: true });
  const dropzone = useAvatarDropzone();
  const eventTypes = forceArray(subject.event_types);
  const managers = forceArray(subject.managers);
  const missions = forceArray(subject.missions);
  const newEventTypeTransition = useTransition();
  const router = useRouter();
  const supabase = useSupabase();

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.SubjectSettingsForm,
    defaultValues: {
      avatar: subject.image_uri,
      banner: subject.banner,
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
      className="form"
      onSubmit={form.handleSubmit(async (values) => {
        const { error: subjectError } = await supabase.from('subjects').upsert({
          banner: sanitizeHtml(values.banner),
          id: values.id,
          name: values.name.trim(),
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

        startTransition(router.refresh);
      })}
    >
      <SubjectDetailsFormSection<SubjectSettingsFormValues>
        dropzone={dropzone}
        form={form}
      />
      <Button
        className="mb-4 mt-8 w-full"
        loading={form.formState.isSubmitting || isTransitioning}
        loadingText="Saving…"
        type="submit"
      >
        Save subject
      </Button>
      <section className="mt-2">
        <h1 className="px-2 text-xl text-fg-1">Missions</h1>
        <p className="mt-2 max-w-sm px-2 text-fg-3">
          Create long-term modification plans. Examples: &ldquo;Reduce
          separation anxiety&rdquo;, &ldquo;Improve recall&rdquo;
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
        <h1 className="px-2 text-xl text-fg-1">Event types</h1>
        <p className="mt-2 max-w-sm px-2 text-fg-3">
          Define the events you want to track. Examples: &ldquo;Exercise&rdquo;,
          &ldquo;Feeding&rdquo;, &ldquo;Barking&rdquo;, &ldquo;Sleeping&rdquo;
        </p>
        {!!eventTypes.length && (
          <LinkList className="mx-0 mt-4">
            {eventTypes.map((eventType) => (
              <LinkList.Item
                href={`/subjects/${subject.id}/settings/event-type/${eventType.id}?back=${backLink}`}
                icon="edit"
                key={eventType.id}
                onClick={saveToCache}
                text={eventType.name}
              />
            ))}
          </LinkList>
        )}
        <div className="mt-4 flex items-center gap-4">
          <div className="flex-grow">
            <Select
              instanceId="eventTypeTemplate"
              isLoading={newEventTypeTransition[0]}
              noOptionsMessage={() => 'No templates'}
              onChange={(e) => {
                saveToCache();

                globalValueCache.set(CacheKeys.EventTypeForm, {
                  order: eventTypes.length,
                });

                const template = e as TemplateType;

                newEventTypeTransition[1](() =>
                  router.push(
                    formatCacheLink({
                      backLink,
                      path: `/subjects/${subject.id}/settings/event-type/create/from-template/${template.id}`,
                      useCache: true,
                    })
                  )
                );
              }}
              options={forceArray(availableTemplates)}
              placeholder="Create from template…"
              value={null}
            />
          </div>
          <span className="text-fg-3">or</span>
          <IconButton
            className="p-2"
            colorScheme="transparent"
            icon={<PlusIcon className="m-0.5 w-5" />}
            label="Create event type"
            onClick={() => {
              saveToCache();

              globalValueCache.set(CacheKeys.EventTypeForm, {
                order: eventTypes.length,
              });

              router.push(
                formatCacheLink({
                  backLink,
                  path: `/subjects/${subject.id}/settings/event-type/create`,
                  useCache: true,
                })
              );
            }}
            type="button"
            variant="primary"
          />
        </div>
      </section>
      <section className="mt-2">
        <h1 className="px-2 text-xl text-fg-1">Members</h1>
        <p className="mt-2 max-w-sm px-2 text-fg-3">
          Add members by sharing the link below. Members can record events and
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
              Copy member link
            </>
          )}
        </Button>
      </section>
    </form>
  );
};

export default SubjectSettingsForm;
