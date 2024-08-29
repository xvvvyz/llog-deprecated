import TemplateType from '@/_constants/enum-template-type';
import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listTemplates = async ({ type }: { type?: TemplateType } = {}) => {
  const q = createServerSupabaseClient()
    .from('templates')
    .select('id, name, type')
    .eq('team_id', (await getCurrentUser())?.id ?? '');

  if (type) q.eq('type', type);
  else q.not('type', 'is', null);
  q.order('name');
  return q;
};

export type ListTemplatesData = Awaited<
  ReturnType<typeof listTemplates>
>['data'];

export default listTemplates;
