'use client';

import Button from '@/_components/button';
import * as Drawer from '@/_components/drawer';
import Select, { IOption } from '@/_components/select-v1';
import getTemplateData from '@/_queries/get-template-data';
import { ListInputsBySubjectIdData } from '@/_queries/list-inputs-by-subject-id';
import { ListTemplatesData } from '@/_queries/list-templates';
import { ListTemplatesBySubjectIdAndTypeData } from '@/_queries/list-templates-by-subject-id-and-type';
import { ModuleTemplateDataJson } from '@/_types/module-template-data-json';
import forceArray from '@/_utilities/force-array';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import { useToggle } from '@uidotdev/usehooks';
import { useTransition } from 'react';
import * as Form from 'react-hook-form';

interface ModuleUseTemplateDrawerProps<T extends Form.FieldValues> {
  availableInputs: NonNullable<ListInputsBySubjectIdData>;
  availableModuleTemplates: NonNullable<
    ListTemplatesBySubjectIdAndTypeData | ListTemplatesData
  >;
  fieldPath: Form.FieldPath<T>;
  form: Form.UseFormReturn<T>;
}

const ModuleUseTemplateDrawer = <T extends Form.FieldValues>({
  availableInputs,
  availableModuleTemplates,
  fieldPath,
  form,
}: ModuleUseTemplateDrawerProps<T>) => {
  const [isTransitioning, startTransition] = useTransition();
  const [open, toggleOpen] = useToggle(false);

  return (
    <Drawer.Root onOpenChange={toggleOpen} open={open}>
      <Drawer.Trigger asChild>
        <Drawer.Button onClick={() => toggleOpen()}>
          <DocumentTextIcon className="w-5 text-fg-4" />
          Use template
        </Drawer.Button>
      </Drawer.Trigger>
      <Drawer.Portal>
        <Drawer.Overlay />
        <Drawer.Content>
          <Drawer.Title className="not-sr-only text-center text-2xl">
            Use template
          </Drawer.Title>
          <Drawer.Description className="mt-4 px-4 text-center text-fg-4">
            Selecting a template will overwrite any existing module values.
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

                  const data = templateData?.data as ModuleTemplateDataJson;

                  const inputs = availableInputs.filter(({ id }) =>
                    forceArray(data?.inputIds).includes(id),
                  ) as Form.PathValue<T, T[string]>;

                  form.setValue(
                    `${fieldPath}.name` as Form.Path<T>,
                    template?.name as Form.PathValue<T, Form.Path<T>>,
                    { shouldDirty: true },
                  );

                  form.setValue(
                    `${fieldPath}.content` as Form.Path<T>,
                    data?.content as Form.PathValue<T, Form.Path<T>>,
                    { shouldDirty: true },
                  );

                  form.setValue(
                    `${fieldPath}.inputs` as Form.Path<T>,
                    inputs as Form.PathValue<T, Form.Path<T>>,
                    { shouldDirty: true },
                  );

                  toggleOpen();
                })
              }
              options={availableModuleTemplates as IOption[]}
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

export default ModuleUseTemplateDrawer;
