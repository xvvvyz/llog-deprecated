import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getProtocolForTemplate = (protocolId: string) =>
  createServerSupabaseClient()
    .from('protocols')
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
    .eq('id', protocolId)
    .order('order', { referencedTable: 'sessions' })
    .neq('sessions.draft', true)
    .single();

export type GetProtocolForTemplateData = Awaited<
  ReturnType<typeof getProtocolForTemplate>
>['data'];

export default getProtocolForTemplate;
