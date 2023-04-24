'use client';

import Button from '(components)/button';
import Input from '(components)/input';
import { Database } from '(types)/database';
import supabase from '(utilities)/browser-supabase-client';
import CacheKeys from '(utilities)/enum-cache-keys';
import EventTypes from '(utilities)/enum-event-types';
import firstIfArray from '(utilities)/first-if-array';
import forceArray from '(utilities)/force-array';
import formatDatetimeLocal from '(utilities)/format-datetime-local';
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

type MissionFormValues = Database['public']['Tables']['missions']['Row'] & {
  sessions: Array<
    Database['public']['Tables']['sessions']['Row'] & {
      routines: Array<
        Database['public']['Tables']['event_types']['Row'] & {
          inputs: Array<Database['public']['Tables']['inputs']['Row']>;
        }
      >;
    }
  >;
};

const MissionForm = ({
  availableInputs,
  availableTemplates,
  mission,
  subjectId,
  userId,
}: MissionFormProps) => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const sessions = forceArray(mission?.sessions);

  const routineEventsMap: Record<
    string,
    GetMissionWithEventTypesData['sessions'][0]['routines'][0]['event']
  > = {};

  const form = useForm<MissionFormValues>({
    defaultValues: useDefaultValues({
      cacheKey: CacheKeys.MissionForm,
      defaultValues: {
        id: mission?.id,
        name: mission?.name ?? '',
        sessions: sessions.map((s) => {
          const session = firstIfArray(s);

          return {
            ...session,
            routines: forceArray(session?.routines).map((r) => {
              const routine = firstIfArray(r);
              routineEventsMap[routine.id] = firstIfArray(routine.event);

              return {
                ...routine,
                inputs: forceArray(routine?.inputs).reduce(
                  (acc, { input_id }) => {
                    const input = availableInputs?.find(
                      ({ id }) => id === input_id
                    );

                    if (input) acc.push(input);
                    return acc;
                  },
                  []
                ),
              };
            }),
            scheduled_for:
              !session.scheduled_for ||
              (session.scheduled_for &&
                new Date(session.scheduled_for) < new Date())
                ? undefined
                : formatDatetimeLocal(session.scheduled_for, {
                    seconds: false,
                  }),
          };
        }),
      },
    }),
  });

  return (
    <form
      className="flex flex-col gap-6 sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8"
      onSubmit={form.handleSubmit(async (values) => {
        const { data: missionData, error: missionError } = await supabase
          .from('missions')
          .upsert({
            id: values.id,
            name: values.name.trim(),
            subject_id: subjectId,
          })
          .select('id, name')
          .single();

        if (missionError) {
          alert(missionError.message);
          return;
        }

        form.setValue('id', missionData.id);

        const { insertedSessions, updatedSessions } = values.sessions.reduce(
          (acc, session, order) => {
            const payload: Database['public']['Tables']['sessions']['Insert'] =
              {
                mission_id: missionData.id,
                order,
                scheduled_for: session.scheduled_for
                  ? new Date(session.scheduled_for).toISOString()
                  : null,
              };

            if (session.id) {
              payload.id = session.id;
              acc.updatedSessions.push(payload);
            } else {
              acc.insertedSessions.push(payload);
            }

            return acc;
          },
          {
            insertedSessions: [] as Array<
              Database['public']['Tables']['sessions']['Insert']
            >,
            updatedSessions: [] as Array<
              Database['public']['Tables']['sessions']['Insert']
            >,
          }
        );

        const deletedSessionIds = sessions.reduce((acc, s) => {
          const session = firstIfArray(s);

          if (!updatedSessions.some(({ id }) => id === session.id)) {
            acc.push(session.id);
          }

          return acc;
        }, [] as string[]);

        if (deletedSessionIds.length) {
          const { error: deleteSessionsError } = await supabase
            .from('sessions')
            .update({ deleted: true })
            .in('id', deletedSessionIds);

          if (deleteSessionsError) {
            alert(deleteSessionsError.message);
            return;
          }
        }

        if (updatedSessions.length) {
          const { error: updateSessionsError } = await supabase
            .from('sessions')
            .upsert(updatedSessions);

          if (updateSessionsError) {
            alert(updateSessionsError.message);
            return;
          }
        }

        if (insertedSessions.length) {
          const { data: insertSessionsData, error: insertSessionsError } =
            await supabase
              .from('sessions')
              .upsert(insertedSessions)
              .select('id');

          if (insertSessionsError) {
            alert(insertSessionsError.message);
            return;
          }

          const insertSessionsDataReverse = insertSessionsData.reverse();

          form.setValue(
            'sessions',
            form.getValues().sessions.map((session) => {
              if (session.id) return session;
              const id = insertSessionsDataReverse.pop()?.id;
              if (!id) return session;
              return { ...session, id };
            })
          );
        }

        const { insertedEventTypes, updatedEventTypes } = form
          .getValues('sessions')
          .reduce(
            (acc, session) => {
              session.routines.map((routine, order) => {
                const payload: Database['public']['Tables']['event_types']['Insert'] =
                  {
                    content: sanitizeHtml(routine.content),
                    order,
                    session_id: session.id,
                    subject_id: subjectId,
                    type: EventTypes.Routine,
                  };

                if (routine.id) {
                  payload.id = routine.id;
                  acc.updatedEventTypes.push(payload);
                } else {
                  acc.insertedEventTypes.push(payload);
                }
              });

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

        const deletedEventTypeIds = sessions.reduce((acc, s) => {
          const session = firstIfArray(s);

          forceArray(session?.routines).forEach((routine) => {
            if (!updatedEventTypes.some(({ id }) => id === routine.id)) {
              acc.push(routine.id);
            }
          });

          return acc;
        }, []);

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
            'sessions',
            form.getValues().sessions.map((session) => ({
              ...session,
              routines: session.routines.map((routine) => {
                if (routine.id) return routine;
                const id = insertEventTypesDataReverse.pop()?.id;
                if (!id) return routine;
                return { ...routine, id };
              }),
            }))
          );
        }

        const { deleteEventTypeInputs, insertEventTypeInputs } = form
          .getValues()
          .sessions.reduce(
            (acc, session) => {
              session.routines.forEach((routine) => {
                if (routine.id) acc.deleteEventTypeInputs.push(routine.id);

                routine.inputs.forEach((input, order) => {
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

        await redirect(`/subjects/${subjectId}`);
      })}
    >
      <Input label="Name" {...form.register('name')} />
      <SessionsFormSection<MissionFormValues>
        availableInputs={availableInputs}
        availableTemplates={availableTemplates}
        form={form}
        routineEventsMap={routineEventsMap}
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
