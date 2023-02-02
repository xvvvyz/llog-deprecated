import AvatarDropzone from '(components)/avatar-dropzone';
import Input from '(components)/input';
import Label, { LabelSpan } from '(components)/label';
import { DropzoneState } from 'react-dropzone';
import { Controller, FieldValues, UseFormReturn } from 'react-hook-form';

interface SubjectDetailsFormSectionProps<T extends FieldValues> {
  dropzone: DropzoneState;
  file?: File;
  form: UseFormReturn<T>;
}

const SubjectDetailsFormSection = <T extends FieldValues>({
  dropzone,
  file,
  form,
}: SubjectDetailsFormSectionProps<T>) => (
  <>
    <Label>
      <LabelSpan>Name</LabelSpan>
      <Controller
        control={form.control}
        name={'name' as T['name']}
        render={({ field }) => <Input {...field} />}
      />
    </Label>
    <Label>
      <LabelSpan>Profile image</LabelSpan>
      <AvatarDropzone
        dropzone={dropzone}
        file={file}
        name={form.watch('name' as T['name'])}
      />
    </Label>
  </>
);

export default SubjectDetailsFormSection;
