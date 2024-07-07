'use server';

import { SubjectFormValues } from '@/_components/subject-form';
import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';

const upsertSubject = async (
  context: { subjectId?: string },
  data: Omit<SubjectFormValues, 'avatar'>,
) => {
  const supabase = createServerSupabaseClient();
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
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  if (user?.user_metadata?.is_client) {
    await supabase.auth.updateUser({ data: { is_client: false } });
  }

  return { data: subject };
};

export default upsertSubject;
