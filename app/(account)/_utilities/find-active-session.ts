import { Database } from '@/_types/database';

const findActiveSession = (
  sessions: Array<
    Database['public']['Tables']['sessions']['Row'] & {
      modules: Array<
        Database['public']['Tables']['event_types']['Row'] & {
          events: Database['public']['Tables']['events']['Row'][];
        }
      >;
    }
  >
) =>
  sessions.find(({ modules }) =>
    modules.find(
      (et: { events: Database['public']['Tables']['events']['Row'][] }) =>
        !et.events.length
    )
  );

export default findActiveSession;
