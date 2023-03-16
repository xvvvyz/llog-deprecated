import AvatarDropzone from '(components)/avatar-dropzone';
import Input from '(components)/input';
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
    <label className="group">
      <span className="label">Profile image</span>
      <AvatarDropzone dropzone={dropzone} form={form} />
    </label>
  </>
);

export default SubjectDetailsFormSection;
