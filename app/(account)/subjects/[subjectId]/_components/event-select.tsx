import Select from '@/_components/select';
import useSupabase from '@/_hooks/use-supabase';
import { Database } from '@/_types/database';
import { InputType } from '@/_types/input';
import { useToggle } from '@uidotdev/usehooks';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface EventSelectProps {
  field: any;
  input: InputType & {
    options: Array<
      Pick<Database['public']['Tables']['input_options']['Row'], 'id' | 'label'>
    >;
  };
}

const EventSelect = ({ field, input }: EventSelectProps) => {
  const [isCreating, toggleIsCreating] = useToggle(false);
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const supabase = useSupabase();

  const optionOrOptions =
    input.type === 'multi_select' ? 'options' : 'an option';

  const placeholder = input.settings?.isCreatable
    ? `Select ${optionOrOptions} or create your own…`
    : `Select ${optionOrOptions}…`;

  return (
    <Select
      isCreatable={input.settings?.isCreatable}
      isLoading={isCreating || isTransitioning}
      isMulti={input.type === 'multi_select'}
      isSearchable={input.settings?.isCreatable}
      label={input.label}
      onCreateOption={async (value: string) => {
        const label = value.trim();
        if (!label) return;
        toggleIsCreating();

        const { data, error } = await supabase
          .from('input_options')
          .insert({
            input_id: input.id,
            label,
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

        startTransition(router.refresh);
        toggleIsCreating();
      }}
      options={input.options}
      placeholder={placeholder}
      {...field}
    />
  );
};

export default EventSelect;
