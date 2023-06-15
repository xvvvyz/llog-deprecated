import Alert from '@/(account)/_components/alert';
import DateTime from '@/(account)/_components/date-time';
import Menu from '@/(account)/_components/menu';
import { GetMissionWithEventTypesData } from '@/(account)/_server/get-mission-with-event-types';
import { ListInputsData } from '@/(account)/_server/list-inputs';
import { ListTemplatesData } from '@/(account)/_server/list-templates';
import firstIfArray from '@/(account)/_utilities/first-if-array';
import forceArray from '@/(account)/_utilities/force-array';
import formatDatetimeLocal from '@/(account)/_utilities/format-datetime-local';
import Button from '@/_components/button';
import Input from '@/_components/input';
import { Database } from '@/_types/database';
import { Dialog } from '@headlessui/react';
import { useState } from 'react';
import { useBoolean } from 'usehooks-ts';
import PartsFormSection from './parts-form-section';

import {
  ArrowDownIcon,
  ArrowUpIcon,
  ArrowUpRightIcon,
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
  availableInputs: NonNullable<ListInputsData>;
  availableTemplates: ListTemplatesData;
  eventsMap: Record<
    string,
    GetMissionWithEventTypesData['sessions'][0]['parts'][0]['event']
  >;
  form: UseFormReturn<T>;
  missionId?: string;
  sessionArray: UseFieldArrayReturn<T, T[string]>;
  sessionIndex: number;
  subjectId: string;
  userId?: string;
}

const SessionFormSection = <T extends FieldValues>({
  availableInputs,
  availableTemplates,
  eventsMap,
  form,
  missionId,
  sessionArray,
  sessionIndex,
  subjectId,
  userId,
}: SessionFormSectionProps<T>) => {
  const deleteAlert = useBoolean();
  const scheduleModal = useBoolean();
  const sessionsField = 'sessions' as T[string];

  const scheduledForField =
    `sessions.${sessionIndex}.scheduled_for` as T[string];

  const sessions = form.watch(sessionsField);
  const session = sessions[sessionIndex];

  const unscheduledSessions = sessions.filter(
    (s: Database['public']['Tables']['sessions']['Insert']) => !s.scheduled_for
  );

  const scheduledFor = form.watch(scheduledForField);

  const [originalScheduledFor, setOriginalScheduledFor] =
    useState(scheduledFor);

  const { completedParts, totalParts } = session.parts.reduce(
    (
      acc: { completedParts: number; totalParts: number },
      part: GetMissionWithEventTypesData['sessions'][0]['parts'][0]
    ) => {
      acc.totalParts += 1;
      if (firstIfArray(part.event)) acc.completedParts += 1;
      return acc;
    },
    { completedParts: 0, totalParts: 0 }
  );

  const reorderSession = () => {
    const scheduledFor = form.getValues(scheduledForField);

    const toIndex = sessions.findIndex(
      (session: Database['public']['Tables']['sessions']['Insert']) =>
        session.scheduled_for &&
        (!scheduledFor || session.scheduled_for > (scheduledFor as string))
    );

    sessionArray.move(
      sessionIndex,
      toIndex === -1
        ? sessions.length - 1
        : toIndex < sessionIndex
        ? toIndex
        : toIndex - 1
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
          {!!completedParts && (
            <Button
              className="relative -top-px"
              href={`/subjects/${subjectId}/mission/${missionId}/session/${session.id}`}
              target="_blank"
              variant="link"
            >
              {completedParts} of {totalParts} completed
              <ArrowUpRightIcon className="w-5" />
            </Button>
          )}
          {scheduledFor && !completedParts && (
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
              {!completedParts && (
                <Menu.Item onClick={openScheduleModal}>
                  <ClockIcon className="w-5 text-fg-3" />
                  Schedule session
                </Menu.Item>
              )}
              <Menu.Item
                onClick={() =>
                  sessionArray.insert(sessionIndex, {
                    parts: [],
                    scheduled_for: scheduledFor,
                  } as PathValue<T, T[string]>)
                }
              >
                <PlusIcon className="w-5 text-fg-3" />
                Add session above
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  const to = {
                    parts: session.parts.map(
                      (
                        part: Database['public']['Tables']['event_types']['Insert'] & {
                          inputs: Database['public']['Tables']['inputs']['Insert'][];
                        }
                      ) => ({
                        content: part.content,
                        inputs: part.inputs,
                      })
                    ),
                    scheduled_for: session.scheduled_for,
                  } as PathValue<T, T[string]>;

                  const toIndex = sessionIndex + 1;

                  sessionArray.insert(toIndex, to, {
                    focusName: `sessions.${toIndex}.parts.0.content`,
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
      <PartsFormSection<T>
        eventsMap={eventsMap}
        form={form}
        inputOptions={availableInputs}
        sessionIndex={sessionIndex}
        templateOptions={forceArray(availableTemplates)}
        userId={userId}
      />
    </li>
  );
};

export default SessionFormSection;
