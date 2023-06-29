'use client';

import Alert from '@/(account)/_components/alert';
import DateTime from '@/(account)/_components/date-time';
import CacheKeys from '@/(account)/_constants/enum-cache-keys';
import useDefaultValues from '@/(account)/_hooks/use-default-values';
import { GetMissionWithSessionsData } from '@/(account)/_server/get-mission-with-sessions';
import { GetSessionData } from '@/(account)/_server/get-session';
import { ListInputsData } from '@/(account)/_server/list-inputs';
import { ListTemplatesWithDataData } from '@/(account)/_server/list-templates-with-data';
import firstIfArray from '@/(account)/_utilities/first-if-array';
import forceArray from '@/(account)/_utilities/force-array';
import formatDatetimeLocal from '@/(account)/_utilities/format-datetime-local';
import globalValueCache from '@/(account)/_utilities/global-value-cache';
import sanitizeHtml from '@/(account)/_utilities/sanitize-html';
import ModuleFormSection from '@/(account)/subjects/[subjectId]/missions/[missionId]/sessions/_components/module-form-section';
import Button from '@/_components/button';
import Input from '@/_components/input';
import useSupabase from '@/_hooks/use-supabase';
import { Database } from '@/_types/database';
import { Dialog } from '@headlessui/react';
import { useRouter } from 'next/navigation';
import { useState, useTransition } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { useBoolean } from 'usehooks-ts';

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

import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface SessionFormProps {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesWithDataData;
  mission: NonNullable<GetMissionWithSessionsData>;
  order?: number;
  session?: GetSessionData;
  subjectId: string;
}

type SessionFormValues = Database['public']['Tables']['sessions']['Row'] & {
  modules: Array<
    Database['public']['Tables']['event_types']['Row'] & {
      inputs: Array<Database['public']['Tables']['inputs']['Row']>;
    }
  >;
};

