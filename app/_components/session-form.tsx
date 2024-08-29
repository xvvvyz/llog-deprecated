'use client';

import Button from '@/_components/button';
import * as Modal from '@/_components/modal';
import PageModalBackButton from '@/_components/page-modal-back-button';
import PageModalHeader from '@/_components/page-modal-header';
import Select from '@/_components/select';
import SessionFormSection from '@/_components/session-form-section';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertSession from '@/_mutations/upsert-session';
import { GetSessionData } from '@/_queries/get-session';
import { GetTrainingPlanWithSessionsData } from '@/_queries/get-training-plan-with-sessions';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesWithDataData } from '@/_queries/list-templates-with-data';
import { SessionTemplateDataJson } from '@/_types/session-template-data-json';
import forceArray from '@/_utilities/force-array';
import formatDatetimeLocal from '@/_utilities/format-datetime-local';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import parseSessions from '@/_utilities/parse-sessions';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface SessionFormProps {
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  availableModuleTemplates: NonNullable<ListTemplatesWithDataData>;
  availableSessionTemplates: NonNullable<ListTemplatesWithDataData>;
  isDuplicate?: boolean;
  mission: NonNullable<GetTrainingPlanWithSessionsData>;
  order?: string;
  session?: NonNullable<GetSessionData>;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  subjectId: string;
}

export type SessionFormValues = {
  draft: boolean;
  modules: Array<{
    content: string;
    id?: string;
    inputs: Array<{ id: string }>;
    name?: string | null;
  }>;
  scheduledFor: string | null;
  title?: string | null;
};

const SessionForm = ({
  availableInputs,
  availableModuleTemplates,
  availableSessionTemplates,
  isDuplicate,
  mission,
  order,
  session,
  subjects,
  subjectId,
}: SessionFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const [useTemplateModal, toggleUseTemplateModal] = useToggle(false);
  const modules = forceArray(session?.modules);
  const router = useRouter();

  const currentOrder = Number(
    (isDuplicate ? order : (session?.order ?? order)) ?? 0,
  );

  const cacheKey = getFormCacheKey.session({
    id: session?.id,
    isDuplicate,
    missionId: mission.id,
    subjectId,
  });

  const form = useCachedForm<SessionFormValues>(
    cacheKey,
    {
      defaultValues: {
        draft: isDuplicate ? true : (session?.draft ?? true),
        modules: modules.length
          ? modules.map((module) => ({
              content: module.content ?? '',
              id: isDuplicate ? undefined : module.id,
              inputs: availableInputs.filter((input) =>
                module.inputs.some(({ input_id }) => input_id === input.id),
              ),
              name: module.name,
            }))
          : [{ content: '', inputs: [], name: '' }],
        scheduledFor:
          !session?.scheduled_for ||
          (session.scheduled_for &&
            new Date(session.scheduled_for) < new Date())
            ? null
            : formatDatetimeLocal(session.scheduled_for, { seconds: false }),
        title: session?.title ?? '',
      },
    },
    { ignoreValues: ['draft', 'order'] },
  );

  const draft = form.watch('draft');

  const { highestPublishedOrder } = parseSessions({
    currentSession: session,
    sessionOrder: currentOrder,
    sessions: mission.sessions,
  });

  return (
    <Modal.Content>
      <PageModalHeader
        right={
          <Modal.Root
            onOpenChange={toggleUseTemplateModal}
            open={useTemplateModal}
          >
            <Modal.Trigger asChild>
              <Button className="pr-2 sm:pr-6" variant="link">
                <DocumentTextIcon className="w-5 text-fg-4" />
                Use template
              </Button>
            </Modal.Trigger>
            <Modal.Portal>
              <Modal.Overlay>
                <Modal.Content className="max-w-sm p-8 text-center">
                  <Modal.Title className="text-2xl">Use template</Modal.Title>
                  <Modal.Description className="mt-4 px-4 text-fg-4">
                    Selecting a template will overwrite any existing session
                    modules.
                  </Modal.Description>
                  <div className="pt-16 text-left">
                    <Select
                      noOptionsMessage={() => 'No templates.'}
                      onChange={(t) => {
                        const template =
                          t as NonNullable<ListTemplatesWithDataData>[0];

                        const data = template?.data as SessionTemplateDataJson;

                        form.setValue('title', template.name, {
                          shouldDirty: true,
                        });

                        form.setValue(
                          'modules',
                          (data?.modules ?? []).map((module) => ({
                            content: module.content ?? '',
                            inputs: availableInputs.filter((input) =>
                              module.inputIds?.some((id) => id === input.id),
                            ),
                            name: module.name,
                          })),
                          { shouldDirty: true },
                        );

                        toggleUseTemplateModal();
                      }}
                      options={availableSessionTemplates}
                      placeholder="Select a template…"
                      value={null}
                    />
                  </div>
                  <Modal.Close asChild>
                    <Button
                      className="-mb-3 mt-14 w-full justify-center p-0 py-3"
                      variant="link"
                    >
                      Close
                    </Button>
                  </Modal.Close>
                </Modal.Content>
              </Modal.Overlay>
            </Modal.Portal>
          </Modal.Root>
        }
        title={session && !isDuplicate ? 'Edit session' : 'New session'}
      />
      <form
        className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
        onSubmit={form.handleSubmit((values) =>
          startTransition(async () => {
            values.scheduledFor = values.scheduledFor
              ? new Date(values.scheduledFor).toISOString()
              : null;

            const res = await upsertSession(
              {
                currentOrder,
                missionId: mission.id,
                publishedOrder: Math.min(
                  currentOrder,
                  highestPublishedOrder + 1,
                ),
                sessionId: isDuplicate ? undefined : session?.id,
                subjectId,
              },
              values,
            );

            if (res?.error) {
              form.setError('root', { message: res.error, type: 'custom' });
              return;
            }

            router.back();
          }),
        )}
      >
        <SessionFormSection<SessionFormValues>
          availableInputs={availableInputs}
          availableModuleTemplates={availableModuleTemplates}
          form={form}
          includeScheduledFor={!modules.some((module) => module.event?.length)}
          includeTitle
          subjectId={subjectId}
          subjects={subjects}
        />
        {form.formState.errors.root && (
          <div className="text-center">
            {form.formState.errors.root.message}
          </div>
        )}
        <div className="flex flex-row gap-4 pt-8">
          {draft && (
            <Button
              className="w-full"
              colorScheme="transparent"
              loading={isTransitioning}
              loadingText="Saving…"
              type="submit"
            >
              Save as draft
            </Button>
          )}
          <Button
            className="w-full"
            loading={!draft && isTransitioning}
            loadingText="Saving…"
            onClick={() => form.setValue('draft', false)}
            type="submit"
          >
            {draft ? <>Save &amp; publish</> : <>Save</>}
          </Button>
        </div>
        <UnsavedChangesBanner<SessionFormValues> form={form} />
      </form>
      <PageModalBackButton
        className="m-0 block w-full py-6 text-center"
        variant="link"
      >
        Close
      </PageModalBackButton>
    </Modal.Content>
  );
};

export default SessionForm;
