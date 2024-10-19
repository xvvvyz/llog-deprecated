import createBrowserSupabaseClient from '@/_utilities/create-browser-supabase-client';

const upsertAvatar = async ({
  avatar,
  bucket,
  id,
}: {
  avatar: File | string | null;
  bucket: string;
  id: string;
}) => {
  const supabase = createBrowserSupabaseClient();

  if (!avatar) {
    await supabase.storage.from(bucket).remove([`${id}/avatar`]);
  }

  if (avatar instanceof File) {
    await supabase.storage
      .from(bucket)
      .upload(`${id}/avatar`, avatar, { upsert: true });
  }
};

export default upsertAvatar;
