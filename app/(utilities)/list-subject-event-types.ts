import createServerSupabaseClient from './create-server-supabase-client';
import EventTypes from './enum-event-types';

const listSubjectEventTypes = ({
  subjectId,
  type,
}: {
  subjectId: string;
  type: EventTypes;
}) =>
  createServerSupabaseClient()
    .from('event_types')
    .select('id, name, type')
    .eq('subject_id', subjectId)
    .is('session_id', null)
    .eq('type', type)
    .eq('deleted', false)
    .order('order');

export type ListSubjectEventTypesData = Awaited<
  ReturnType<typeof listSubjectEventTypes>
>['data'];

export default listSubjectEventTypes;
