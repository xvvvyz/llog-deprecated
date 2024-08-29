import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getTrainingPlanForTemplate = (trainingPlanId: string) =>
  createServerSupabaseClient()
    .from('missions')
    .select(
      `
      name,
      sessions(
        modules:event_types(
          content,
          inputs(id),
          name
        ),
        title
      )`,
    )
    .eq('id', trainingPlanId)
    .order('order', { referencedTable: 'sessions' })
    .neq('sessions.draft', true)
    .single();

export type GetTrainingPlanForTemplateData = Awaited<
  ReturnType<typeof getTrainingPlanForTemplate>
>['data'];

export default getTrainingPlanForTemplate;
