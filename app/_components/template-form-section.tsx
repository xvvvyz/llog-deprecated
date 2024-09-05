import Input from '@/_components/input';
import RichTextarea from '@/_components/rich-textarea';
import Tip from '@/_components/tip';
import * as Form from 'react-hook-form';

interface TemplateFormSectionProps<T extends Form.FieldValues> {
  form: Form.UseFormReturn<T>;
}

const TemplateFormSection = <T extends Form.FieldValues>({
  form,
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
      name={'description' as Form.FieldPath<T>}
      render={({ field }) => (
        <RichTextarea
          label="Template description"
          right={
            <Tip side="left">
              A note to remind yourself, your team and the community (if you
              share it!) what this template is for.
            </Tip>
          }
          {...field}
        />
      )}
    />
  </>
);

export default TemplateFormSection;
