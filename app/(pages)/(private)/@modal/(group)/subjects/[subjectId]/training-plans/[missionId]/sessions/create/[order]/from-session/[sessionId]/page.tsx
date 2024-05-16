import BackButton from '@/_components/back-button';
import PageModalHeader from '@/_components/page-modal-header';
import SessionForm from '@/_components/session-form';
import SessionLayout from '@/_components/session-layout';
import getCurrentUser from '@/_queries/get-current-user';
import getMissionWithSessions from '@/_queries/get-mission-with-sessions';
import getSession from '@/_queries/get-session';
import getSubject from '@/_queries/get-subject';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesWithData from '@/_queries/list-templates-with-data';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    missionId: string;
    order: string;
    sessionId: string;
    subjectId: string;
  };
}

export const metadata = {
  title: formatTitle(['Subjects', 'Training plans', 'Sessions', 'Create']),
};

const Page = async ({
  params: { missionId, order, sessionId, subjectId },
}: PageProps) => {
  const [
    { data: subject },
    { data: mission },
    { data: session },
    { data: availableInputs },
    { data: availableTemplates },
    { data: subjects },
    user,
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId, { draft: true }),
    getSession(sessionId),
    listInputsBySubjectId(subjectId),
    listTemplatesWithData(),
    listSubjectsByTeamId(),
    getCurrentUser(),
  ]);

  const isTeamMember = subject?.team_id === user?.id;

  if (
    !subject ||
    !mission ||
    !session ||
    !availableInputs ||
    !availableTemplates ||
    !subjects ||
    !isTeamMember
  ) {
    return null;
  }

  return (
    <>
      <PageModalHeader title={mission.name} />
      <SessionLayout
        isCreate
        isTeamMember
        missionId={missionId}
        order={order}
        sessions={mission.sessions}
        subjectId={subjectId}
      >
        <SessionForm
          availableInputs={availableInputs}
          availableTemplates={availableTemplates}
          isDuplicate
          mission={mission}
          order={Number(order)}
          session={session}
          subjects={subjects}
          subjectId={subjectId}
        />
      </SessionLayout>
      <BackButton className="m-0 block w-full py-6 text-center" variant="link">
        Close
      </BackButton>
    </>
  );
};

export default Page;
