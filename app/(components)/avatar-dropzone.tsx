import { DropzoneState } from 'react-dropzone';
import Avatar from './avatar';

interface AvatarDropzoneProps {
  dropzone: DropzoneState;
  file?: File;
  name: string;
}

const AvatarDropzone = ({ dropzone, file, name }: AvatarDropzoneProps) => (
  <div
    className="group flex cursor-pointer items-center justify-center gap-6 rounded border-2 border-dashed border-alpha-2 px-4 py-9 text-fg-3 outline-none ring-accent-2 transition-colors hover:border-alpha-3 focus:ring-1"
    {...dropzone.getRootProps()}
  >
    <Avatar file={file} name={name} />
    <p>
      Drag image here or{' '}
      <span className="text-fg-2 transition-colors group-hover:text-fg-1">
        browse
      </span>
    </p>
    <input {...dropzone.getInputProps()} />
  </div>
);

export default AvatarDropzone;
