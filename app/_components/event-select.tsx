'use client';

import { EventFormValues } from '@/_components/event-form';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import Select, { IOption } from '@/_components/select';
import createInputOption from '@/_mutations/create-input-option';
import { Database } from '@/_types/database';
import { InputSettingsJson } from '@/_types/input-settings-json';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { PropsValue } from 'react-select';

interface EventSelectProps {
  field: ControllerRenderProps<EventFormValues, `inputs.${number}`>;
  id: string;
  input: Pick<
    Database['public']['Tables']['inputs']['Row'],
    'id' | 'label' | 'settings' | 'type'
  > & {
    options: Array<
      Pick<Database['public']['Tables']['input_options']['Row'], 'id' | 'label'>
    >;
  };
}

const EventSelect = ({ field, id, input }: EventSelectProps) => {
  const [isTransitioning, startTransition] = useTransition();

  const optionOrOptions =
    input.type === 'multi_select' ? 'options' : 'an option';

  const inputSettings = input.settings as InputSettingsJson;

  const placeholder = inputSettings?.isCreatable
    ? `Select ${optionOrOptions} or create your own…`
    : `Select ${optionOrOptions}…`;

  const router = useRouter();

  return (
    <InputRoot>
      <Label.Root htmlFor={`react-select-${id}-input`}>
        {input.label}
      </Label.Root>
      <Select
        instanceId={id}
        isCreatable={inputSettings?.isCreatable}
        isLoading={isTransitioning}
        isMulti={input.type === 'multi_select'}
        isSearchable={inputSettings?.isCreatable}
        onChange={field.onChange}
        onCreateOption={(value: string) =>
          startTransition(async () => {
            const label = value.trim();
            if (!label) return;

            const { data, error } = await createInputOption({
              inputId: input.id,
              label,
            });

            if (error) {
              field.onChange(null);
              alert(error);
              return;
            }

            if (!data) return;

            if (input.type === 'multi_select') {
              (field.value as IOption[]).push(data);
              field.onChange(field.value);
            } else {
              field.onChange(data);
            }

            router.refresh();
          })
        }
        options={input.options}
        placeholder={placeholder}
        value={field.value as PropsValue<IOption>}
      />
    </InputRoot>
  );
};

export default EventSelect;
