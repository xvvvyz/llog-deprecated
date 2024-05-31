'use server';

import listInsights from '@/_queries/list-insights';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listPublicInsights = (subjectId: string) =>
  createServerSupabaseClient().rpc('list_public_insights', {
    public_subject_id: subjectId,
  }) as ReturnType<typeof listInsights>;

export default listPublicInsights;
