import BackButton from '@/(account)/_components/back-button';
import Breadcrumbs from '@/(account)/_components/breadcrumbs';
import Header from '@/(account)/_components/header';
import getSubject from '@/(account)/_server/get-subject';
import listInputs, { ListInputsData } from '@/(account)/_server/list-inputs';
import listRoutineTemplatesWithData from '@/(account)/_server/list-routine-templates-with-data';
import filterListInputsDataBySubjectId from '@/(account)/_utilities/filter-list-inputs-data-by-subject-id';
import formatTitle from '@/(account)/_utilities/format-title';
import MissionForm from '@/(account)/subjects/[subjectId]/settings/mission/_components/mission-form';
import { notFound } from 'next/navigation';

import getCurrentUser from '@/(account)/_server/get-current-user';
import getMissionWithEventTypes, {
  GetMissionWithEventTypesData,
} from '@/(account)/_server/get-mission-with-event-types';

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
    getMissionWithEventTypes(missionId),
    listInputs(),
    listRoutineTemplatesWithData(),
    getCurrentUser(),
  ]);

  if (!subject || !mission || !user) notFound();

  return (
    <>
      <Header>
        <BackButton href={`/subjects/${subjectId}/settings`} />
        <Breadcrumbs
          items={[
            [subject.name, `/subjects/${subjectId}/timeline`],
            ['Settings', `/subjects/${subjectId}/settings`],
            [mission.name],
          ]}
        />
      </Header>
      <MissionForm
        availableInputs={filterListInputsDataBySubjectId(
          availableInputs as ListInputsData,
          subjectId
        )}
        availableTemplates={availableTemplates}
        mission={mission as GetMissionWithEventTypesData}
        subjectId={subjectId}
        userId={user.id}
      />
    </>
  );
};

export const generateMetadata = async ({
  params: { missionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithEventTypes(missionId),
  ]);

  if (!subject || !mission) return;
  return { title: formatTitle([subject.name, 'Settings', mission.name]) };
};

export default Page;
