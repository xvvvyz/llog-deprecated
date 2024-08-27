import SessionForm from '@/_components/session-form';
import TemplateType from '@/_constants/enum-template-type';
import getCurrentUser from '@/_queries/get-current-user';
import getSubject from '@/_queries/get-subject';
import getTrainingPlanWithSessions from '@/_queries/get-training-plan-with-sessions';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesWithData from '@/_queries/list-templates-with-data';

interface PageProps {
  params: {
    missionId: string;
    order: string;
    subjectId: string;
  };
}

const Page = async ({ params: { missionId, order, subjectId } }: PageProps) => {
  const [
    { data: availableInputs },
    { data: availableModuleTemplates },
    { data: availableSessionTemplates },
    { data: mission },
    { data: subject },
    { data: subjects },
    user,
  ] = await Promise.all([
    listInputsBySubjectId(subjectId),
    listTemplatesWithData({ type: TemplateType.Module }),
    listTemplatesWithData({ type: TemplateType.Session }),
    getTrainingPlanWithSessions(missionId, { draft: true }),
    getSubject(subjectId),
    listSubjectsByTeamId(),
    getCurrentUser(),
  ]);

  if (
    !subject ||
    !mission ||
    !subjects ||
    !availableInputs ||
    !availableModuleTemplates ||
    !availableSessionTemplates ||
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
      mission={mission}
      order={order}
      subjectId={subjectId}
      subjects={subjects}
    />
  );
};

export default Page;
