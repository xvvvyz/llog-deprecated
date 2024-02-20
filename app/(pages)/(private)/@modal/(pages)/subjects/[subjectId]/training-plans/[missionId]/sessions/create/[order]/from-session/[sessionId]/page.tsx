import Button from '@/_components/button';
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
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    missionId: string;
    order: string;
    sessionId: string;
    subjectId: string;
  };
  searchParams: {
    back?: string;
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
      'Create',
    ]),
  };
};

const Page = async ({
  params: { missionId, order, sessionId, subjectId },
  searchParams: { back },
}: PageProps) => {
  if (!back) notFound();
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

  return (
    <>
      <PageModalHeader back={back} title={mission.name} />
      <SessionLayout
        back={back}
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
      <Button
        className="m-0 block w-full py-6 text-center"
        href={back}
        scroll={false}
        variant="link"
      >
        Close
      </Button>
    </>
  );
};

export default Page;
