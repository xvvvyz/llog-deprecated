'use server';

import { EventTypeTemplateFormValues } from '@/_components/event-type-template-form';
import TemplateType from '@/_constants/enum-template-type';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { revalidatePath } from 'next/cache';

type State = { data?: { id?: string }; error?: string } | null;

const upsertTemplate = async (
  context: { templateId?: string; type: TemplateType },
  data: EventTypeTemplateFormValues,
): Promise<State> => {
  const supabase = createServerSupabaseClient();

  const { data: template, error } = await supabase
    .from('templates')
    .upsert({
      data: {
        content: sanitizeHtml(data.content),
        inputIds: data.inputs.map((input) => input.id),
      },
      id: context.templateId,
      name: data.name.trim(),
      public: false,
      type: context.type,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  return { data: template };
};

export default upsertTemplate;
