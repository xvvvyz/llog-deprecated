import SessionForm from '@/_components/session-form';
import TemplateType from '@/_constants/enum-template-type';
import getCurrentUser from '@/_queries/get-current-user';
import getSubject from '@/_queries/get-subject';
import getTrainingPlanWithSessions from '@/_queries/get-training-plan-with-sessions';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesBySubjectIdAndType from '@/_queries/list-templates-by-subject-id-and-type';

interface PageProps {
  params: {
    order: string;
    subjectId: string;
    trainingPlanId: string;
  };
}

const Page = async ({
  params: { order, subjectId, trainingPlanId },
}: PageProps) => {
  const [
    { data: availableInputs },
    { data: availableModuleTemplates },
    { data: availableSessionTemplates },
    { data: subject },
    { data: subjects },
    { data: trainingPlan },
    user,
  ] = await Promise.all([
    listInputsBySubjectId(subjectId),
    listTemplatesBySubjectIdAndType({ subjectId, type: TemplateType.Module }),
    listTemplatesBySubjectIdAndType({ subjectId, type: TemplateType.Session }),
    getSubject(subjectId),
    listSubjectsByTeamId(),
    getTrainingPlanWithSessions(trainingPlanId, { draft: true }),
    getCurrentUser(),
  ]);

  if (
    !availableInputs ||
    !availableModuleTemplates ||
    !availableSessionTemplates ||
    !subject ||
    !subjects ||
    !trainingPlan ||
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
      order={order}
      subjectId={subjectId}
      subjects={subjects}
      trainingPlan={trainingPlan}
    />
  );
};

export default Page;
