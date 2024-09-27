import InputForm from '@/_components/input-form';
import * as Modal from '@/_components/modal';
import PageModalHeader from '@/_components/page-modal-header';
import listSubjectsByTeamId from '@/_queries/list-subjects-by-team-id';
import getInputUsedBySubjectMap from '@/_utilities/get-input-used-by-subject-map';

import getInputWithUses, {
  GetInputWithUsesData,
} from '@/_queries/get-input-with-uses';

interface PageProps {
  params: Promise<{ inputId: string }>;
}

const Page = async ({ params }: PageProps) => {
  const { inputId } = await params;

  const [{ data: input }, { data: subjects }] = await Promise.all([
    getInputWithUses(inputId),
    listSubjectsByTeamId(),
  ]);

  if (!input || !subjects) return null;

  const usedBy =
    getInputUsedBySubjectMap<NonNullable<GetInputWithUsesData>>(input);

  return (
    <Modal.Content>
      <PageModalHeader title="Edit input" />
      <InputForm
        input={input}
        subjects={subjects}
        usedBy={
          usedBy.size
            ? Array.from(usedBy.values())
                .filter((subject) => !!subject)
                .sort((a, b) => a.name.localeCompare(b.name))
            : []
        }
      />
    </Modal.Content>
  );
};

export default Page;
