import SessionForm from '@/(account)/subjects/[subjectId]/missions/[missionId]/sessions/_components/session-form';
import getMissionWithSessions from '@/_server/get-mission-with-sessions';
import getSubject from '@/_server/get-subject';
import listInputs, { ListInputsData } from '@/_server/list-inputs';
import filterListInputsDataBySubjectId from '@/_utilities/filter-list-inputs-data-by-subject-id';
import formatTitle from '@/_utilities/format-title';
import { notFound } from 'next/navigation';

import listTemplatesWithData, {
  ListTemplatesWithDataData,
} from '@/_server/list-templates-with-data';

interface PageProps {
  params: {
    missionId: string;
    order: string;
    subjectId: string;
  };
}

export const generateMetadata = async ({
  params: { missionId, order, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId, true),
  ]);

  return {
    title: formatTitle([
      subject?.name,
      mission?.name,
      String(Number(order) + 1),
      'Edit',
    ]),
  };
};

export const revalidate = 0;

const Page = async ({ params: { missionId, order, subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: mission },
    { data: availableInputs },
    { data: availableTemplates },
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId, true),
    listInputs(),
    listTemplatesWithData(),
  ]);

  if (!subject || !mission) notFound();

  return (
    <SessionForm
      availableInputs={filterListInputsDataBySubjectId(
        availableInputs as ListInputsData,
        subjectId,
      )}
      availableTemplates={availableTemplates as ListTemplatesWithDataData}
      mission={mission}
      order={Number(order)}
      subjectId={subjectId}
    />
  );
};

export default Page;
