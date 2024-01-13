import createServerComponentClient from '@/_server/create-server-component-client';

const getTemplate = (templateId: string) =>
  createServerComponentClient()
    .from('templates')
    .select('data, id, name, public')
    .eq('id', templateId)
    .single();

export type GetTemplateData = Awaited<ReturnType<typeof getTemplate>>['data'];

export default getTemplate;
