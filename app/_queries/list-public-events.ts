import listEvents from '@/_queries/list-events';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listPublicEvents = (
  subjectId: string,
  { from, to }: { from: number; to: number },
) =>
  createServerSupabaseClient().rpc('list_public_events', {
    from_arg: from,
    public_subject_id: subjectId,
    to_arg: to,
  }) as ReturnType<typeof listEvents>;

export default listPublicEvents;
