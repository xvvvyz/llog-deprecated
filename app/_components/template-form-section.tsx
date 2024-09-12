'use client';

import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import Select, { IOption } from '@/_components/select';
import { ListSubjectsByTeamIdData } from '@/_queries/list-subjects-by-team-id';
import * as Form from 'react-hook-form';
import { PropsValue } from 'react-select';

interface TemplateFormSectionProps<T extends Form.FieldValues> {
  form: Form.UseFormReturn<T>;
  subjects: NonNullable<ListSubjectsByTeamIdData>;
}

const TemplateFormSection = <T extends Form.FieldValues>({
  form,
  subjects,
}: TemplateFormSectionProps<T>) => (
  <>
    <InputRoot>
      <Label.Root htmlFor="name">Name</Label.Root>
      <Input
        maxLength={49}
        required
        {...form.register('name' as Form.FieldPath<T>)}
      />
    </InputRoot>
    <InputRoot>
      <Label.Root htmlFor="react-select-subjects-input">For</Label.Root>
      <Label.Tip>
        The template will only be available for the&nbsp;specified subjects.
      </Label.Tip>
      <Form.Controller
        control={form.control}
        name={'subjects' as Form.FieldPath<T>}
        render={({ field }) => (
          <Select
            hasAvatar
            isMulti
            name={field.name}
            noOptionsMessage={() => 'No subjects.'}
            onBlur={field.onBlur}
            onChange={(value) => field.onChange(value)}
            options={subjects as IOption[]}
            placeholder="All subjects…"
            value={field.value as PropsValue<IOption>}
          />
        )}
      />
    </InputRoot>
  </>
);

export default TemplateFormSection;
