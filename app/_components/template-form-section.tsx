'use client';

import Input from '@/_components/input';
import RichTextarea from '@/_components/rich-textarea';
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
    <Input
      label="Name"
      maxLength={49}
      required
      {...form.register('name' as Form.FieldPath<T>)}
    />
    <Form.Controller
      control={form.control}
      name={'subjects' as Form.FieldPath<T>}
      render={({ field }) => (
        <Select
          hasAvatar
          isMulti
          label="For"
          name={field.name}
          noOptionsMessage={() => 'No subjects.'}
          onBlur={field.onBlur}
          onChange={(value) => field.onChange(value)}
          options={subjects as IOption[]}
          placeholder="All subjects…"
          tooltip={
            <>
              The template will only be available for the&nbsp;specified
              subjects.
            </>
          }
          value={field.value as PropsValue<IOption>}
        />
      )}
    />
    <Form.Controller
      control={form.control}
      name={'description' as Form.FieldPath<T>}
      render={({ field }) => (
        <RichTextarea
          label="Template description"
          tooltip={
            <>
              An optional note describing what the template is for or how to use
              it.
            </>
          }
          {...field}
        />
      )}
    />
  </>
);

export default TemplateFormSection;
