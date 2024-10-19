'use server';

import { SubjectFormValues } from '@/_components/subject-form';
import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { revalidatePath } from 'next/cache';

const upsertSubject = async (
  context: { subjectId?: string },
  data: Omit<SubjectFormValues, 'avatar'>,
) => {
  const supabase = await createServerSupabaseClient();
  await supabase.auth.refreshSession();
  const user = await getCurrentUser();

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
      team_id: user?.app_metadata?.active_team_id,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  await supabase
    .from('subject_tags')
    .delete()
    .eq('subject_id', subject.id)
    .not('tag_id', 'in', `(${data.tags.join(',')})`);

  await supabase
    .from('subject_tags')
    .upsert(data.tags.map((tag) => ({ subject_id: subject.id, tag_id: tag })));

  revalidatePath('/', 'layout');
  return { data: subject };
};

export default upsertSubject;
