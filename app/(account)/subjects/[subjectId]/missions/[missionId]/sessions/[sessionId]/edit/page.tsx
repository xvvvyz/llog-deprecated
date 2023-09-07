import SessionForm from '@/(account)/subjects/[subjectId]/missions/[missionId]/sessions/_components/session-form';
import SessionLayout from '@/(account)/subjects/[subjectId]/missions/[missionId]/sessions/_components/session-layout';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getMissionWithSessions from '@/_server/get-mission-with-sessions';
import getSession, { GetSessionData } from '@/_server/get-session';
import getSubject from '@/_server/get-subject';
import listInputs, { ListInputsData } from '@/_server/list-inputs';
import filterListInputsDataBySubjectId from '@/_utilities/filter-list-inputs-data-by-subject-id';
import forceArray from '@/_utilities/force-array';
import formatTitle from '@/_utilities/format-title';

import listTemplatesWithData, {
  ListTemplatesWithDataData,
} from '@/_server/list-templates-with-data';

interface PageProps {
  params: {
    missionId: string;
    order: string;
    sessionId: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { missionId, order, sessionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId, true),
  ]);

  const sessions = forceArray(mission?.sessions);
  const currentSession = sessions.find(({ id }) => id === sessionId);
  const sessionOrder = order ? Number(order) : currentSession?.order;

  return {
    title: formatTitle([
      subject?.name,
      mission?.name,
      sessionOrder + 1,
      'Edit',
    ]),
  };
};

export const revalidate = 0;

const Page = async ({
  params: { missionId, sessionId, subjectId },
}: PageProps) => {
  const [
    { data: subject },
    { data: mission },
    { data: session },
    { data: availableInputs },
    { data: availableTemplates },
    teamId,
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId, true),
    getSession(sessionId),
    listInputs(),
    listTemplatesWithData(),
    getCurrentTeamId(),
  ]);

  const isTeamMember = subject?.team_id === teamId;
  if (!subject || !mission || !session || !isTeamMember) return null;

  return (
    <SessionLayout
      isEdit
      isTeamMember
      missionId={missionId}
      missionName={mission.name}
      sessionId={sessionId}
      sessions={mission.sessions}
      subjectId={subjectId}
      subjectName={subject.name}
    >
      <SessionForm
        availableInputs={filterListInputsDataBySubjectId(
          availableInputs as ListInputsData,
          subjectId,
        )}
        availableTemplates={availableTemplates as ListTemplatesWithDataData}
        mission={mission}
        session={session as GetSessionData}
        subjectId={subjectId}
      />
    </SessionLayout>
  );
};

export default Page;
