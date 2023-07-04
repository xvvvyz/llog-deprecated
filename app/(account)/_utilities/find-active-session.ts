import { Database } from '@/_types/database';

const findActiveSession = (
  sessions: Array<
    Database['public']['Tables']['sessions']['Row'] & {
      modules: Array<
        Database['public']['Tables']['event_types']['Row'] & {
          event: Database['public']['Tables']['events']['Row'][];
        }
      >;
    }
  >
) =>
  sessions.find(({ modules }) =>
    modules.find(
      (et: { event: Database['public']['Tables']['events']['Row'][] }) =>
        !et.event.length
    )
  );

export default findActiveSession;
