'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import PageModalBackButton from '@/_components/page-modal-back-button';
import SortableSessionFormSection from '@/_components/sortable-session-form-section';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertTrainingPlanTemplate from '@/_mutations/upsert-training-plan-template';
import { GetTemplateData } from '@/_queries/get-template';
import { ListInputsData } from '@/_queries/list-inputs';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesWithDataData } from '@/_queries/list-templates-with-data';
import { Database } from '@/_types/database';
import { TrainingPlanTemplateDataJson } from '@/_types/training-plan-template-data-json';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import stopPropagation from '@/_utilities/stop-propagation';
import * as DndCore from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import * as DndSortable from '@dnd-kit/sortable';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { FieldPath, useFieldArray } from 'react-hook-form';

interface TrainingPlanTemplateFormProps {
  availableInputs: NonNullable<ListInputsData>;
  availableModuleTemplates: NonNullable<ListTemplatesWithDataData>;
  availableSessionTemplates: NonNullable<ListTemplatesWithDataData>;
  disableCache?: boolean;
  isDuplicate?: boolean;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  template?: Partial<GetTemplateData>;
}

export type TrainingPlanTemplateFormValues = {
  name: string;
  sessions: Array<{
    modules: Array<{
      content: string;
      inputs: Array<Database['public']['Tables']['inputs']['Row']>;
      name?: string | null;
    }>;
    title: string;
  }>;
};

const TrainingPlanTemplateForm = ({
  availableInputs,
  availableModuleTemplates,
  availableSessionTemplates,
  disableCache,
  isDuplicate,
  subjects,
  template,
}: TrainingPlanTemplateFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const sensors = DndCore.useSensors(DndCore.useSensor(DndCore.PointerSensor));
  const templateData = template?.data as TrainingPlanTemplateDataJson;

  const cacheKey = getFormCacheKey.trainingPlanTemplate({
    id: template?.id,
    isDuplicate,
  });

  const form = useCachedForm<TrainingPlanTemplateFormValues>(
    cacheKey,
    {
      defaultValues: {
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
            const res = await upsertTrainingPlanTemplate(
              { templateId: template?.id },
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
      <div className="px-4 sm:px-8">
        <Input
          label="Name"
          maxLength={49}
          required
          {...form.register('name')}
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
                  TrainingPlanTemplateFormValues,
                  'sessions'
                >
                  availableInputs={availableInputs}
                  availableModuleTemplates={availableModuleTemplates}
                  availableSessionTemplates={availableSessionTemplates}
                  fieldPath={
                    `sessions[${i}]` as FieldPath<TrainingPlanTemplateFormValues>
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
        <UnsavedChangesBanner<TrainingPlanTemplateFormValues> form={form} />
      )}
    </form>
  );
};

export default TrainingPlanTemplateForm;
