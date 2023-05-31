import AvatarDropzone from '@/_components/avatar-dropzone';
import Input from '@/_components/input';
import { DropzoneState } from 'react-dropzone';
import { FieldValues, UseFormReturn } from 'react-hook-form';

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
    <div className="flex gap-6">
      <Input
        className="max-w-xs"
        label="Species"
        {...form.register('species' as T[string])}
      />
      <Input
        className="max-w-xs"
        label="Birthdate"
        type="date"
        {...form.register('birthdate' as T[string])}
      />
    </div>
    <label className="group">
      <span className="label">Profile image</span>
      <AvatarDropzone dropzone={dropzone} form={form} />
    </label>
  </>
);

export default SubjectDetailsFormSection;
