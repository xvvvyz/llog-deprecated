'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { revalidatePath } from 'next/cache';

const addComment = async (
  context: { eventId: string },
  _state: { error: string } | null,
  data: { content: string },
) => {
  const { error } = await createServerSupabaseClient()
    .from('comments')
    .upsert({
      content: sanitizeHtml(data.content) ?? '',
      event_id: context.eventId,
    });

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  return null;
};

export default addComment;
