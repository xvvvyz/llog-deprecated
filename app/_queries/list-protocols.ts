import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listProtocols = (subjectId: string) =>
  createServerSupabaseClient()
    .from('protocols')
    .select(
      'id, name, sessions(id, modules:event_types(event:events(id)), order, title)',
    )
    .eq('subject_id', subjectId)
    .eq('archived', false)
    .order('name')
    .order('order', { referencedTable: 'sessions' })
    .eq('sessions.draft', false)
    .or(`scheduled_for.lte.${new Date().toISOString()},scheduled_for.is.null`, {
      referencedTable: 'sessions',
    })
    .eq('sessions.modules.archived', false);

export type ListProtocolsData = Awaited<
  ReturnType<typeof listProtocols>
>['data'];

export default listProtocols;
