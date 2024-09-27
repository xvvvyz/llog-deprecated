'use server';

import { SubjectNotesFormValues } from '@/_components/subject-notes-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';

const upsertSubjectNotes = async (
  context: { subjectId: string },
  data: SubjectNotesFormValues,
) => {
  const { data: subject, error } = await (
    await createServerSupabaseClient()
  )
    .from('subject_notes')
    .upsert({
      content: sanitizeHtml(data.content) ?? '',
      id: context.subjectId,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  return { data: subject };
};

export default upsertSubjectNotes;
