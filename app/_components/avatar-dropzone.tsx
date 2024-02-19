'use client';

import { useDropzone } from 'react-dropzone';
import Avatar from './avatar';

interface AvatarDropzoneProps {
  file?: File | string | null;
  id?: string;
  onDrop: (files: File[]) => void;
}

const AvatarDropzone = ({ file, id, onDrop }: AvatarDropzoneProps) => {
  const dropzone = useDropzone({
    accept: { 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] },
    maxSize: 10000000,
    multiple: false,
    noClick: true,
    onDrop,
  });

  return (
    <div
      className="group flex cursor-pointer items-center justify-center gap-6 rounded border-2 border-dashed border-alpha-2 px-4 py-9 text-fg-4 outline-none ring-accent-2 transition-colors hover:border-alpha-3 focus:ring-1"
      {...dropzone.getRootProps()}
    >
      <Avatar file={file} id={id} />
      <p>
        Drag image here or{' '}
        <span className="text-fg-3 transition-colors group-hover:text-fg-2">
          browse
        </span>
      </p>
      <input {...dropzone.getInputProps()} />
    </div>
  );
};

export default AvatarDropzone;
