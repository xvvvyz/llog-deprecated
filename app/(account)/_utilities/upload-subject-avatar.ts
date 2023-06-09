import { SupabaseClient } from '@supabase/supabase-js';

const uploadSubjectAvatar = async ({
  avatar,
  subjectId,
  supabase,
}: {
  avatar?: File | string;
  subjectId: string;
  supabase: SupabaseClient;
}) => {
  if (!(avatar instanceof File)) return;

  await supabase.storage
    .from('subjects')
    .upload(`${subjectId}/avatar`, avatar, { upsert: true });
};

export default uploadSubjectAvatar;
