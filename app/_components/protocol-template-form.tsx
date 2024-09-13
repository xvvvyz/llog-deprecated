'use client';

import Button from '@/_components/button';
import PageModalBackButton from '@/_components/page-modal-back-button';
import SortableSessionFormSection from '@/_components/sortable-session-form-section';
import TemplateFormSection from '@/_components/template-form-section';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertProtocolTemplate from '@/_mutations/upsert-protocol-template';
import { GetTemplateData } from '@/_queries/get-template';
import { ListInputsData } from '@/_queries/list-inputs';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesData } from '@/_queries/list-templates';
import { Database } from '@/_types/database';
import { ProtocolTemplateDataJson } from '@/_types/protocol-template-data-json';
import forceArray from '@/_utilities/force-array';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import stopPropagation from '@/_utilities/stop-propagation';
import * as DndCore from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import * as DndSortable from '@dnd-kit/sortable';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { FieldPath, useFieldArray } from 'react-hook-form';

interface ProtocolTemplateFormProps {
  availableInputs: NonNullable<ListInputsData>;
  availableModuleTemplates: NonNullable<ListTemplatesData>;
  availableSessionTemplates: NonNullable<ListTemplatesData>;
  disableCache?: boolean;
  isDuplicate?: boolean;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  template?: Partial<GetTemplateData>;
}

export type ProtocolTemplateFormValues = {
  description: string;
  name: string;
  sessions: Array<{
    modules: Array<{
      content: string;
      inputs: Array<Database['public']['Tables']['inputs']['Row']>;
      name?: string | null;
    }>;
    title: string;
  }>;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
};

const ProtocolTemplateForm = ({
  availableInputs,
  availableModuleTemplates,
  availableSessionTemplates,
  disableCache,
  isDuplicate,
  subjects,
  template,
}: ProtocolTemplateFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const sensors = DndCore.useSensors(DndCore.useSensor(DndCore.PointerSensor));
  const templateData = template?.data as ProtocolTemplateDataJson;

  const cacheKey = getFormCacheKey.protocolTemplate({
    id: template?.id,
    isDuplicate,
  });

  const form = useCachedForm<ProtocolTemplateFormValues>(
    cacheKey,
    {
      defaultValues: {
        description: template?.description ?? '',
        name: template?.name ?? '',
        sessions: templateData?.sessions?.length
          ? templateData.sessions.map((session) => ({
              modules: session.modules?.length
                ? session.modules.map((module) => ({
                    content: module.content,
                    inputs: availableInputs.filter((input) =>
                      module.inputIds?.includes(input.id),
                    ),
                    name: module.name,
                  }))
                : [{ content: '', inputs: [], name: '' }],
              title: session.title ?? '',
            }))
          : [],
        subjects: forceArray(subjects).filter(({ id }) =>
          template?.subjects?.some((sf) => sf.id === id),
        ),
      },
    },
    { disableCache },
  );

  const sessionsArray = useFieldArray({
    control: form.control,
    keyName: 'key',
    name: 'sessions',
  });

  return (
    <form
      className="flex flex-col gap-8 pb-8 pt-6"
      onSubmit={stopPropagation(
        form.handleSubmit((values) =>
          startTransition(async () => {
            const res = await upsertProtocolTemplate(
              { templateId: isDuplicate ? undefined : template?.id },
              values,
            );

            if (res?.error) {
              form.setError('root', { message: res.error, type: 'custom' });
            } else {
              router.back();
            }
          }),
        ),
      )}
    >
      <div className="space-y-8 px-4 sm:px-8">
        <TemplateFormSection<ProtocolTemplateFormValues>
          form={form}
          subjects={subjects}
        />
      </div>
      {!!sessionsArray.fields.length && (
        <ul className="space-y-4 overflow-x-clip border-y border-alpha-1 bg-alpha-reverse-2 py-4">
          <DndCore.DndContext
            collisionDetection={DndCore.closestCenter}
            id="sessions"
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={({ active, over }: DndCore.DragEndEvent) => {
              if (!over || active.id === over.id) return;

              sessionsArray.move(
                sessionsArray.fields.findIndex((f) => f.key === active.id),
                sessionsArray.fields.findIndex((f) => f.key === over.id),
              );
            }}
            sensors={sensors}
          >
            <DndSortable.SortableContext
              items={sessionsArray.fields.map((eventType) => eventType.key)}
              strategy={DndSortable.verticalListSortingStrategy}
            >
              {sessionsArray.fields.map((session, i) => (
                <SortableSessionFormSection<
                  ProtocolTemplateFormValues,
                  'sessions'
                >
                  availableInputs={availableInputs}
                  availableModuleTemplates={availableModuleTemplates}
                  availableSessionTemplates={availableSessionTemplates}
                  fieldPath={
                    `sessions[${i}]` as FieldPath<ProtocolTemplateFormValues>
                  }
                  form={form}
                  includeTitle
                  key={session.key}
                  sessionArray={sessionsArray}
                  sessionIndex={i}
                  sessionKey={session.key}
                  subjects={subjects}
                />
              ))}
            </DndSortable.SortableContext>
          </DndCore.DndContext>
        </ul>
      )}
      <div className="px-4 sm:px-8">
        <Button
          className="w-full"
          colorScheme="transparent"
          onClick={() =>
            sessionsArray.append({
              modules: [{ content: '', inputs: [], name: '' }],
              title: '',
            })
          }
        >
          <PlusIcon className="w-5" />
          Add session
        </Button>
      </div>
      {form.formState.errors.root && (
        <div className="px-4 text-center sm:px-8">
          {form.formState.errors.root.message}
        </div>
      )}
      <div className="flex gap-4 px-4 pt-8 sm:px-8">
        <PageModalBackButton className="w-full" colorScheme="transparent">
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
        <UnsavedChangesBanner<ProtocolTemplateFormValues> form={form} />
      )}
    </form>
  );
};

export default ProtocolTemplateForm;
