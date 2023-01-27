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
  const ext = dropzone.acceptedFiles[0].name.split('.').pop();

  await supabase.storage
    .from('subjects')
    .upload(`${subjectId}/image.${ext}`, dropzone.acceptedFiles[0], {
      upsert: true,
    });
};

export default uploadSubjectAvatar;
