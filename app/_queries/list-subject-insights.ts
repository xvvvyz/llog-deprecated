import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listSubjectInsights = (subjectId: string) =>
  createServerSupabaseClient()
    .from('insights')
    .select('config, id, name')
    .eq('subject_id', subjectId);

export type ListSubjectInsightsData = Awaited<
  ReturnType<typeof listSubjectInsights>
>['data'];

export default listSubjectInsights;
