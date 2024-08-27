'use server';

import { EventTypeTemplateFormValues } from '@/_components/event-type-template-form';
import TemplateType from '@/_constants/enum-template-type';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import sanitizeHtml from '@/_utilities/sanitize-html';
import { revalidatePath } from 'next/cache';

const upsertEventTypeTemplate = async (
  context: { templateId?: string },
  data: EventTypeTemplateFormValues,
) => {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('templates')
    .upsert({
      data: {
        content: sanitizeHtml(data.content),
        inputIds: data.inputs.map((input) => input.id),
      },
      id: context.templateId,
      name: data.name.trim(),
      public: false,
      type: TemplateType.EventType,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
};

export default upsertEventTypeTemplate;
