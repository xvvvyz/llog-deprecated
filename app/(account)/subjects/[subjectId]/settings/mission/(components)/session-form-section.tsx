import Alert from '(components)/alert';
import { LabelSpan } from '(components)/label';
import Menu from '(components)/menu';
import { Database } from '(types)/database';
import EventTypes from '(utilities)/enum-event-types';
import forceArray from '(utilities)/force-array';
import { ListInputsData } from '(utilities)/list-inputs';
import { ListTemplatesData } from '(utilities)/list-templates';
import { useBoolean } from 'usehooks-ts';
import RoutinesFormSection from './routines-form-section';

import {
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import {
  FieldValues,
  UseFieldArrayReturn,
  UseFormReturn,
} from 'react-hook-form';

interface SessionFormSectionProps<T extends FieldValues> {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesData;
  form: UseFormReturn<T>;
  routineEventsMap: Record<string, any>;
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

  return (
    <li>
      <Alert
        confirmText="Delete session"
        onConfirm={() => sessionArray.remove(sessionIndex)}
        {...deleteAlert}
      />
      <LabelSpan className="mt-2 flex max-w-none items-end justify-between pb-2">
        <span className="text-xl text-fg-1">Session {sessionIndex + 1}</span>
        <Menu className="-m-3 p-3">
          <Menu.Button className="relative right-0.5 -m-3 p-3">
            <EllipsisHorizontalIcon className="w-5" />
          </Menu.Button>
          <Menu.Items>
            <Menu.Item
              onClick={() =>
                sessionArray.insert(
                  sessionIndex + 1,
                  [
                    form.getValues().routines[sessionIndex].map(
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
                    ),
                  ],
                  {
                    focusName: `routines.${sessionIndex + 1}.0.content`,
                  }
                )
              }
            >
              <DocumentDuplicateIcon className="w-5 text-fg-3" />
              Duplicate session
            </Menu.Item>
            <Menu.Item onClick={deleteAlert.setTrue}>
              <TrashIcon className="w-5 text-fg-3" />
              Delete session
            </Menu.Item>
          </Menu.Items>
        </Menu>
      </LabelSpan>
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
