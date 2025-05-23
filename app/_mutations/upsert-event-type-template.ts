'use server';

import { EventTypeTemplateFormValues } from '@/_components/event-type-template-form';
import TemplateType from '@/_constants/enum-template-type';
import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { revalidatePath } from 'next/cache';

const upsertEventTypeTemplate = async (
  context: { templateId?: string },
  data: EventTypeTemplateFormValues,
) => {
  const supabase = await createServerSupabaseClient();
  const user = await getCurrentUser();

  const { data: template, error } = await supabase
    .from('templates')
    .upsert({
      data: {
        content: sanitizeHtml(data.content),
        inputIds: data.inputs.map((input) => input.id),
      },
      description: sanitizeHtml(data.description),
      id: context.templateId,
      name: data.name.trim(),
      public: data.public,
      team_id: user?.app_metadata?.active_team_id,
      type: TemplateType.EventType,
      updated_at: new Date().toISOString(),
    })
    .select('id')
    .single();

  if (error) return { error: error.message };

  await supabase
    .from('template_subjects')
    .delete()
    .eq('template_id', template.id);

  if (data.subjects.length) {
    const { error } = await supabase.from('template_subjects').insert(
      data.subjects.map(({ id }) => ({
        subject_id: id,
        template_id: template.id,
      })),
    );

    if (error) {
      if (!context.templateId) {
        await supabase.from('templates').delete().eq('id', template.id);
      }

      return { error: error.message };
    }
  }

  revalidatePath('/', 'layout');
};

export default upsertEventTypeTemplate;
