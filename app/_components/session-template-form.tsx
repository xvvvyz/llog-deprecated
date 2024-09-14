'use client';

import Button from '@/_components/button';
import PageModalBackButton from '@/_components/page-modal-back-button';
import SessionFormSection from '@/_components/session-form-section';
import TemplateFormSection from '@/_components/template-form-section';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertSessionTemplate from '@/_mutations/upsert-session-template';
import { GetTemplateData } from '@/_queries/get-template';
import { ListInputsData } from '@/_queries/list-inputs';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesData } from '@/_queries/list-templates';
import { ListTemplatesBySubjectIdAndTypeData } from '@/_queries/list-templates-by-subject-id-and-type';
import { Database } from '@/_types/database';
import { SessionTemplateDataJson } from '@/_types/session-template-data-json';
import forceArray from '@/_utilities/force-array';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import stopPropagation from '@/_utilities/stop-propagation';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface SessionTemplateFormProps {
  availableInputs: NonNullable<ListInputsData>;
  availableModuleTemplates: NonNullable<
    ListTemplatesBySubjectIdAndTypeData | ListTemplatesData
  >;
  disableCache?: boolean;
  isDuplicate?: boolean;
  onClose?: () => void;
  onSubmit?: () => void;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  template?: Partial<GetTemplateData>;
}

export interface SessionTemplateFormValues {
  description: string;
  modules: Array<{
    content: string;
    inputs: Array<Database['public']['Tables']['inputs']['Row']>;
    name?: string | null;
  }>;
  name: string;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
}

const SessionTemplateForm = ({
  availableInputs,
  availableModuleTemplates,
  disableCache,
  isDuplicate,
  onClose,
  onSubmit,
  subjects,
  template,
}: SessionTemplateFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const templateData = template?.data as SessionTemplateDataJson;

  const cacheKey = getFormCacheKey.sessionTemplate({
    id: template?.id,
    isDuplicate,
  });

  const form = useCachedForm<SessionTemplateFormValues>(
    cacheKey,
    {
      defaultValues: {
        description: template?.description ?? '',
        modules: templateData?.modules?.length
          ? templateData.modules.map((module) => ({
              content: module.content,
              inputs: availableInputs.filter((input) =>
                module.inputIds?.includes(input.id),
              ),
              name: module.name,
            }))
          : [{ content: '', inputs: [], name: '' }],
        name: template?.name ?? '',
        subjects: forceArray(subjects).filter(({ id }) =>
          template?.subjects?.some((sf) => sf.id === id),
        ),
      },
    },
    { disableCache },
  );

  return (
    <form
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={stopPropagation(
        form.handleSubmit((values) =>
          startTransition(async () => {
            const res = await upsertSessionTemplate(
              { templateId: isDuplicate ? undefined : template?.id },
              values,
            );

            if (res?.error) {
              form.setError('root', { message: res.error, type: 'custom' });
            } else {
              onSubmit?.();
              if (!onClose) router.back();
            }
          }),
        ),
      )}
    >
      <TemplateFormSection<SessionTemplateFormValues>
        form={form}
        subjects={subjects}
      />
      <SessionFormSection<SessionTemplateFormValues>
        availableInputs={availableInputs}
        availableModuleTemplates={availableModuleTemplates}
        form={form}
        subjects={subjects}
      />
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      <div className="flex gap-4 pt-8">
        <PageModalBackButton
          className="w-full"
          colorScheme="transparent"
          onClick={onClose}
        >
          Close
        </PageModalBackButton>
        <Button
          className="w-full"
          loading={isTransitioning}
          loadingText="Saving…"
          type="submit"
        >
          Save
        </Button>
      </div>
      {!disableCache && (
        <UnsavedChangesBanner<SessionTemplateFormValues> form={form} />
      )}
    </form>
  );
};

export default SessionTemplateForm;
