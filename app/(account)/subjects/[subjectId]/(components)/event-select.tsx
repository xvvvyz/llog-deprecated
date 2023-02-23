import Select from '(components)/select';
import { Database } from '(types)/database';
import { InputType } from '(types)/input';
import supabase from '(utilities)/browser-supabase-client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useBoolean } from 'usehooks-ts';

interface EventSelectProps {
  field: any;
  input: InputType & {
    options: Array<
      Pick<Database['public']['Tables']['input_options']['Row'], 'id' | 'label'>
    >;
  };
}

const EventSelect = ({ field, input }: EventSelectProps) => {
  const { value: isCreating, toggle: toggleIsCreating } = useBoolean();
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Select
      isCreatable={input.settings?.isCreatable}
      isLoading={isCreating || isTransitioning}
      isMulti={input.type === 'multi_select'}
      isSearchable={input.settings?.isCreatable}
      onCreateOption={async (value: string) => {
        toggleIsCreating();

        const { data, error } = await supabase
          .from('input_options')
          .insert({
            input_id: input.id,
            label: value.trim(),
            order: input.options.length,
          })
          .select('id, label')
          .single();

        if (error) {
          field.onChange(null);
          alert(error.message);
          toggleIsCreating();
          return;
        }

        if (input.type === 'multi_select') {
          field.value.push(data);
          field.onChange(field.value);
        } else {
          field.onChange(data);
        }

        startTransition(() => router.refresh());
        toggleIsCreating();
      }}
      options={input.options}
      {...field}
    />
  );
};

export default EventSelect;
