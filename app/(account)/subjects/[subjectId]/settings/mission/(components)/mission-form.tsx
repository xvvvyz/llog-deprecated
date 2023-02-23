'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import Label, { LabelSpan } from '(components)/label';
import Menu from '(components)/menu';
import { Database } from '(types)/database';
import supabase from '(utilities)/browser-supabase-client';
import CacheKeys from '(utilities)/enum-cache-keys';
import firstIfArray from '(utilities)/first-if-array';
import forceArray from '(utilities)/force-array';
import useDefaultValues from '(utilities)/get-default-values';
import { GetMissionWithEventTypesData } from '(utilities)/get-mission-with-routines';
import { ListInputsData } from '(utilities)/list-inputs';
import { ListTemplatesData } from '(utilities)/list-templates';
import sanitizeHtml from '(utilities)/sanitize-html';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import RoutinesFormSection from './routines-form-section';

import {
  DocumentDuplicateIcon,
  EllipsisHorizontalIcon,
  PlusIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

interface MissionFormProps {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesData;
  mission?: GetMissionWithEventTypesData;
  subjectId: string;
}

type MissionFormValues = Database['public']['Tables']['missions']['Insert'] & {
  routines: (Database['public']['Tables']['event_types']['Insert'] & {
    inputs: Database['public']['Tables']['inputs']['Row'][];
  })[][];
};

const MissionForm = ({
  availableInputs,
  availableTemplates,
  mission,
  subjectId,
}: MissionFormProps) => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const routines = forceArray(mission?.routines);

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.MissionForm,
    defaultValues: {
      id: mission?.id,
      name: mission?.name ?? '',
      routines: routines.reduce((acc, routine) => {
        const event = firstIfArray(routine.event);

        const inputs = routine.inputs.map(
          ({
            input,
          }: {
            input: Database['public']['Tables']['inputs']['Row'];
          }) => input
        );

        const formattedRoutine = { ...routine, event, inputs };
        if (acc[routine.session]) acc[routine.session].push(formattedRoutine);
        else acc[routine.session] = [formattedRoutine];
        return acc;
      }, []),
    },
  });

  const form = useForm<MissionFormValues>({ defaultValues });

  const sessionsArray = useFieldArray({
    control: form.control,
    name: 'routines',
  });

  return (
    <form
      className="flex flex-col gap-6 sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8"
      onSubmit={form.handleSubmit(async ({ id, name, routines }) => {
        const { data: missionData, error: missionError } = await supabase
          .from('missions')
          .upsert({ id, name: name.trim(), subject_id: subjectId })
          .select('id, name')
          .single();

        if (missionError) {
          alert(missionError.message);
          return;
        }

        form.setValue('id', missionData.id);

        const { insertedEventTypes, updatedEventTypes } = routines
          .filter((session) => session.length)
          .reduce(
            (acc, sessionRoutines, session) => {
              sessionRoutines.forEach((routine, i) => {
                const payload = {
                  content: sanitizeHtml(routine.content),
                  id: routine.id,
                  mission_id: missionData.id,
                  order: Number(`${session}.${i}`),
                  subject_id: subjectId,
                  type: routine.type,
                };

                if (routine.id) acc.updatedEventTypes.push(payload);
                else acc.insertedEventTypes.push(payload);
              });

              return acc;
            },
            {
              insertedEventTypes:
                [] as Database['public']['Tables']['event_types']['Insert'][],
              updatedEventTypes:
                [] as Database['public']['Tables']['event_types']['Insert'][],
            }
          );

        const deletedEventTypeIds = forceArray(mission?.routines).reduce(
          (acc, eventType) => {
            if (!updatedEventTypes.some(({ id }) => id === eventType.id)) {
              acc.push(eventType.id);
            }

            return acc;
          },
          []
        );

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
            'routines',
            form.getValues().routines.map((session) =>
              session.map((routine) => {
                if (routine.id) return routine;

                return {
                  ...routine,
                  id: insertEventTypesDataReverse.pop()?.id,
                };
              })
            )
          );
        }

        const { deleteEventTypeInputs, insertEventTypeInputs } = form
          .getValues()
          .routines.reduce(
            (acc, session) => {
              session.forEach((routine) => {
                if (routine.id) {
                  acc.deleteEventTypeInputs.push(routine.id);
                }

                routine.inputs.forEach((input, order) => {
                  if (!routine.id) return;

                  acc.insertEventTypeInputs.push({
                    event_type_id: routine.id,
                    input_id: input.id,
                    order,
                  });
                });
              });

              return acc;
            },
            {
              deleteEventTypeInputs: [] as string[],
              insertEventTypeInputs:
                [] as Database['public']['Tables']['event_type_inputs']['Insert'][],
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

        await redirect(`/subjects/${subjectId}`);
      })}
    >
      <Label>
        <LabelSpan>Name</LabelSpan>
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => <Input {...field} />}
        />
      </Label>
      {!!sessionsArray.fields.length && (
        <ul className="flex flex-col gap-6">
          {sessionsArray.fields.map((item, sessionIndex) => (
            <li key={item.id}>
              <LabelSpan className="mt-2 flex max-w-none items-end justify-between pb-2">
                <span className="text-xl text-fg-1">
                  Session {sessionIndex + 1}
                </span>
                <Menu className="-m-3 p-3">
                  <Menu.Button className="relative right-0.5 -m-3 p-3">
                    <EllipsisHorizontalIcon className="w-5" />
                  </Menu.Button>
                  <Menu.Items>
                    <Menu.Item
                      onClick={() =>
                        sessionsArray.insert(
                          sessionIndex + 1,
                          [
                            form
                              .getValues()
                              .routines[sessionIndex].map((routine) => ({
                                content: routine.content,
                                id: undefined,
                                inputs: routine.inputs,
                                order: 0,
                                subject_id: subjectId,
                                type: routine.type,
                              })),
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
                    <Menu.Item
                      onClick={() => sessionsArray.remove(sessionIndex)}
                    >
                      <TrashIcon className="w-5 text-fg-3" />
                      Delete session
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </LabelSpan>
              <RoutinesFormSection<MissionFormValues>
                form={form}
                inputOptions={forceArray(availableInputs)}
                sessionIndex={sessionIndex}
                templateOptions={forceArray(availableTemplates)}
              />
            </li>
          ))}
        </ul>
      )}
      <Button
        className="mt-4 w-full"
        colorScheme="transparent"
        onClick={() => sessionsArray.append([[]])}
        type="button"
      >
        <PlusIcon className="w-5" />
        Add session
      </Button>
      <Button
        className="mt-4 w-full"
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
};

export type { MissionFormValues };
export default MissionForm;
