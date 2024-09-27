import getProtocolWithSessionsAndEvents from '@/_queries/get-protocol-with-sessions-and-events';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getPublicProtocolWithSessionsAndEvents = async (protocolId: string) =>
  (await createServerSupabaseClient()).rpc(
    'get_public_protocol_with_sessions_and_events',
    { public_protocol_id: protocolId },
  ) as unknown as ReturnType<typeof getProtocolWithSessionsAndEvents>;

export default getPublicProtocolWithSessionsAndEvents;
