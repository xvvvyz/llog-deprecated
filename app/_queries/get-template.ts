import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getTemplate = (templateId: string) =>
  createServerSupabaseClient()
    .from('templates')
    .select('data, description, id, name, subjects(id), type')
    .eq('id', templateId)
    .single();

export type GetTemplateData = Awaited<ReturnType<typeof getTemplate>>['data'];

export default getTemplate;
