'use client';

import { EventFormValues } from '@/_components/event-form';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import Select from '@/_components/select-v2';
import createInputOption from '@/_mutations/create-input-option';
import { Database } from '@/_types/database';
import { InputSettingsJson } from '@/_types/input-settings-json';
import { useRouter } from 'next/navigation';
import { ControllerRenderProps } from 'react-hook-form';

interface EventSelectProps {
  field: ControllerRenderProps<EventFormValues, `inputs.${number}`>;
  input: Pick<
    Database['public']['Tables']['inputs']['Row'],
    'id' | 'label' | 'settings' | 'type'
  > & {
    options: Array<
      Pick<Database['public']['Tables']['input_options']['Row'], 'id' | 'label'>
    >;
  };
}

const EventSelect = ({ field, input }: EventSelectProps) => {
  const inputSettings = input.settings as InputSettingsJson;
  const router = useRouter();

  return (
    <InputRoot>
      <Label.Root>{input.label}</Label.Root>
      <Select
        isCreatable={inputSettings?.isCreatable}
        isMulti={input.type === 'multi_select'}
        onChange={field.onChange}
        onCreateOption={async (label: string) => {
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
            field.onChange([...(field.value as string[]), data.id]);
          } else {
            field.onChange(data.id);
          }

          router.refresh();
        }}
        options={input.options}
        value={field.value as string | string[]}
      />
    </InputRoot>
  );
};

export default EventSelect;
