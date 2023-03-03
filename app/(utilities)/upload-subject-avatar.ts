import supabase from '(utilities)/browser-supabase-client';

const uploadSubjectAvatar = async ({
  avatar,
  subjectId,
}: {
  avatar?: File | string;
  subjectId: string;
}) => {
  if (!(avatar instanceof File)) return;

  await supabase.storage
    .from('subjects')
    .upload(`${subjectId}/avatar`, avatar, { upsert: true });
};

export default uploadSubjectAvatar;
