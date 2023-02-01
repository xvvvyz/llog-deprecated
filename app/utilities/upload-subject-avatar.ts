import { DropzoneState } from 'react-dropzone';
import supabase from 'utilities/browser-supabase-client';

const uploadSubjectAvatar = async ({
  dropzone,
  subjectId,
}: {
  dropzone: DropzoneState;
  subjectId: string;
}) => {
  if (!dropzone.acceptedFiles.length) return;

  await supabase.storage
    .from('subjects')
    .upload(`${subjectId}/avatar`, dropzone.acceptedFiles[0], {
      upsert: true,
    });
};

export default uploadSubjectAvatar;
