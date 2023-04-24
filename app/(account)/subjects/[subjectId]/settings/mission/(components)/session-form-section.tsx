import Alert from '(components)/alert';
import Button from '(components)/button';
import DateTime from '(components)/date-time';
import Input from '(components)/input';
import Menu from '(components)/menu';
import { Database } from '(types)/database';
import forceArray from '(utilities)/force-array';
import formatDatetimeLocal from '(utilities)/format-datetime-local';
import { GetMissionWithEventTypesData } from '(utilities)/get-mission-with-routines';
import { ListInputsData } from '(utilities)/list-inputs';
import { ListTemplatesData } from '(utilities)/list-templates';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useBoolean } from 'usehooks-ts';
import RoutinesFormSection from './routines-form-section';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ClockIcon,
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import {
  FieldValues,
  PathValue,
  UseFieldArrayReturn,
  UseFormReturn,
} from 'react-hook-form';

interface SessionFormSectionProps<T extends FieldValues> {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesData;
  form: UseFormReturn<T>;
  routineEventsMap: Record<
    string,
    GetMissionWithEventTypesData['sessions'][0]['routines'][0]['event']
  >;
  sessionArray: UseFieldArrayReturn<T, T[string]>;
  sessionIndex: number;
  userId: string;
}

const SessionFormSection = <T extends FieldValues>({
  availableInputs,
  availableTemplates,
  form,
  routineEventsMap,
  sessionArray,
  sessionIndex,
  userId,
}: SessionFormSectionProps<T>) => {
  const deleteAlert = useBoolean();
  const scheduleModal = useBoolean();

  const sessionsField = 'sessions' as T[string];

  const scheduledForField =
    `sessions.${sessionIndex}.scheduled_for` as T[string];

  const unscheduledSessions = form
    .watch(sessionsField)
    .filter(
      (s: Database['public']['Tables']['sessions']['Insert']) =>
        !s.scheduled_for
    );

  const scheduledFor = form.watch(scheduledForField);

  const [originalScheduledFor, setOriginalScheduledFor] =
    useState(scheduledFor);

  const reorderSession = () => {
    const sessions = form.watch(sessionsField);
    const scheduledFor = form.watch(scheduledForField);

    const toIndex = sessions.findIndex(
      (session: Database['public']['Tables']['sessions']['Insert']) =>
        session.scheduled_for &&
        (!scheduledFor ||
          new Date(session.scheduled_for) > new Date(scheduledFor))
    );

    sessionArray.move(
      sessionIndex,
      toIndex === -1 ? sessions.length - 1 : toIndex
    );
  };

  const openScheduleModal = () => {
    setOriginalScheduledFor(scheduledFor);
    scheduleModal.setTrue();
  };

  const cancelScheduleModal = () => {
    form.setValue(
      scheduledForField,
      originalScheduledFor as PathValue<T, T[string]>
    );

    scheduleModal.setFalse();
  };

  const confirmScheduleModal = () => {
    reorderSession();
    scheduleModal.setFalse();
  };

  return (
    <li>
      <Dialog
        className="relative z-10"
        onClose={cancelScheduleModal}
        open={scheduleModal.value}
      >
        <div className="fixed inset-0 bg-alpha-reverse-2 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2">
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
                    confirmScheduleModal();
                  }}
                  step={60}
                  type="datetime-local"
                  {...form.register(scheduledForField)}
                />
                <div className="flex gap-4">
                  <Button
                    className="w-full"
                    colorScheme="transparent"
                    disabled={!scheduledFor}
                    onClick={() => {
                      form.setValue(
                        scheduledForField,
                        null as PathValue<T, T[string]>
                      );

                      confirmScheduleModal();
                    }}
                  >
                    Clear
                  </Button>
                  <Button
                    className="w-full"
                    disabled={!scheduledFor}
                    onClick={confirmScheduleModal}
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
      <Alert
        confirmText="Delete session"
        onConfirm={() => sessionArray.remove(sessionIndex)}
        {...deleteAlert}
      />
      <div className="mt-2 flex max-w-none items-end justify-between px-2 pb-2">
        <span className="text-xl text-fg-1">Session {sessionIndex + 1}</span>
        <div className="flex items-end gap-4">
          {scheduledFor && (
            <Button
              className="relative -top-px"
              onClick={openScheduleModal}
              variant="link"
            >
              <ClockIcon className="w-5 text-fg-3" />
              <span className="text-fg-3">&mdash;</span>
              <DateTime date={scheduledFor} formatter="date-time" />
            </Button>
          )}
          <Menu className="-m-3 p-3">
            <Menu.Button className="relative right-px -m-3 p-3">
              <EllipsisHorizontalIcon className="relative -top-0.5 w-5" />
            </Menu.Button>
            <Menu.Items>
              <Menu.Item onClick={openScheduleModal}>
                <ClockIcon className="w-5 text-fg-3" />
                Schedule session
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  sessionArray.insert(sessionIndex, {
                    routines: [],
                    scheduled_for: scheduledFor,
                  } as PathValue<T, T[string]>)
                }
              >
                <PlusIcon className="w-5 text-fg-3" />
                Add session above
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  const from = form.watch(sessionsField)[sessionIndex];

                  const to = {
                    routines: from.routines.map(
                      (
                        routine: Database['public']['Tables']['event_types']['Insert'] & {
                          inputs: Database['public']['Tables']['inputs']['Insert'][];
                        }
                      ) => ({
                        content: routine.content,
                        inputs: routine.inputs,
                      })
                    ),
                    scheduled_for: from.scheduled_for,
                  } as PathValue<T, T[string]>;

                  const toIndex = sessionIndex + 1;

                  sessionArray.insert(toIndex, to, {
                    focusName: `sessions.${toIndex}.routines.0.content`,
                  });
                }}
              >
                <DocumentDuplicateIcon className="w-5 text-fg-3" />
                Duplicate session
              </Menu.Item>
              {sessionIndex !== 0 && !scheduledFor && (
                <Menu.Item
                  onClick={() => {
                    sessionArray.move(sessionIndex, sessionIndex - 1);
                  }}
                >
                  <ArrowUpIcon className="w-5 text-fg-3" />
                  Move session up
                </Menu.Item>
              )}
              {sessionIndex !== unscheduledSessions.length - 1 &&
                !scheduledFor && (
                  <Menu.Item
                    onClick={() =>
                      sessionArray.move(sessionIndex, sessionIndex + 1)
                    }
                  >
                    <ArrowDownIcon className="w-5 text-fg-3" />
                    Move session down
                  </Menu.Item>
                )}
              <Menu.Item onClick={deleteAlert.setTrue}>
                <TrashIcon className="w-5 text-fg-3" />
                Delete session
              </Menu.Item>
            </Menu.Items>
          </Menu>
        </div>
      </div>
      <RoutinesFormSection<T>
        form={form}
        inputOptions={forceArray(availableInputs)}
        routineEventsMap={routineEventsMap}
        sessionIndex={sessionIndex}
        templateOptions={forceArray(availableTemplates)}
        userId={userId}
      />
    </li>
  );
};

export default SessionFormSection;
