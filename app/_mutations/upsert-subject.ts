'use server';

import { SubjectFormValues } from '@/_components/subject-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { revalidatePath } from 'next/cache';

const upsertSubject = async (
  context: { subjectId?: string },
  data: Omit<SubjectFormValues, 'avatar'>,
) => {
  const supabase = createServerSupabaseClient();

  // get the latest app_metadata for rls validation
  await supabase.auth.refreshSession();

  const { data: subject, error } = await supabase
    .from('subjects')
    .upsert({
      data: {
        banner: sanitizeHtml(data.data?.banner),
        links: data.data?.links?.map((l) => ({
          label: l.label.trim(),
          url: l.url.trim(),
        })),
      },
      id: context.subjectId,
      name: data.name.trim(),
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  return { data: subject };
};

export default upsertSubject;
