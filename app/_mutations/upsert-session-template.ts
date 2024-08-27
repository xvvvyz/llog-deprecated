'use server';

import { SessionTemplateFormValues } from '@/_components/session-template-form';
import TemplateType from '@/_constants/enum-template-type';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const upsertSessionTemplate = async (
  context: { templateId?: string },
  data: SessionTemplateFormValues,
) => {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('templates')
    .upsert({
      data: {
        modules: data.modules.map((module) => ({
          content: module.content,
          inputIds: module.inputs.map((input) => input.id),
          name: module.name?.trim(),
        })),
      },
      id: context.templateId,
      name: data.name.trim(),
      public: false,
      type: TemplateType.Session,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
};

export default upsertSessionTemplate;
