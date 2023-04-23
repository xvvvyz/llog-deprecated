import Alert from '(components)/alert';
import Button from '(components)/button';
import DateTime from '(components)/date-time';
import Input from '(components)/input';
import Menu from '(components)/menu';
import { Database } from '(types)/database';
import EventTypes from '(utilities)/enum-event-types';
import forceArray from '(utilities)/force-array';
import formatDatetimeLocal from '(utilities)/format-datetime-local';
import { GetMissionWithEventTypesData } from '(utilities)/get-mission-with-routines';
import { ListInputsData } from '(utilities)/list-inputs';
import { ListTemplatesData } from '(utilities)/list-templates';
import { Dialog } from '@headlessui/react';
import { useRef } from 'react';
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
  subjectId: string;
  userId: string;
}

const SessionFormSection = <T extends FieldValues>({
  availableInputs,
  availableTemplates,
  form,
  routineEventsMap,
  sessionArray,
  sessionIndex,
  subjectId,
  userId,
}: SessionFormSectionProps<T>) => {
  const deleteAlert = useBoolean();
  const scheduleModal = useBoolean();
  const scheduleInputRef = useRef<HTMLInputElement>(null);

  const scheduledForField =
    `sessions.${sessionIndex}.scheduled_for` as T[string];

  let scheduledAt: PathValue<T, T[string]> | undefined =
    form.watch(scheduledForField);

  if (scheduledAt && new Date(scheduledAt) < new Date()) {
    scheduledAt = undefined;
  }

  const setSchedule = () => {
    if (!scheduleInputRef.current) return;
    const { value } = scheduleInputRef.current;

    if (!value) {
      scheduleInputRef.current.setCustomValidity(
        'Please enter a valid date and time'
      );

      scheduleInputRef.current.reportValidity();
      return;
    }

    form.setValue(
      scheduledForField,
      new Date(value).toISOString() as PathValue<T, T[string]>
    );

    scheduleModal.setFalse();
  };

  return (
    <li>
      <Dialog
        className="relative z-10"
        onClose={scheduleModal.toggle}
        open={scheduleModal.value}
      >
        <div className="fixed inset-0 bg-alpha-reverse-2 backdrop-blur-sm" />
        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-2">
            <Dialog.Panel className="w-full max-w-sm transform rounded border border-alpha-1 bg-bg-2 p-8 text-center shadow-lg transition-all">
              <Dialog.Title className="text-2xl">
                Schedule Session {sessionIndex + 1}
              </Dialog.Title>
              <Dialog.Description className="mt-4 px-4 text-fg-3">
                Scheduled sessions are not visible to clients until the
                specified time.
              </Dialog.Description>
              <div className="mt-16 flex flex-col gap-4">
                <Input
                  defaultValue={formatDatetimeLocal(scheduledAt, {
                    seconds: false,
                  })}
                  min={formatDatetimeLocal(new Date(), { seconds: false })}
                  onKeyDown={(e) => {
                    if (e.key !== 'Enter') return;
                    e.preventDefault();
                    setSchedule();
                  }}
                  ref={scheduleInputRef}
                  step={60}
                  type="datetime-local"
                />
                <div className="flex gap-4">
                  {scheduledAt && (
                    <Button
                      className="w-full"
                      colorScheme="transparent"
                      onClick={() => {
                        form.setValue(
                          scheduledForField,
                          undefined as PathValue<T, T[string]>
                        );

                        scheduleModal.setFalse();
                      }}
                    >
                      Unschedule
                    </Button>
                  )}
                  <Button className="w-full" onClick={setSchedule}>
                    Schedule
                  </Button>
                </div>
                <Button
                  className="m-0 -mb-3 w-full justify-center p-0 py-3"
                  onClick={scheduleModal.setFalse}
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
          {scheduledAt && (
            <Button
              className="relative -top-px"
              onClick={scheduleModal.setTrue}
              variant="link"
            >
              <ClockIcon className="w-5 text-fg-3" />
              <span className="text-fg-3">&mdash;</span>
              <DateTime date={scheduledAt} formatter="date-time" />
            </Button>
          )}
          <Menu className="-m-3 p-3">
            <Menu.Button className="relative right-px -m-3 p-3">
              <EllipsisHorizontalIcon className="relative -top-0.5 w-5" />
            </Menu.Button>
            <Menu.Items>
              <Menu.Item onClick={scheduleModal.setTrue}>
                <ClockIcon className="w-5 text-fg-3" />
                Schedule session
              </Menu.Item>
              <Menu.Item
                onClick={() =>
                  sessionArray.insert(sessionIndex, [[]] as PathValue<
                    T,
                    T[string]
                  >)
                }
              >
                <PlusIcon className="w-5 text-fg-3" />
                Add session above
              </Menu.Item>
              <Menu.Item
                onClick={() => {
                  const from = form.getValues().routines[sessionIndex];

                  const to = from.map(
                    (
                      routine: Database['public']['Tables']['event_types']['Insert'] & {
                        inputs: Database['public']['Tables']['inputs']['Row'][];
                      }
                    ) => ({
                      content: routine.content,
                      id: undefined,
                      inputs: routine.inputs,
                      order: 0,
                      subject_id: subjectId,
                      type: EventTypes.Routine,
                    })
                  );

                  to.config = from.config;

                  sessionArray.insert(sessionIndex + 1, [to], {
                    focusName: `routines.${sessionIndex + 1}.0.content`,
                  });
                }}
              >
                <DocumentDuplicateIcon className="w-5 text-fg-3" />
                Duplicate session
              </Menu.Item>
              {sessionIndex !== 0 && (
                <Menu.Item
                  onClick={() => {
                    sessionArray.move(sessionIndex, sessionIndex - 1);
                  }}
                >
                  <ArrowUpIcon className="w-5 text-fg-3" />
                  Move session up
                </Menu.Item>
              )}
              {sessionIndex !== sessionArray.fields.length - 1 && (
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
