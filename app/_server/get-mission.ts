import createServerComponentClient from '@/_server/create-server-component-client';

const getMission = (missionId: string) =>
  createServerComponentClient()
    .from('missions')
    .select('id, name')
    .eq('id', missionId)
    .single();

export type GetMissionData = Awaited<ReturnType<typeof getMission>>['data'];

export default getMission;
