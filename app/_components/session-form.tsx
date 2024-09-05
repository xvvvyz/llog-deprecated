'use client';

import Button from '@/_components/button';
import * as Modal from '@/_components/modal';
import PageModalBackButton from '@/_components/page-modal-back-button';
import PageModalHeader from '@/_components/page-modal-header';
import SessionFormSection from '@/_components/session-form-section';
import SessionUseTemplateModal from '@/_components/session-use-template-modal';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertSession from '@/_mutations/upsert-session';
import { GetSessionData } from '@/_queries/get-session';
import { GetTrainingPlanWithSessionsData } from '@/_queries/get-training-plan-with-sessions';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesData } from '@/_queries/list-templates';
import { ListTemplatesBySubjectIdAndTypeData } from '@/_queries/list-templates-by-subject-id-and-type';
import forceArray from '@/_utilities/force-array';
import formatDatetimeLocal from '@/_utilities/format-datetime-local';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import parseSessions from '@/_utilities/parse-sessions';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface SessionFormProps {
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  availableModuleTemplates: NonNullable<
    ListTemplatesBySubjectIdAndTypeData | ListTemplatesData
  >;
  availableSessionTemplates: NonNullable<
    ListTemplatesBySubjectIdAndTypeData | ListTemplatesData
  >;
  isDuplicate?: boolean;
  order?: string;
  session?: NonNullable<GetSessionData>;
  subjectId: string;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  trainingPlan: NonNullable<GetTrainingPlanWithSessionsData>;
}

export type SessionFormValues = {
  draft: boolean;
  modules: Array<{
    content: string;
    id?: string;
    inputs: NonNullable<ListInputsBySubjectIdData>;
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
  order,
  session,
  subjectId,
  subjects,
  trainingPlan,
}: SessionFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const modules = forceArray(session?.modules);
  const router = useRouter();

  const currentOrder = Number(
    (isDuplicate ? order : (session?.order ?? order)) ?? 0,
  );

  const cacheKey = getFormCacheKey.session({
    id: session?.id,
    isDuplicate,
    subjectId,
    trainingPlanId: trainingPlan.id,
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
    sessions: trainingPlan.sessions,
  });

  return (
    <Modal.Content>
      <PageModalHeader
        right={
          <SessionUseTemplateModal<SessionFormValues>
            availableInputs={availableInputs}
            availableSessionTemplates={availableSessionTemplates}
            form={form}
            trigger={
              <Modal.Trigger asChild>
                <Button className="pr-2 sm:pr-6" variant="link">
                  <DocumentTextIcon className="w-5 text-fg-4" />
                  Use template
                </Button>
              </Modal.Trigger>
            }
          />
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
                publishedOrder: Math.min(
                  currentOrder,
                  highestPublishedOrder + 1,
                ),
                sessionId: isDuplicate ? undefined : session?.id,
                subjectId,
                trainingPlanId: trainingPlan.id,
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
