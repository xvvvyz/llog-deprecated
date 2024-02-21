'use client';

import upsertSession from '@/_actions/upsert-session';
import Button from '@/_components/button';
import DateTime from '@/_components/date-time';
import FormBanner from '@/_components/form-banner';
import Input from '@/_components/input';
import ModuleFormSection from '@/_components/module-form-section';
import useCachedForm from '@/_hooks/use-cached-form';
import { GetMissionWithSessionsData } from '@/_queries/get-mission-with-sessions';
import { GetSessionData } from '@/_queries/get-session';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import { ListTemplatesWithDataData } from '@/_queries/list-templates-with-data';
import { Database } from '@/_types/database';
import forceArray from '@/_utilities/force-array';
import formatDatetimeLocal from '@/_utilities/format-datetime-local';
import getFormCacheKey from '@/_utilities/get-form-cache-key';
import getHighestPublishedOrder from '@/_utilities/get-highest-published-order';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { Dialog } from '@headlessui/react';
import ClockIcon from '@heroicons/react/24/outline/ClockIcon';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useSearchParams } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useFieldArray } from 'react-hook-form';

import {
  closestCenter,
  DndContext,
  DragEndEvent,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core';

import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface SessionFormProps {
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  availableTemplates: NonNullable<ListTemplatesWithDataData>;
  isDuplicate?: boolean;
  mission: NonNullable<GetMissionWithSessionsData>;
  order?: number;
  session?: NonNullable<GetSessionData>;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
  subjectId: string;
}

type SessionFormValues = {
  draft: boolean;
  modules: Array<{
    content: string;
    id?: string;
    inputs: Array<Database['public']['Tables']['inputs']['Row']>;
  }>;
  scheduledFor: string | null;
  title: string;
};

const SessionForm = ({
  availableInputs,
  availableTemplates,
  isDuplicate,
  mission,
  order,
  session,
  subjects,
  subjectId,
}: SessionFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const [ogScheduledFor, setOgScheduledFor] = useState<string | null>(null);
  const [scheduleModal, toggleScheduleModal] = useToggle(false);
  const back = useSearchParams().get('back') as string;
  const currentOrder = (isDuplicate ? order : session?.order ?? order) ?? 0;
  const modules = forceArray(session?.modules);
  const sensors = useSensors(useSensor(PointerSensor));

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
        draft: isDuplicate ? true : session?.draft ?? true,
        modules: modules.length
          ? modules.map((module) => ({
              content: module.content ?? '',
              id: isDuplicate ? undefined : module.id,
              inputs: availableInputs.filter((input) =>
                module.inputs.some(({ input_id }) => input_id === input.id),
              ),
            }))
          : [{ content: '', inputs: [] }],
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

  const modulesArray = useFieldArray({
    control: form.control,
    keyName: 'key',
    name: 'modules',
  });

  const draft = form.watch('draft');
  const hasEvents = modules.some((module) => module.event?.length);
  const scheduledFor = form.watch('scheduledFor');

  const cancelScheduleModal = () => {
    form.setValue('scheduledFor', ogScheduledFor ?? null, {
      shouldDirty: true,
    });

    setOgScheduledFor(null);
    toggleScheduleModal(false);
  };

  const openScheduleModal = () => {
    setOgScheduledFor(scheduledFor);
    toggleScheduleModal(true);
  };

  return (
    <>
      <form
        className="!border-t-0"
        onSubmit={form.handleSubmit((values) =>
          startTransition(async () => {
            values.scheduledFor = values.scheduledFor
              ? new Date(values.scheduledFor).toISOString()
              : null;

            const res = await upsertSession(
              {
                currentOrder,
                missionId: mission.id,
                next: back,
                publishedOrder: Math.min(
                  currentOrder,
                  getHighestPublishedOrder(mission.sessions) + 1,
                ),
                sessionId: isDuplicate ? undefined : session?.id,
                subjectId,
              },
              values,
            );

            if (res?.error) {
              form.setError('root', { message: res.error, type: 'custom' });
            }
          }),
        )}
      >
        <FormBanner<SessionFormValues>
          className="mt-7 border-y border-alpha-1"
          form={form}
        />
        <div className="flex items-center gap-6 px-4 py-8 sm:px-8">
          <Input placeholder="Session title" {...form.register('title')} />
          <Button
            className="shrink-0"
            disabled={hasEvents}
            onClick={openScheduleModal}
            variant="link"
          >
            <ClockIcon className="w-5" />
            {scheduledFor ? (
              <DateTime date={scheduledFor} formatter="date-time" />
            ) : (
              'Schedule'
            )}
          </Button>
        </div>
        <ul className="space-y-4 px-4 sm:px-8">
          <DndContext
            collisionDetection={closestCenter}
            id="modules"
            modifiers={[restrictToVerticalAxis]}
            onDragEnd={(event: DragEndEvent) => {
              const { active, over } = event;

              if (over && active.id !== over.id) {
                modulesArray.move(
                  modulesArray.fields.findIndex((f) => f.key === active.id),
                  modulesArray.fields.findIndex((f) => f.key === over.id),
                );
              }
            }}
            sensors={sensors}
          >
            <SortableContext
              items={modulesArray.fields.map((eventType) => eventType.key)}
              strategy={verticalListSortingStrategy}
            >
              {modulesArray.fields.map((module, eventTypeIndex) => (
                <ModuleFormSection<SessionFormValues, 'modules'>
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
            </SortableContext>
          </DndContext>
        </ul>
        <div className="px-4 py-8 sm:px-8">
          <Button
            className="w-full"
            colorScheme="transparent"
            onClick={() => modulesArray.append({ content: '', inputs: [] })}
          >
            <PlusIcon className="w-5" />
            Add module
          </Button>
        </div>
        {form.formState.errors.root && (
          <div className="px-4 py-8 text-center sm:px-8">
            {form.formState.errors.root.message}
          </div>
        )}
        <div className="flex flex-row gap-4 border-t border-alpha-1 px-4 py-8 sm:px-8">
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
      </form>
      <Dialog onClose={cancelScheduleModal} open={scheduleModal}>
        <Dialog.Backdrop className="fixed inset-0 z-20 bg-alpha-reverse-1 backdrop-blur-sm" />
        <div className="fixed inset-0 z-30 overflow-y-auto p-4">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="w-full max-w-sm rounded border border-alpha-1 bg-bg-2 p-8 text-center shadow-lg">
              <Dialog.Title className="text-2xl">Schedule session</Dialog.Title>
              <Dialog.Description className="mt-4 px-4 text-fg-4">
                Scheduled sessions are not visible to clients until the
                specified time.
              </Dialog.Description>
              <div className="mt-16 flex flex-col gap-4">
                <Input
                  min={formatDatetimeLocal(new Date(), { seconds: false })}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    e.preventDefault();
                    toggleScheduleModal(false);
                  }}
                  step={60}
                  type="datetime-local"
                  {...form.register('scheduledFor')}
                />
                <div className="flex gap-4">
                  <Button
                    className="w-full"
                    colorScheme="transparent"
                    disabled={!scheduledFor}
                    onClick={() => {
                      form.setValue('scheduledFor', null, {
                        shouldDirty: true,
                      });

                      toggleScheduleModal(false);
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    className="w-full"
                    disabled={!scheduledFor}
                    onClick={() => toggleScheduleModal(false)}
                  >
                    Schedule
                  </Button>
                </div>
                <Button
                  className="m-0 -mb-3 w-full justify-center p-0 py-3"
                  onClick={cancelScheduleModal}
                  variant="link"
                >
                  Close
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export type { SessionFormValues };
export default SessionForm;
