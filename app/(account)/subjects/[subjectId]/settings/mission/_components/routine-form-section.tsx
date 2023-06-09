import Alert from '@/(account)/_components/alert';
import IconButton from '@/(account)/_components/icon-button';
import Menu from '@/(account)/_components/menu';
import RichTextarea from '@/(account)/_components/rich-textarea';
import Select from '@/(account)/_components/select';
import TEMPLATE_TYPE_LABELS from '@/(account)/_constants/constant-template-type-labels';
import CacheKeys from '@/(account)/_constants/enum-cache-keys';
import TemplateTypes from '@/(account)/_constants/enum-template-types';
import useBackLink from '@/(account)/_hooks/use-back-link';
import { ListInputsData } from '@/(account)/_server/list-inputs';
import forceArray from '@/(account)/_utilities/force-array';
import formatCacheLink from '@/(account)/_utilities/format-cache-link';
import globalValueCache from '@/(account)/_utilities/global-value-cache';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
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

interface RoutineFormSectionProps<T extends FieldValues> {
  eventTypeArray: UseFieldArrayReturn<T, T[string], 'key'>;
  eventTypeIndex: number;
  eventTypeKey: string;
  form: UseFormReturn<T>;
  inputOptions: NonNullable<ListInputsData>;
  name: string;
  sessionIndex: number;
}

const RoutineFormSection = <T extends FieldValues>({
  eventTypeArray,
  eventTypeIndex,
  eventTypeKey,
  form,
  inputOptions,
  name,
  sessionIndex,
}: RoutineFormSectionProps<T>) => {
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
            className="rounded-t-none border-t-0"
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
    </li>
  );
};

export default RoutineFormSection;
