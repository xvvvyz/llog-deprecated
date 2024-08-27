import SessionForm from '@/_components/session-form';
import TemplateType from '@/_constants/enum-template-type';
import getCurrentUser from '@/_queries/get-current-user';
import getSession from '@/_queries/get-session';
import getSubject from '@/_queries/get-subject';
import getTrainingPlanWithSessions from '@/_queries/get-training-plan-with-sessions';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesWithData from '@/_queries/list-templates-with-data';

interface PageProps {
  params: {
    missionId: string;
    order: string;
    sessionId: string;
    subjectId: string;
  };
}

const Page = async ({
  params: { missionId, order, sessionId, subjectId },
}: PageProps) => {
  const [
    { data: availableInputs },
    { data: availableModuleTemplates },
    { data: availableSessionTemplates },
    { data: mission },
    { data: session },
    { data: subject },
    { data: subjects },
    user,
  ] = await Promise.all([
    listInputsBySubjectId(subjectId),
    listTemplatesWithData({ type: TemplateType.Module }),
    listTemplatesWithData({ type: TemplateType.Session }),
    getTrainingPlanWithSessions(missionId, { draft: true }),
    getSession(sessionId),
    getSubject(subjectId),
    listSubjectsByTeamId(),
    getCurrentUser(),
  ]);

  if (
    !availableInputs ||
    !availableModuleTemplates ||
    !availableSessionTemplates ||
    !mission ||
    !session ||
    !subject ||
    !subjects ||
    !user ||
    subject.team_id !== user.id
  ) {
    return null;
  }

  return (
    <SessionForm
      availableInputs={availableInputs}
      availableModuleTemplates={availableModuleTemplates}
      availableSessionTemplates={availableSessionTemplates}
      isDuplicate
      mission={mission}
      order={order}
      session={session}
      subjectId={subjectId}
      subjects={subjects}
    />
  );
};

export default Page;
