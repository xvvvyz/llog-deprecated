import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getTemplate = async (templateId: string) =>
  (await createServerSupabaseClient())
    .from('templates')
    .select(
      'data, description, id, name, public, subjects!template_subjects(id), type',
    )
    .eq('id', templateId)
    .single();

export type GetTemplateData = Awaited<ReturnType<typeof getTemplate>>['data'];

export default getTemplate;
