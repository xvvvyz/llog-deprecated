import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listInputsBySubjectId = async (subjectId: string) => {
  const supabase = createServerSupabaseClient();

  const whitelist = await supabase
    .from('input_subjects')
    .select('input_id')
    .eq('subject_id', subjectId);

  if (whitelist.error) return whitelist;
  const whitelistIds = `(${whitelist.data.map((is) => is.input_id).join(',')})`;

  const blacklist = await supabase
    .from('input_subjects')
    .select('input_id')
    .not('input_id', 'in', whitelistIds);

  if (blacklist.error) return blacklist;

  return supabase
    .from('inputs')
    .select('id, label, subjects(id, image_uri, name), type')
    .eq('team_id', (await getCurrentUser())?.id ?? '')
    .eq('archived', false)
    .not('id', 'in', `(${blacklist.data.map((is) => is.input_id).join(',')})`)
    .eq('subjects.deleted', false)
    .order('name', { referencedTable: 'subjects' })
    .order('label');
};

export type ListInputsBySubjectIdData = Awaited<
  ReturnType<typeof listInputsBySubjectId>
>['data'];

export default listInputsBySubjectId;
