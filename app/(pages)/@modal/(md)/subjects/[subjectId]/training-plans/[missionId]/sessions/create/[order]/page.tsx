import BackButton from '@/_components/back-button';
import PageModalHeader from '@/_components/page-modal-header';
import SessionForm from '@/_components/session-form';
import SessionLayout from '@/_components/session-layout';
import getCurrentUser from '@/_queries/get-current-user';
import getSubject from '@/_queries/get-subject';
import getTrainingPlanWithSessions from '@/_queries/get-training-plan-with-sessions';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesWithData from '@/_queries/list-templates-with-data';
import formatTitle from '@/_utilities/format-title';

interface PageProps {
  params: {
    missionId: string;
    order: string;
    subjectId: string;
  };
}

export const metadata = {
  title: formatTitle(['Subjects', 'Training plans', 'Sessions', 'New']),
};

const Page = async ({ params: { missionId, order, subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: mission },
    { data: subjects },
    { data: availableInputs },
    { data: availableTemplates },
    user,
  ] = await Promise.all([
    getSubject(subjectId),
    getTrainingPlanWithSessions(missionId, { draft: true }),
    listSubjectsByTeamId(),
    listInputsBySubjectId(subjectId),
    listTemplatesWithData(),
    getCurrentUser(),
  ]);

  if (
    !subject ||
    !mission ||
    !subjects ||
    !availableInputs ||
    !availableTemplates ||
    !user ||
    subject.team_id !== user.id
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