const SessionForm = ({
  availableInputs,
  availableTemplates,
  mission,
  order,
  session,
  subjectId,
}: SessionFormProps) => {
  const [isDeleteTransitioning, startDeleteTransition] = useTransition();
  const [isDuplicateTransitioning, startDuplicateTransition] = useTransition();
  const [isFormTransitioning, startFormTransition] = useTransition();
  const [isMoveLeftTransitioning, startMoveLeftTransition] = useTransition();
  const [isMoveRightTransitioning, startMoveRightTransition] = useTransition();
  const [ogScheduledFor, setOgScheduledFor] = useState<string | null>(null);
  const currentOrder = session?.order ?? order ?? 0;
  const deleteAlert = useBoolean();
  const isDeleting = useBoolean();
  const isMovingLeft = useBoolean();
  const isMovingRight = useBoolean();
  const modules = forceArray(session?.modules);
  const hasEvents = modules.some((module) => module.events?.length);
  const router = useRouter();
  const scheduleModal = useBoolean();
  const sensors = useSensors(useSensor(PointerSensor));
  const sessions = forceArray(mission.sessions);
  const totalSessions = sessions.length + (typeof order === 'number' ? 1 : 0);
  const supabase = useSupabase();

  const { nextSession, previousSession } = sessions.reduce(
    (acc, s, i) => {
      if (s.id !== session?.id) return acc;
      acc.previousSession = sessions[i - 1];
      acc.nextSession = sessions[i + 1];
      return acc;
    },
    { nextSession: null, previousSession: null }
  );

  const moduleIdEventMap = modules.reduce((acc, module) => {
    acc[module.id] = firstIfArray(module.event);
    return acc;
  }, {});

  const form = useForm<SessionFormValues>({
    defaultValues: useDefaultValues({
      cacheKey: CacheKeys.SessionForm,
      defaultValues: {
        id: session?.id,
        modules: modules.length
          ? modules.map((module) => ({
              content: module.content,
              id: module.id,
              inputs: forceArray(module?.inputs).reduce((acc, { input_id }) => {
                const input = availableInputs?.find(
                  ({ id }) => id === input_id
                );

                if (input) acc.push(input);
                return acc;
              }, []),
            }))
          : [{ content: '', inputs: [] }],
        order: currentOrder,
        scheduled_for:
          !session?.scheduled_for ||
          (session.scheduled_for &&
            new Date(session.scheduled_for) < new Date())
            ? undefined
            : formatDatetimeLocal(session.scheduled_for, { seconds: false }),
        title: session?.title,
      },
    }),
  });

  const modulesArray = useFieldArray<SessionFormValues, 'modules', 'key'>({
    control: form.control,
    keyName: 'key',
    name: 'modules',
  });

  const scheduledFor = form.watch('scheduled_for');

  const cancelScheduleModal = () => {
    form.setValue('scheduled_for', ogScheduledFor ?? null);
    setOgScheduledFor(null);
    scheduleModal.setFalse();
  };

  const openScheduleModal = () => {
    setOgScheduledFor(scheduledFor);
    scheduleModal.setTrue();
  };

  const reorderSession = (newOrder: number) =>
    supabase.from('sessions').upsert(
      sessions.reduce((acc, s) => {
        const common = { id: s.id, mission_id: mission.id };

        if (s.order === newOrder) {
          acc.push({ ...common, order: currentOrder });
        } else if (s.id === session?.id) {
          acc.push({ ...common, order: newOrder });
        }

        return acc;
      }, [])
    );

  return (
    <>
      <form
        onSubmit={form.handleSubmit(async (values) => {
          const { error: sessionsError } = await supabase
            .from('sessions')
            .upsert(
              sessions
                .filter((session) => session.id !== values.id)
                .map((session, index) => ({
                  id: session.id,
                  mission_id: mission.id,
                  order: index < values.order ? index : index + 1,
                }))
            );

          if (sessionsError) {
            alert(sessionsError.message);
            return;
          }

          const { data: sessionData, error: sessionError } = await supabase
            .from('sessions')
            .upsert({
              id: values.id,
              mission_id: mission.id,
              order: values.order,
              scheduled_for: values.scheduled_for
                ? new Date(values.scheduled_for).toISOString()
                : null,
              title: values.title,
            })
            .select('id')
            .single();

          if (sessionError) {
            alert(sessionError.message);
            return;
          }

          form.setValue('id', sessionData.id);

          const { insertedEventTypes, updatedEventTypes } =
            values.modules.reduce(
              (acc, module, order) => {
                const payload: Database['public']['Tables']['event_types']['Insert'] =
                  {
                    content: sanitizeHtml(module.content),
                    order,
                    session_id: sessionData.id,
                    subject_id: subjectId,
                  };

                if (module.id) {
                  payload.id = module.id;
                  acc.updatedEventTypes.push(payload);
                } else {
                  acc.insertedEventTypes.push(payload);
                }

                return acc;
              },
              {
                insertedEventTypes: [] as Array<
                  Database['public']['Tables']['event_types']['Insert']
                >,
                updatedEventTypes: [] as Array<
                  Database['public']['Tables']['event_types']['Insert']
                >,
              }
            );

          const deletedEventTypeIds = modules.reduce((acc, module) => {
            if (!updatedEventTypes.some(({ id }) => id === module.id)) {
              acc.push(module.id);
            }

            return acc;
          }, [] as string[]);

          if (deletedEventTypeIds.length) {
            const { error: deletedEventTypesError } = await supabase
              .from('event_types')
              .update({ deleted: true })
              .in('id', deletedEventTypeIds);

            if (deletedEventTypesError) {
              alert(deletedEventTypesError.message);
              return;
            }
          }

          if (updatedEventTypes.length) {
            const { error: updateEventTypesError } = await supabase
              .from('event_types')
              .upsert(updatedEventTypes);

            if (updateEventTypesError) {
              alert(updateEventTypesError.message);
              return;
            }
          }

          if (insertedEventTypes.length) {
            const { data: insertEventTypesData, error: insertEventTypesError } =
              await supabase
                .from('event_types')
                .upsert(insertedEventTypes)
                .select('id');

            if (insertEventTypesError) {
              alert(insertEventTypesError.message);
              return;
            }

            const insertEventTypesDataReverse = insertEventTypesData.reverse();

            form.setValue(
              'modules',
              values.modules.map((module) => {
                if (module.id) return module;
                const id = insertEventTypesDataReverse.pop()?.id;
                if (!id) return module;
                return { ...module, id };
              })
            );
          }

          const { deleteEventTypeInputs, insertEventTypeInputs } = form
            .getValues('modules')
            .reduce(
              (acc, module) => {
                if (module.id) acc.deleteEventTypeInputs.push(module.id);

                module.inputs.forEach((input, order) => {
                  acc.insertEventTypeInputs.push({
                    event_type_id: module.id,
                    input_id: input.id,
                    order,
                  });
                });

                return acc;
              },
              {
                deleteEventTypeInputs: [] as string[],
                insertEventTypeInputs: [] as Array<
                  Database['public']['Tables']['event_type_inputs']['Insert']
                >,
              }
            );

          if (deleteEventTypeInputs.length) {
            const { error: deleteEventTypeInputsError } = await supabase
              .from('event_type_inputs')
              .delete()
              .in('event_type_id', deleteEventTypeInputs);

            if (deleteEventTypeInputsError) {
              alert(deleteEventTypeInputsError.message);
              return;
            }
          }

          if (insertEventTypeInputs.length) {
            const { error: insertEventTypeInputsError } = await supabase
              .from('event_type_inputs')
              .insert(insertEventTypeInputs);

            if (insertEventTypeInputsError) {
              alert(insertEventTypeInputsError.message);
              return;
            }
          }

          startFormTransition(() => {
            router.refresh();

            router.push(
              `/subjects/${subjectId}/missions/${mission.id}/sessions/${sessionData.id}/edit`
            );
          });
        })}
      >
        <div className="flex flex-wrap justify-center gap-2 px-4">
          <Button
            colorScheme="transparent"
            disabled={hasEvents}
            onClick={openScheduleModal}
            size="sm"
          >
            <ClockIcon className="-ml-1 w-5" />
            {scheduledFor ? (
              <DateTime date={scheduledFor} formatter="date-time" />
            ) : (
              'Schedule'
            )}
          </Button>
          <Button
            colorScheme="transparent"
            disabled={!session || isDuplicateTransitioning}
            onClick={() => {
              if (!session) return;
              const newOrder = currentOrder + 1;
              const values = form.getValues();

              globalValueCache.set(CacheKeys.SessionForm, {
                modules: values.modules.map((module) => ({
                  content: module.content,
                  inputs: module.inputs,
                  order: module.order,
                })),
                order: newOrder,
                scheduled_for: values.scheduled_for,
                title: values.title,
              });

              startDuplicateTransition(() => {
                router.push(
                  `/subjects/${subjectId}/missions/${mission.id}/sessions/create/${newOrder}?useCache=true`
                );
              });
            }}
            size="sm"
          >
            <DocumentDuplicateIcon className="-ml-1 w-5" />
            Duplicate
          </Button>
          <div className="flex gap-2">
            <Button
              colorScheme="transparent"
              disabled={!session}
              onClick={deleteAlert.setTrue}
              size="sm"
            >
              <TrashIcon className="-ml-1 w-5" />
              Delete
            </Button>
            <Button
              colorScheme="transparent"
              disabled={
                currentOrder < 1 ||
                isMovingLeft.value ||
                isMoveLeftTransitioning
              }
              onClick={async () => {
                const newOrder = currentOrder - 1;

                if (session) {
                  isMovingLeft.setTrue();
                  await reorderSession(newOrder);
                  isMovingLeft.setFalse();
                  startMoveLeftTransition(router.refresh);
                } else {
                  globalValueCache.set(CacheKeys.SessionForm, {
                    ...form.getValues(),
                    order: newOrder,
                  });

                  startMoveLeftTransition(() =>
                    router.push(
                      `/subjects/${subjectId}/missions/${mission.id}/sessions/create/${newOrder}?useCache=true`
                    )
                  );
                }
              }}
              size="sm"
            >
              <ArrowLeftIcon className="-ml-1 w-5" />
              Move
            </Button>
            <Button
              colorScheme="transparent"
              disabled={
                currentOrder >= totalSessions - 1 ||
                isMovingRight.value ||
                isMoveRightTransitioning
              }
              onClick={async () => {
                const newOrder = currentOrder + 1;

                if (session) {
                  isMovingRight.setTrue();
                  await reorderSession(newOrder);
                  isMovingRight.setFalse();
                  startMoveRightTransition(router.refresh);
                } else {
                  globalValueCache.set(CacheKeys.SessionForm, {
                    ...form.getValues(),
                    order: newOrder,
                  });

                  startMoveRightTransition(() =>
                    router.push(
                      `/subjects/${subjectId}/missions/${mission.id}/sessions/create/${newOrder}?useCache=true`
                    )
                  );
                }
              }}
              size="sm"
            >
              Move
              <ArrowRightIcon className="-mr-1 w-5" />
            </Button>
          </div>
        </div>
        <div className="form mt-10">
          <Input placeholder="Session title" {...form.register('title')} />
        </div>
        <ul className="mt-4 space-y-4">
          <DndContext
            collisionDetection={closestCenter}
            id="modules"
            onDragEnd={(event: DragEndEvent) => {
              const { active, over } = event;

              if (over && active.id !== over.id) {
                modulesArray.move(
                  modulesArray.fields.findIndex((f) => f.key === active.id),
                  modulesArray.fields.findIndex((f) => f.key === over.id)
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
                <ModuleFormSection<SessionFormValues>
                  availableInputs={availableInputs}
                  availableTemplates={availableTemplates}
                  event={moduleIdEventMap[module.id]}
                  eventTypeArray={modulesArray as any}
                  eventTypeIndex={eventTypeIndex}
                  eventTypeKey={module.key}
                  form={form}
                  hasOnlyOne={modulesArray.fields.length === 1}
                  key={module.key}
                />
              ))}
            </SortableContext>
          </DndContext>
        </ul>
        <div className="form mt-4">
          <Button
            className="w-full"
            colorScheme="transparent"
            onClick={() =>
              modulesArray.append({ content: '', inputs: [] } as any)
            }
          >
            <PlusIcon className="w-5" />
            Add module
          </Button>
          <Button
            className="w-full"
            loading={form.formState.isSubmitting || isFormTransitioning}
            loadingText="Saving…"
            type="submit"
          >
            Save session
          </Button>
        </div>
      </form>
      <Alert
        confirmText="Delete session"
        isConfirming={isDeleting.value || isDeleteTransitioning}
        isConfirmingText="Deleting session…"
        onConfirm={async () => {
          if (!session) return;
          isDeleting.setTrue();

          const { error } = await supabase
            .from('sessions')
            .update({ deleted: true })
            .eq('id', session.id);

          isDeleting.setFalse();

          if (error) {
            alert(error.message);
            return;
          }

          startDeleteTransition(() => {
            let suffix = '';
            if (nextSession) suffix = `/${nextSession.id}/edit`;
            else if (previousSession) suffix = `/${previousSession.id}/edit`;
            router.refresh();

            router.replace(
              `/subjects/${subjectId}/missions/${mission.id}/sessions${suffix}`
            );
          });
        }}
        {...deleteAlert}
      />
      <Dialog
        className="relative z-10"
        onClose={cancelScheduleModal}
        open={scheduleModal.value}
      >
        <div className="fixed inset-0 bg-alpha-reverse-2 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center">
            <Dialog.Panel className="w-full max-w-sm transform rounded border border-alpha-1 bg-bg-2 p-8 text-center shadow-lg transition-all">
              <Dialog.Title className="text-2xl">Schedule session</Dialog.Title>
              <Dialog.Description className="mt-4 px-4 text-fg-3">
                Scheduled sessions are not visible to clients until the
                specified time.
              </Dialog.Description>
              <div className="mt-16 flex flex-col gap-4">
                <Input
                  min={formatDatetimeLocal(new Date(), { seconds: false })}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    e.preventDefault();
                    scheduleModal.setFalse();
                  }}
                  step={60}
                  type="datetime-local"
                  {...form.register('scheduled_for')}
                />
                <div className="flex gap-4">
                  <Button
                    className="w-full"
                    colorScheme="transparent"
                    disabled={!scheduledFor}
                    onClick={() => {
                      form.setValue('scheduled_for', null);
                      scheduleModal.setFalse();
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    className="w-full"
                    disabled={!scheduledFor}
                    onClick={scheduleModal.setFalse}
                  >
                    Schedule
                  </Button>
                </div>
                <Button
                  className="m-0 -mb-3 w-full justify-center p-0 py-3"
                  onClick={cancelScheduleModal}
                  variant="link"
                >
                  Cancel
                </Button>
              </div>
            </Dialog.Panel>
          </div>
        </div>
      </Dialog>
    </>
  );
};

export default SessionForm;
