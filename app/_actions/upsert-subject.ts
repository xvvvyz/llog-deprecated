'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

const upsertSubject = async (
  context: {
    banner: string | null | undefined;
    deleteAvatar: boolean;
    next?: string | null;
    subjectId?: string;
  },
  _state: { error: string } | null,
  data: FormData,
) => {
  const supabase = createServerSupabaseClient();

  const { data: subject, error } = await supabase
    .from('subjects')
    .upsert({
      banner: sanitizeHtml(context.banner) || null,
      id: context.subjectId,
      name: (data.get('name') as string).trim(),
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  const avatar = data.get('avatar') as File;

  if (context.deleteAvatar) {
    await Promise.all([
      supabase.storage.from('subjects').remove([`${subject.id}/avatar`]),
      supabase
        .from('subjects')
        .update({ image_uri: null })
        .eq('id', subject.id),
    ]);
  } else if (avatar.size && avatar.type.startsWith('image/')) {
    await supabase.storage
      .from('subjects')
      .upload(`${subject.id}/avatar`, avatar, { upsert: true });
  }

  revalidatePath('/', 'layout');
  redirect(context.next ?? `/subjects/${subject.id}`);
};

export default upsertSubject;
