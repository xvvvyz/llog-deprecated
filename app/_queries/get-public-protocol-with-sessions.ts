import getProtocolWithSessions from '@/_queries/get-protocol-with-sessions';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicProtocolWithSessions = (protocolId: string) =>
  createServerSupabaseClient().rpc('get_public_protocol_with_sessions', {
    public_protocol_id: protocolId,
  }) as ReturnType<typeof getProtocolWithSessions>;

export default getPublicProtocolWithSessions;
