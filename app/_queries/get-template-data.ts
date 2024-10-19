import createBrowserSupabaseClient from '@/_utilities/create-browser-supabase-client';

const getTemplateData = async (templateId: string) =>
  createBrowserSupabaseClient()
    .from('templates')
    .select('data')
    .eq('id', templateId)
    .single();

export type GetTemplateDataData = Awaited<
  ReturnType<typeof getTemplateData>
>['data'];

export default getTemplateData;
