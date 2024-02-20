import BackButton from '@/_components/back-button';
import PageModalHeader from '@/_components/page-modal-header';
import SessionForm from '@/_components/session-form';
import SessionLayout from '@/_components/session-layout';
import getCurrentUserFromSession from '@/_queries/get-current-user-from-session';
import getMissionWithSessions from '@/_queries/get-mission-with-sessions';
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
  params: { missionId, order, subjectId },
  searchParams: { back },
}: PageProps) => {
  if (!back) notFound();
  const user = await getCurrentUserFromSession();

  const [
    { data: subject },
    { data: mission },
    { data: subjects },
    { data: availableInputs },
    { data: availableTemplates },
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId, { draft: true }),
    listSubjectsByTeamId(),
    listInputsBySubjectId(subjectId),
    listTemplatesWithData(),
  ]);

  const isTeamMember = subject?.team_id === user?.id;

  if (
    !subject ||
    !mission ||
    !subjects ||
    !availableInputs ||
    !availableTemplates ||
    !isTeamMember
  ) {
    notFound();
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
          mission={mission}
          order={Number(order)}
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
