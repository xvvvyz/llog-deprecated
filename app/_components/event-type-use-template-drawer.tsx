'use client';

import Button from '@/_components/button';
import * as Drawer from '@/_components/drawer';
import Select, { IOption } from '@/_components/select-v1';
import getTemplateData from '@/_queries/get-template-data';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListTemplatesData } from '@/_queries/list-templates';
import { ListTemplatesBySubjectIdAndTypeData } from '@/_queries/list-templates-by-subject-id-and-type';
import { EventTypeTemplateDataJson } from '@/_types/event-type-template-data-json';
import forceArray from '@/_utilities/force-array';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useTransition } from 'react';
import * as Form from 'react-hook-form';

interface EventTypeUseTemplateDrawerProps<T extends Form.FieldValues> {
  availableEventTypeTemplates: NonNullable<ListTemplatesBySubjectIdAndTypeData>;
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  form: Form.UseFormReturn<T>;
}

const EventTypeUseTemplateDrawer = <T extends Form.FieldValues>({
  availableEventTypeTemplates,
  availableInputs,
  form,
}: EventTypeUseTemplateDrawerProps<T>) => {
  const [isTransitioning, startTransition] = useTransition();
  const [open, toggleOpen] = useToggle(false);

  return (
    <Drawer.Root onOpenChange={toggleOpen} open={open}>
      <Drawer.Trigger asChild>
        <Button
          className="pr-2 sm:pr-6"
          onClick={() => toggleOpen()}
          variant="link"
        >
          <DocumentTextIcon className="w-5 text-fg-4" />
          Use template
        </Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title className="not-sr-only text-center text-2xl">
            Use template
          </Drawer.Title>
          <Drawer.Description className="mt-4 px-4 text-center text-fg-4">
            Selecting a template will overwrite any existing event type values.
          </Drawer.Description>
          <div className="pt-16 text-left">
            <Select
              isLoading={isTransitioning}
              noOptionsMessage={() => 'No templates.'}
              onChange={(t) =>
                startTransition(async () => {
                  const template = t as NonNullable<
                    ListTemplatesBySubjectIdAndTypeData | ListTemplatesData
                  >[0];

                  const { data: templateData } = await getTemplateData(
                    template.id,
                  );

                  const data = templateData?.data as EventTypeTemplateDataJson;

                  const inputs = availableInputs.filter(({ id }) =>
                    forceArray(data?.inputIds).includes(id),
                  );

                  form.setValue(
                    'name' as Form.FieldPath<T>,
                    template.name as Form.PathValue<T, Form.FieldPath<T>>,
                    { shouldDirty: true },
                  );

                  form.setValue(
                    'content' as Form.FieldPath<T>,
                    (data?.content ?? '') as Form.PathValue<
                      T,
                      Form.FieldPath<T>
                    >,
                    { shouldDirty: true },
                  );

                  form.setValue(
                    'inputs' as Form.FieldPath<T>,
                    inputs as Form.PathValue<T, Form.FieldPath<T>>,
                    { shouldDirty: true },
                  );

                  toggleOpen();
                })
              }
              options={availableEventTypeTemplates as IOption[]}
              placeholder="Select a template…"
              value={null}
            />
          </div>
          <Drawer.Close asChild>
            <Button
              className="-mb-3 mt-14 w-full justify-center p-0 py-3"
              variant="link"
            >
              Close
            </Button>
          </Drawer.Close>
        </Drawer.Content>
      </Drawer.Portal>
    </Drawer.Root>
  );
};

export default EventTypeUseTemplateDrawer;
