import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getProtocol = (protocolId: string) =>
  createServerSupabaseClient()
    .from('protocols')
    .select('id, name')
    .eq('id', protocolId)
    .single();

export type GetProtocolData = Awaited<ReturnType<typeof getProtocol>>['data'];

export default getProtocol;
