'use server';

import { ModuleTemplateFormValues } from '@/_components/module-template-form';
import TemplateType from '@/_constants/enum-template-type';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { revalidatePath } from 'next/cache';

type State = { data?: { id?: string }; error?: string } | null;

const upsertModuleTemplate = async (
  context: { templateId?: string },
  data: ModuleTemplateFormValues,
): Promise<State> => {
  const supabase = createServerSupabaseClient();

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
      type: TemplateType.Module,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  return { data: template };
};

export default upsertModuleTemplate;
