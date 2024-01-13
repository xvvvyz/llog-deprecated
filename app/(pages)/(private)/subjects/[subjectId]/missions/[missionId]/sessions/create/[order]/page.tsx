import SessionForm from '@/_components/session-form';
import SessionLayout from '@/_components/session-layout';
import getCurrentTeamId from '@/_server/get-current-team-id';
import getMissionWithSessions from '@/_server/get-mission-with-sessions';
import getSubject from '@/_server/get-subject';
import listInputs, { ListInputsData } from '@/_server/list-inputs';
import filterListInputsDataBySubjectId from '@/_utilities/filter-list-inputs-data-by-subject-id';
import formatTitle from '@/_utilities/format-title';

import listTemplatesWithData, {
  ListTemplatesWithDataData,
} from '@/_server/list-templates-with-data';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    missionId: string;
    order: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { missionId, order, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId, { draft: true }),
  ]);

  return {
    title: formatTitle([
      subject?.name,
      mission?.name,
      String(Number(order) + 1),
      'Edit',
    ]),
  };
};

export const revalidate = 0;

const Page = async ({ params: { missionId, order, subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: mission },
    { data: availableInputs },
    { data: availableTemplates },
    teamId,
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId, { draft: true }),
    listInputs(),
    listTemplatesWithData(),
    getCurrentTeamId(),
  ]);

  const isTeamMember = subject?.team_id === teamId;
  if (!subject || !mission || !isTeamMember) notFound();

  return (
    <SessionLayout
      isCreate
      isTeamMember
      missionId={missionId}
      missionName={mission.name}
      order={order}
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
        order={Number(order)}
        subjectId={subjectId}
      />
    </SessionLayout>
  );
};

export default Page;
