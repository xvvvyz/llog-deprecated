'use client';

import Button from '(components)/button';
import Input from '(components)/input';
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
import { useForm } from 'react-hook-form';
import SessionsFormSection from './sessions-form-section';

interface MissionFormProps {
  availableInputs: ListInputsData;
  availableTemplates: ListTemplatesData;
  mission?: GetMissionWithEventTypesData;
  subjectId: string;
  userId: string;
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
  userId,
}: MissionFormProps) => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const routines = forceArray(mission?.routines);
  const routineEventsMap: Record<string, any> = {};

  const defaultValues = useDefaultValues({
    cacheKey: CacheKeys.MissionForm,
    defaultValues: {
      id: mission?.id,
      name: mission?.name ?? '',
      routines: routines.reduce((acc, routine) => {
        routineEventsMap[routine.id] = firstIfArray(routine.event);

        const inputs = routine.inputs.map(
          ({
            input,
          }: {
            input: Database['public']['Tables']['inputs']['Row'];
          }) => input
        );

        const formattedRoutine = {
          content: routine.content,
          id: routine.id,
          inputs,
          type: routine.type,
        };

        if (acc[routine.session]) acc[routine.session].push(formattedRoutine);
        else acc[routine.session] = [formattedRoutine];
        return acc;
      }, []),
    },
  });

  const form = useForm<MissionFormValues>({ defaultValues });

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
      <Input label="Name" {...form.register('name')} />
      <SessionsFormSection<MissionFormValues>
        availableInputs={availableInputs}
        availableTemplates={availableTemplates}
        form={form}
        routineEventsMap={routineEventsMap}
        subjectId={subjectId}
        userId={userId}
      />
      <Button
        className="mt-8 w-full"
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        Save mission
      </Button>
    </form>
  );
};

export type { MissionFormValues };
export default MissionForm;
