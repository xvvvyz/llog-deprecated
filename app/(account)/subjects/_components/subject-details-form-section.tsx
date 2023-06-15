import AvatarDropzone from '@/(account)/_components/avatar-dropzone';
import RichTextarea from '@/(account)/_components/rich-textarea';
import Input from '@/_components/input';
import { DropzoneState } from 'react-dropzone';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';

interface SubjectDetailsFormSectionProps<T extends FieldValues> {
  dropzone: DropzoneState;
  form: UseFormReturn<T>;
}

const SubjectDetailsFormSection = <T extends FieldValues>({
  dropzone,
  form,
}: SubjectDetailsFormSectionProps<T>) => (
  <>
    <Input label="Name" {...form.register('name' as T[string])} />
    <label className="group">
      <span className="label">Profile image</span>
      <AvatarDropzone dropzone={dropzone} form={form} />
    </label>
    <Controller
      control={form.control}
      name={'banner' as T[string]}
      render={({ field }) => (
        <RichTextarea
          className="px-0 text-center text-fg-3 [&>*]:mx-auto [&>*]:max-w-sm [&>*]:px-4"
          label="Banner"
          {...field}
        />
      )}
    />
  </>
);

export default SubjectDetailsFormSection;
