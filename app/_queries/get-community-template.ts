import CommunityTemplate from '@/_types/community-template';
import CommunityTemplateInput from '@/_types/community-template-input';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getCommunityTemplate = async (publicTemplateId: string) =>
  (await createServerSupabaseClient()).rpc<
    'get_community_template',
    {
      Args: { public_template_id: string };
      Returns: {
        inputs: CommunityTemplateInput[];
        template: CommunityTemplate;
      };
    }
  >('get_community_template', { public_template_id: publicTemplateId });

export type GetCommunityTemplateData = Awaited<
  ReturnType<typeof getCommunityTemplate>
>['data'];

export default getCommunityTemplate;
