import getProtocolWithSessions from '@/_queries/get-protocol-with-sessions';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicProtocolWithSessions = async (protocolId: string) =>
  (await createServerSupabaseClient()).rpc(
    'get_public_protocol_with_sessions',
    {
      public_protocol_id: protocolId,
    },
  ) as unknown as ReturnType<typeof getProtocolWithSessions>;

export default getPublicProtocolWithSessions;
