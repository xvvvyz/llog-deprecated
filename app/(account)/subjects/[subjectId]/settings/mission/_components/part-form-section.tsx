import Alert from '@/(account)/_components/alert';
import Avatar from '@/(account)/_components/avatar';
import DateTime from '@/(account)/_components/date-time';
import IconButton from '@/(account)/_components/icon-button';
import Menu from '@/(account)/_components/menu';
import RichTextarea from '@/(account)/_components/rich-textarea';
import Select from '@/(account)/_components/select';
import CacheKeys from '@/(account)/_constants/enum-cache-keys';
import useBackLink from '@/(account)/_hooks/use-back-link';
import { GetMissionWithEventTypesData } from '@/(account)/_server/get-mission-with-event-types';
import { ListInputsData } from '@/(account)/_server/list-inputs';
import forceArray from '@/(account)/_utilities/force-array';
import formatCacheLink from '@/(account)/_utilities/format-cache-link';
import globalValueCache from '@/(account)/_utilities/global-value-cache';
import EventCommentForm from '@/(account)/subjects/[subjectId]/_components/event-comment-form';
import EventComments from '@/(account)/subjects/[subjectId]/_components/event-comments';
import EventInputs from '@/(account)/subjects/[subjectId]/_components/event-inputs';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { twMerge } from 'tailwind-merge';
import { useBoolean } from 'usehooks-ts';

import {
  Bars2Icon,
  DocumentCheckIcon,
  EllipsisVerticalIcon,
  TrashIcon,
} from '@heroicons/react/24/outline';

import {
  Controller,
  FieldValues,
  UseFieldArrayReturn,
  UseFormReturn,
} from 'react-hook-form';

interface PartFormSectionProps<T extends FieldValues> {
  eventTypeArray: UseFieldArrayReturn<T, T[string], 'key'>;
  eventTypeId: string;
  eventTypeIndex: number;
  eventTypeKey: string;
  eventsMap: Record<
    string,
    GetMissionWithEventTypesData['sessions'][0]['parts'][0]['event']
  >;
  form: UseFormReturn<T>;
  inputOptions: NonNullable<ListInputsData>;
  name: string;
  sessionIndex: number;
  userId?: string;
}

const PartFormSection = <T extends FieldValues>({
  eventTypeArray,
  eventTypeId,
  eventTypeIndex,
  eventTypeKey,
  eventsMap,
  form,
  inputOptions,
  name,
  sessionIndex,
  userId,
}: PartFormSectionProps<T>) => {
  const [isTransitioning, startTransition] = useTransition();
  const backLink = useBackLink({ useCache: true });
  const deleteAlert = useBoolean();
  const router = useRouter();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: eventTypeKey });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  const event = eventsMap[eventTypeId];

  return (
    <li className="mb-4" ref={setNodeRef} style={style}>
      <Alert
        confirmText="Delete part"
        onConfirm={() => eventTypeArray.remove(eventTypeIndex)}
        {...deleteAlert}
      />
      <Controller
        control={form.control}
        name={`${name}.${eventTypeIndex}.content` as T[string]}
        render={({ field }) => (
          <RichTextarea
            className="rounded-b-none"
            placeholder="Description…"
            right={
              <>
                <IconButton
                  className="m-0 -mr-0.5 flex cursor-grab touch-none justify-center px-3 pb-1 pt-2"
                  icon={<Bars2Icon className="w-5" />}
                  {...attributes}
                  {...listeners}
                />
                <Menu>
                  <Menu.Button className="-mr-0.5 px-3 pb-2 pt-1">
                    <EllipsisVerticalIcon className="w-5" />
                  </Menu.Button>
                  <Menu.Items>
                    <Menu.Item
                      onClick={() => {
                        const values = form.getValues();

                        globalValueCache.set(CacheKeys.TemplateForm, {
                          content:
                            values.sessions[sessionIndex].parts[eventTypeIndex]
                              .content,
                          inputs:
                            values.sessions[sessionIndex].parts[eventTypeIndex]
                              .inputs,
                        });

                        globalValueCache.set(CacheKeys.MissionForm, values);

                        router.push(
                          formatCacheLink({
                            backLink,
                            path: '/templates/create',
                            useCache: true,
                          })
                        );
                      }}
                    >
                      <DocumentCheckIcon className="w-5 text-fg-3" />
                      Save as template
                    </Menu.Item>
                    <Menu.Item onClick={deleteAlert.setTrue}>
                      <TrashIcon className="w-5 text-fg-3" />
                      Delete part
                    </Menu.Item>
                  </Menu.Items>
                </Menu>
              </>
            }
            {...field}
          />
        )}
      />
      <Controller
        control={form.control}
        name={`${name}.${eventTypeIndex}.inputs` as T[string]}
        render={({ field }) => (
          <Select
            className={twMerge(
              'rounded-t-none border-t-0',
              event && userId && 'rounded-b-none'
            )}
            formatCreateLabel={(value: string) => `Create "${value}" input`}
            isCreatable
            isLoading={isTransitioning}
            isMulti
            noOptionsMessage={() => 'Type to create a new input'}
            onCreateOption={async (value: unknown) => {
              globalValueCache.set(CacheKeys.InputForm, {
                label: value,
              });

              globalValueCache.set(CacheKeys.MissionForm, form.getValues());

              startTransition(() =>
                router.push(
                  formatCacheLink({
                    backLink,
                    path: '/inputs/create',
                    updateCacheKey: CacheKeys.MissionForm,
                    updateCachePath: `${name}.${eventTypeIndex}.inputs`,
                    useCache: true,
                  })
                )
              );
            }}
            options={inputOptions.map(({ id, label, subjects }) => ({
              id,
              label,
              subjects: forceArray(subjects),
            }))}
            placeholder="Select inputs or type to create…"
            {...field}
          />
        )}
      />
      {event && userId && (
        <div className="rounded-b border border-t-0 border-alpha-1 bg-alpha-reverse-1">
          <div className="flex justify-between px-4 py-3 text-xs uppercase tracking-widest text-fg-3">
            <div className="flex items-center gap-4">
              <Avatar
                className="-my-[0.15rem]"
                name={event.profile.first_name}
                size="xs"
              />
              {event.profile.first_name} {event.profile.last_name}
            </div>
            <DateTime date={event.created_at} formatter="time" />
          </div>
          <EventInputs inputs={forceArray(event.inputs)} />
          {!!event.comments.length && (
            <div className="space-y-4 border-t border-alpha-1 p-4">
              <EventComments
                comments={event.comments}
                isTeamMember
                userId={userId}
              />
              <EventCommentForm
                eventId={event.id}
                inputClassName="rounded-sm"
              />
            </div>
          )}
        </div>
      )}
    </li>
  );
};

export default PartFormSection;
