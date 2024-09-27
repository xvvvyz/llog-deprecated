import SessionForm from '@/_components/session-form';
import TemplateType from '@/_constants/enum-template-type';
import getCurrentUser from '@/_queries/get-current-user';
import getProtocolWithSessions from '@/_queries/get-protocol-with-sessions';
import getSubject from '@/_queries/get-subject';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import listTemplatesBySubjectIdAndType from '@/_queries/list-templates-by-subject-id-and-type';

interface PageProps {
  params: Promise<{ order: string; subjectId: string; protocolId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { order, subjectId, protocolId } = await params;

  const [
    { data: availableInputs },
    { data: availableModuleTemplates },
    { data: availableSessionTemplates },
    { data: subject },
    { data: subjects },
    { data: protocol },
    user,
  ] = await Promise.all([
    listInputsBySubjectId(subjectId),
    listTemplatesBySubjectIdAndType({ subjectId, type: TemplateType.Module }),
    listTemplatesBySubjectIdAndType({ subjectId, type: TemplateType.Session }),
    getSubject(subjectId),
    listSubjectsByTeamId(),
    getProtocolWithSessions(protocolId, { draft: true }),
    getCurrentUser(),
  ]);

  if (
    !availableInputs ||
    !availableModuleTemplates ||
    !availableSessionTemplates ||
    !subject ||
    !subjects ||
    !protocol ||
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
      protocol={protocol}
    />
  );
};

export default Page;
