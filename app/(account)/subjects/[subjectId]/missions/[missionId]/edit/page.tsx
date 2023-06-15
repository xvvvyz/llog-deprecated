import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getCurrentUser from '@/(account)/_server/get-current-user';
import getMissionWithSessions, {
  GetMissionWithSessionsData,
} from '@/(account)/_server/get-mission-with-sessions';
import getSubject from '@/(account)/_server/get-subject';
import listInputs, { ListInputsData } from '@/(account)/_server/list-inputs';
import listTemplatesWithData from '@/(account)/_server/list-templates-with-data';
import filterListInputsDataBySubjectId from '@/(account)/_utilities/filter-list-inputs-data-by-subject-id';
import formatTitle from '@/(account)/_utilities/format-title';
import MissionForm from '@/(account)/subjects/[subjectId]/missions/[missionId]/edit/_components/mission-form';
import { notFound } from 'next/navigation';

export const generateMetadata = async ({
  params: { missionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId),
  ]);

  return {
    title: formatTitle([subject?.name, mission?.name, 'Edit']),
  };
};

export const revalidate = 0;

interface PageProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

const Page = async ({ params: { missionId, subjectId } }: PageProps) => {
  const [
    { data: subject },
    { data: mission },
    { data: availableInputs },
    { data: availableTemplates },
    user,
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithSessions(missionId),
    listInputs(),
    listTemplatesWithData(),
    getCurrentUser(),
  ]);

  if (!subject || !mission || !user) notFound();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/timeline`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            [mission.name],
            ['Edit'],
          ]}
        />
      </Header>
      <MissionForm
        availableInputs={filterListInputsDataBySubjectId(
          availableInputs as ListInputsData,
          subjectId
        )}
        availableTemplates={availableTemplates}
        mission={mission as GetMissionWithSessionsData}
        subjectId={subjectId}
        userId={user.id}
      />
    </>
  );
};

export default Page;
