import getMissionWithSessions from '@/(account)/_server/get-mission-with-sessions';
import getSubject from '@/(account)/_server/get-subject';
import listInputs, { ListInputsData } from '@/(account)/_server/list-inputs';
import filterListInputsDataBySubjectId from '@/(account)/_utilities/filter-list-inputs-data-by-subject-id';
import formatTitle from '@/(account)/_utilities/format-title';
import SessionForm from '@/(account)/subjects/[subjectId]/missions/[missionId]/sessions/_components/session-form';
import { notFound } from 'next/navigation';

import listTemplatesWithData, {
  ListTemplatesWithDataData,
} from '@/(account)/_server/list-templates-with-data';

export const generateMetadata = async ({
  params: { missionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId),
  ]);

  return {
    title: formatTitle([subject?.name, mission?.name, 'Create session']),
  };
};

export const revalidate = 0;

interface PageProps {
  params: {
    missionId: string;
    order: string;
    subjectId: string;
  };
}

const Page = async ({ params: { missionId, order, subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: mission },
    { data: availableInputs },
    { data: availableTemplates },
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId),
    listInputs(),
    listTemplatesWithData(),
  ]);

  if (!subject || !mission) notFound();

  return (
    <SessionForm
      availableInputs={filterListInputsDataBySubjectId(
        availableInputs as ListInputsData,
        subjectId
      )}
      availableTemplates={availableTemplates as ListTemplatesWithDataData}
      mission={mission}
      order={Number(order)}
      subjectId={subjectId}
    />
  );
};

export default Page;
