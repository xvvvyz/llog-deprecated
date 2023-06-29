'use client';

import Select from '@/(account)/_components/select';
import { ListInputsData } from '@/(account)/_server/list-inputs';
import { ListTemplatesWithDataData } from '@/(account)/_server/list-templates-with-data';
import { TemplateType } from '@/(account)/_types/template';
import forceArray from '@/(account)/_utilities/force-array';
import { FieldValues, PathValue, UseFormSetValue } from 'react-hook-form';

interface CreateEventTypeFromTemplateSelectProps<T extends FieldValues> {
  availableInputs: NonNullable<ListInputsData>;
  formSetValue: UseFormSetValue<T>;
  isMission?: boolean;
  namePrefix: string;
  templateOptions: NonNullable<ListTemplatesWithDataData>;
}

const TemplateSelect = <T extends FieldValues>({
  availableInputs,
  formSetValue,
  isMission,
  namePrefix,
  templateOptions,
}: CreateEventTypeFromTemplateSelectProps<T>) => (
  <Select
    instanceId="eventTypeTemplate"
    noOptionsMessage={() => 'No templates'}
    onChange={(e) => {
      const template = e as TemplateType;

      if (!isMission) {
        formSetValue(
          `${namePrefix}name` as T[string],
          template.name as PathValue<T, T[string]>
        );
      }

      if (template.data?.content) {
        formSetValue(
          `${namePrefix}content` as T[string],
          template.data?.content as PathValue<T, T[string]>
        );
      }

      const inputs = availableInputs.filter(({ id }) =>
        forceArray(template.data?.inputIds).includes(id)
      ) as PathValue<T, T[string]>;

      if (inputs.length) {
        formSetValue(`${namePrefix}inputs` as T[string], inputs);
      }
    }}
    options={templateOptions}
    placeholder="Copy values from template…"
    value={null}
  />
);

export default TemplateSelect;
