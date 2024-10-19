'use server';

import { ModuleTemplateFormValues } from '@/_components/module-template-form';
import TemplateType from '@/_constants/enum-template-type';
import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { revalidatePath } from 'next/cache';

type State = { data?: { id?: string }; error?: string } | null;

const upsertModuleTemplate = async (
  context: { templateId?: string },
  data: ModuleTemplateFormValues,
): Promise<State> => {
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
      public: false,
      team_id: user?.app_metadata?.active_team_id,
      type: TemplateType.Module,
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
  return { data: template };
};

export default upsertModuleTemplate;
