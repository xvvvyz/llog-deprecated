import TemplateType from '@/_constants/enum-template-type';
import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listTemplatesWithData = async ({ type }: { type: TemplateType }) =>
  createServerSupabaseClient()
    .from('templates')
    .select('data, id, name, type')
    .eq('team_id', (await getCurrentUser())?.id ?? '')
    .eq('type', type)
    .order('name');

export type ListTemplatesWithDataData = Awaited<
  ReturnType<typeof listTemplatesWithData>
>['data'];

export default listTemplatesWithData;
