'use server';

import { MissionFormValues } from '@/_components/mission-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const upsertMission = async (
  context: { missionId?: string; subjectId: string },
  data: MissionFormValues,
) => {
  const supabase = createServerSupabaseClient();

  const { data: mission, error } = await supabase
    .from('missions')
    .upsert({
      id: context.missionId,
      name: data.name,
      subject_id: context.subjectId,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  return { data: mission };
};

export default upsertMission;
