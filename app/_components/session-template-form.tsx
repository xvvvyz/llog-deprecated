'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import ModuleFormSection from '@/_components/module-form-section';
import PageModalBackButton from '@/_components/page-modal-back-button';
import UnsavedChangesBanner from '@/_components/unsaved-changes-banner';
import useCachedForm from '@/_hooks/use-cached-form';
import upsertSessionTemplate from '@/_mutations/upsert-session-template';
import { GetTemplateData } from '@/_queries/get-template';
import { ListInputsData } from '@/_queries/list-inputs';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesWithDataData } from '@/_queries/list-templates-with-data';
import { Database } from '@/_types/database';
import { SessionTemplateDataJson } from '@/_types/session-template-data-json';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import stopPropagation from '@/_utilities/stop-propagation';
import * as DndCore from '@dnd-kit/core';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import * as DndSortable from '@dnd-kit/sortable';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useFieldArray } from 'react-hook-form';

interface SessionTemplateFormProps {
  availableInputs: NonNullable<ListInputsData>;
  availableTemplates: NonNullable<ListTemplatesWithDataData>;
  disableCache?: boolean;
  isDuplicate?: boolean;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  template?: Partial<GetTemplateData>;
}

export type SessionTemplateFormValues = {
  modules: Array<{
    content: string;
    inputs: Array<Database['public']['Tables']['inputs']['Row']>;
    name?: string | null;
  }>;
  name: string;
};

const SessionTemplateForm = ({
  availableInputs,
  availableTemplates,
  disableCache,
  isDuplicate,
  subjects,
  template,
}: SessionTemplateFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const sensors = DndCore.useSensors(DndCore.useSensor(DndCore.PointerSensor));
  const templateData = template?.data as SessionTemplateDataJson;

  const cacheKey = getFormCacheKey.sessionTemplate({
    id: template?.id,
    isDuplicate,
  });

  const form = useCachedForm<SessionTemplateFormValues>(
    cacheKey,
    {
      defaultValues: {
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
      },
    },
    { disableCache },
  );

  const modulesArray = useFieldArray({
    control: form.control,
    keyName: 'key',
    name: 'modules',
  });

  return (
    <form
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={stopPropagation(
        form.handleSubmit((values) =>
          startTransition(async () => {
            const res = await upsertSessionTemplate(
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
      <Input label="Name" maxLength={49} required {...form.register('name')} />
      <div>
        <ul className="space-y-4">
          <DndCore.DndContext
            collisionDetection={DndCore.closestCenter}
            id="modules"
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={({ active, over }: DndCore.DragEndEvent) => {
              if (!over || active.id === over.id) return;

              modulesArray.move(
                modulesArray.fields.findIndex((f) => f.key === active.id),
                modulesArray.fields.findIndex((f) => f.key === over.id),
              );
            }}
            sensors={sensors}
          >
            <DndSortable.SortableContext
              items={modulesArray.fields.map((eventType) => eventType.key)}
              strategy={DndSortable.verticalListSortingStrategy}
            >
              {modulesArray.fields.map((module, eventTypeIndex) => (
                <ModuleFormSection<SessionTemplateFormValues, 'modules'>
                  availableInputs={availableInputs}
                  availableTemplates={availableTemplates}
                  eventTypeArray={modulesArray}
                  eventTypeIndex={eventTypeIndex}
                  eventTypeKey={module.key}
                  form={form}
                  hasOnlyOne={modulesArray.fields.length === 1}
                  key={module.key}
                  subjects={subjects}
                />
              ))}
            </DndSortable.SortableContext>
          </DndCore.DndContext>
        </ul>
        <Button
          className="mt-4 w-full"
          colorScheme="transparent"
          onClick={() =>
            modulesArray.append({ content: '', inputs: [], name: '' })
          }
        >
          <PlusIcon className="w-5" />
          Add module
        </Button>
      </div>
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      <div className="flex gap-4 pt-8">
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
        <UnsavedChangesBanner<SessionTemplateFormValues> form={form} />
      )}
    </form>
  );
};

export default SessionTemplateForm;
