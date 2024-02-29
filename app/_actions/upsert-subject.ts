'use server';

import { SubjectFormValues } from '@/_components/subject-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';

const upsertSubject = async (
  context: { subjectId?: string },
  data: Omit<SubjectFormValues, 'avatar'>,
) => {
  const supabase = createServerSupabaseClient();

  const { data: subject, error } = await supabase
    .from('subjects')
    .upsert({
      banner: sanitizeHtml(data.banner) || null,
      id: context.subjectId,
      name: data.name.trim(),
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  return { data: subject };
};

export default upsertSubject;
