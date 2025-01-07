import CommunityTemplate from '@/_types/community-template';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listCommunityTemplates = async () =>
  (await createServerSupabaseClient()).rpc<
    'list_community_templates',
    { Args: never; Returns: CommunityTemplate[] }
  >('list_community_templates');

export type ListCommunityTemplatesData = Awaited<
  ReturnType<typeof listCommunityTemplates>
>['data'];

export default listCommunityTemplates;
