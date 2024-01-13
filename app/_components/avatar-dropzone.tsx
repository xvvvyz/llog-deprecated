import { DropzoneState } from 'react-dropzone';
import { FieldValues, PathValue, UseFormReturn } from 'react-hook-form';
import Avatar from './avatar';

interface AvatarDropzoneProps<T extends FieldValues> {
  dropzone: DropzoneState;
  form: UseFormReturn<T>;
}

const AvatarDropzone = <T extends FieldValues>({
  dropzone,
  form,
}: AvatarDropzoneProps<T>) => (
  <div
    className="group flex cursor-pointer items-center justify-center gap-6 rounded border-2 border-dashed border-alpha-2 px-4 py-9 text-fg-4 outline-none ring-accent-2 transition-colors hover:border-alpha-3 focus:ring-1"
    {...dropzone.getRootProps()}
  >
    <Avatar
      file={form.watch('avatar' as T[string])}
      id={form.watch('id' as T[string])}
    />
    <p>
      Drag image here or{' '}
      <span className="text-fg-3 transition-colors group-hover:text-fg-2">
        browse
      </span>
    </p>
    <input
      {...dropzone.getInputProps()}
      onChange={(e) => {
        form.setValue(
          'avatar' as T[string],
          e.target.files?.[0] as PathValue<T, T[string]>,
          { shouldDirty: true },
        );
      }}
    />
  </div>
);

export default AvatarDropzone;
