import TemplateType from '@/_constants/enum-template-type';
import getCurrentUser from '@/_queries/get-current-user';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listTemplatesBySubjectIdAndType = async ({
  subjectId,
  type,
}: {
  subjectId: string;
  type: TemplateType;
}) => {
  const supabase = createServerSupabaseClient();

  const whitelist = await supabase
    .from('template_subjects')
    .select('template_id')
    .eq('subject_id', subjectId);

  if (whitelist.error) return whitelist;
  const whitelistIds = `(${whitelist.data.map((is) => is.template_id).join(',')})`;

  const blacklist = await supabase
    .from('template_subjects')
    .select('template_id')
    .not('template_id', 'in', whitelistIds);

  if (blacklist.error) return blacklist;

  return supabase
    .from('templates')
    .select('id, name, subjects(id, image_uri, name), type')
    .eq('team_id', (await getCurrentUser())?.id ?? '')
    .eq('type', type)
    .not(
      'id',
      'in',
      `(${blacklist.data.map((is) => is.template_id).join(',')})`,
    )
    .eq('subjects.deleted', false)
    .not('subjects.archived', 'is', null)
    .order('name', { referencedTable: 'subjects' })
    .order('name');
};

export type ListTemplatesBySubjectIdAndTypeData = Awaited<
  ReturnType<typeof listTemplatesBySubjectIdAndType>
>['data'];

export default listTemplatesBySubjectIdAndType;
