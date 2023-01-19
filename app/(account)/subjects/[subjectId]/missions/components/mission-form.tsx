'use client';

import { PlusIcon } from '@heroicons/react/24/solid';
import Button from 'components/button';
import Input from 'components/input';
import Label from 'components/label';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { Database } from 'types/database';
import { EventTemplate } from 'types/event-template';
import supabase from 'utilities/browser-supabase-client';
import forceArray from 'utilities/force-array';
import { GetMissionWithEventTypesData } from 'utilities/get-mission-with-routines';
import { ListInputsData } from 'utilities/list-inputs';
import { ListTemplatesData } from 'utilities/list-templates';
import sleep from 'utilities/sleep';
import SessionFormSection from './session-form-section';

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
  const router = useRouter();
  const searchParams = useSearchParams();
  const [template, setTemplate] = useState<EventTemplate | null>(null);

  const form = useForm<MissionFormValues>({
    defaultValues: {
      id: mission?.id,
      name: mission?.name ?? '',
      routines: forceArray(mission?.routines).reduce((acc, routine) => {
        if (acc[routine.session]) acc[routine.session].push(routine);
        else acc[routine.session] = [routine];
        return acc;
      }, []),
    },
  });

  const sessionsArray = useFieldArray({
    control: form.control,
    name: 'routines',
  });

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(async ({ id, name, routines }) => {
        const { data: missionData, error: missionError } = await supabase
          .from('missions')
          .upsert({ id, name, subject_id: subjectId })
          .select('id')
          .single();

        if (missionError) {
          alert(missionError.message);
          return;
        }

        form.setValue('id', missionData.id);

        const { insertedEventTypes, updatedEventTypes } = routines.reduce(
          (acc, sessionRoutines, session) => {
            sessionRoutines.forEach((routine) => {
              const payload = {
                content: routine.content,
                id: routine.id,
                mission_id: missionData.id,
                name: routine.name,
                order: acc.order,
                session,
                subject_id: subjectId,
              };

              if (routine.id) acc.updatedEventTypes.push(payload);
              else acc.insertedEventTypes.push(payload);
              acc.order++;
            });

            return acc;
          },
          {
            insertedEventTypes:
              [] as Database['public']['Tables']['event_types']['Insert'][],
            order: 0,
            updatedEventTypes:
              [] as Database['public']['Tables']['event_types']['Insert'][],
          }
        );

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

        await router.push(searchParams.get('back') ?? `/subjects/${subjectId}`);
        await router.refresh();
        await sleep();
      })}
    >
      <Label>
        Name
        <Controller
          control={form.control}
          name="name"
          render={({ field }) => <Input {...field} />}
        />
      </Label>
      {!!sessionsArray.fields.length && (
        <ul className="flex flex-col gap-6">
          {sessionsArray.fields.map((item, index) => (
            <li key={item.id}>
              <SessionFormSection
                availableInputs={availableInputs}
                availableTemplates={availableTemplates}
                form={form}
                index={index}
                setTemplate={setTemplate}
                subjectId={subjectId}
                template={template}
              />
            </li>
          ))}
        </ul>
      )}
      <Button
        className="mt-6 w-full"
        colorScheme="transparent"
        onClick={() => sessionsArray.append([[]])}
        type="button"
      >
        <PlusIcon className="w-5" />
        Add session
      </Button>
      <Button
        className="mt-6 w-full"
        loading={form.formState.isSubmitting}
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
