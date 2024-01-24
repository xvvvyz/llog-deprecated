import Button from '@/_components/button';
import PageModal from '@/_components/page-modal';
import PageModalHeader from '@/_components/page-modal-header';
import SessionForm from '@/_components/session-form';
import SessionLayout from '@/_components/session-layout';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import getMissionWithSessions from '@/_queries/get-mission-with-sessions';
import getSession from '@/_queries/get-session';
import getSubject from '@/_queries/get-subject';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesWithData from '@/_queries/list-templates-with-data';
import forceArray from '@/_utilities/force-array';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

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
    getMissionWithSessions(missionId, { draft: true }),
  ]);

  const sessions = forceArray(mission?.sessions);
  const currentSession = sessions.find(({ id }) => id === sessionId);
  const sessionOrder = order ? Number(order) : currentSession?.order ?? 0;

  return {
    title: formatTitle([
      subject?.name,
      mission?.name,
      String(sessionOrder + 1),
      'Edit',
    ]),
  };
};

const Page = async ({
  params: { missionId, sessionId, subjectId },
}: PageProps) => {
  const user = await getCurrentUserFromSession();

  const [
    { data: subject },
    { data: mission },
    { data: session },
    { data: availableInputs },
    { data: availableTemplates },
    { data: subjects },
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId, { draft: true }),
    getSession(sessionId),
    listInputsBySubjectId(subjectId),
    listTemplatesWithData(),
    listSubjectsByTeamId(),
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
    notFound();
  }

  const back = `/subjects/${subjectId}/training-plans/${missionId}/sessions`;

  return (
    <PageModal
      back={back}
      temporary_forcePath={`/subjects/${subjectId}/training-plans/${missionId}/sessions/${sessionId}/edit`}
    >
      <PageModalHeader back={back} title={mission.name} />
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
          availableInputs={availableInputs}
          availableTemplates={availableTemplates}
          mission={mission}
          session={session}
          subjects={subjects}
          subjectId={subjectId}
        />
      </SessionLayout>
      <Button
        className="m-0 block w-full py-6 text-center"
        href={back}
        scroll={false}
        variant="link"
      >
        Close
      </Button>
    </PageModal>
  );
};

export default Page;
