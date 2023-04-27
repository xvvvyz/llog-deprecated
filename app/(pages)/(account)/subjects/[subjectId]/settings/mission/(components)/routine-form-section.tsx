import Alert from '(components)/alert';
import IconButton from '(components)/icon-button';
import Menu from '(components)/menu';
import RichTextarea from '(components)/rich-textarea';
import Select from '(components)/select';
import TEMPLATE_TYPE_LABELS from '(utilities)/constant-template-type-labels';
import CacheKeys from '(utilities)/enum-cache-keys';
import TemplateTypes from '(utilities)/enum-template-types';
import forceArray from '(utilities)/force-array';
import formatCacheLink from '(utilities)/format-cache-link';
import globalValueCache from '(utilities)/global-value-cache';
import useBackLink from '(utilities)/use-back-link';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { twMerge } from 'tailwind-merge';
import { useBoolean } from 'usehooks-ts';
import EventBanner from '../../../(components)/event-banner';
import EventCommentForm from '../../../(components)/event-comment-form';
import EventComments from '../../../(components)/event-comments';
import EventInputs from '../../../(components)/event-inputs';

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

interface RoutineFormSectionProps<T extends FieldValues> {
  eventType: any;
  eventTypeArray: UseFieldArrayReturn<T, T[string], 'key'>;
  eventTypeIndex: number;
  form: UseFormReturn<T>;
  inputOptions: any[];
  name: string;
  routineEventsMap: Record<string, any>;
  sessionIndex: number;
  userId: string;
}

const RoutineFormSection = <T extends FieldValues>({
  eventType,
  eventTypeArray,
  eventTypeIndex,
  form,
  inputOptions,
  name,
  routineEventsMap,
  sessionIndex,
  userId,
}: RoutineFormSectionProps<T>) => {
  const [isTransitioning, startTransition] = useTransition();
  const backLink = useBackLink({ useCache: true });
  const deleteAlert = useBoolean();
  const event = routineEventsMap[(eventType as unknown as any).id];
  const router = useRouter();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: eventType.key });

  const style = {
    transform: CSS.Translate.toString(transform),
    transition,
  };

  return (
    <li className="mb-4" ref={setNodeRef} style={style}>
      <Alert
        confirmText="Delete routine"
        onConfirm={() => eventTypeArray.remove(eventTypeIndex)}
        {...deleteAlert}
      />
      <Controller
        control={form.control}
        name={`${name}.${eventTypeIndex}.content` as T[string]}
        render={({ field }) => (
          <RichTextarea
            className="rounded-b-none"
            placeholder="Description"
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
                            values.sessions[sessionIndex].routines[
                              eventTypeIndex
                            ].content,
                          inputs:
                            values.sessions[sessionIndex].routines[
                              eventTypeIndex
                            ].inputs,
                          type: {
                            id: TemplateTypes.Routine,
                            label: TEMPLATE_TYPE_LABELS[TemplateTypes.Routine],
                          },
                        });

                        globalValueCache.set(CacheKeys.MissionForm, values);

                        router.push(
                          formatCacheLink({
                            backLink,
                            path: '/templates/add',
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
                      Delete routine
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
              event && 'rounded-b-none'
            )}
            isCreatable
            isLoading={isTransitioning}
            isMulti
            onCreateOption={async (value: unknown) => {
              globalValueCache.set(CacheKeys.InputForm, {
                label: value,
              });

              globalValueCache.set(CacheKeys.MissionForm, form.getValues());

              startTransition(() =>
                router.push(
                  formatCacheLink({
                    backLink,
                    path: '/inputs/add',
                    updateCacheKey: CacheKeys.MissionForm,
                    updateCachePath: `${name}.${eventTypeIndex}.inputs`,
                    useCache: true,
                  })
                )
              );
            }}
            options={inputOptions}
            placeholder="Add inputs. Type to create…"
            {...field}
          />
        )}
      />
      {event && (
        <div className="rounded-b border border-t-0 border-alpha-1 bg-alpha-reverse-1">
          <EventBanner
            className={twMerge(
              'px-4 py-2',
              !event.inputs.length && 'border-b border-alpha-1'
            )}
            createdAt={event.created_at}
            profile={event.profile}
          />
          <EventInputs inputs={forceArray(event.inputs)} />
          <EventComments
            className="p-4 pb-0"
            comments={forceArray(event.comments)}
            userId={userId}
          />
          <EventCommentForm
            className="p-4"
            eventId={event.id}
            inputClassName="rounded-sm"
          />
        </div>
      )}
    </li>
  );
};

export default RoutineFormSection;
