import BackButton from '(components)/back-button';
import Breadcrumbs from '(components)/breadcrumbs';
import Header from '(components)/header';
import filterListInputsDataBySubjectId from '(utilities)/filter-list-inputs-data-by-subject-id';
import formatTitle from '(utilities)/format-title';
import getSubject from '(utilities)/get-subject';
import listInputs, { ListInputsData } from '(utilities)/list-inputs';
import listRoutineTemplatesWithData from '(utilities)/list-routine-templates-with-data';
import { notFound } from 'next/navigation';
import MissionForm from '../(components)/mission-form';

import getMissionWithRoutines, {
  GetMissionWithEventTypesData,
} from '(utilities)/get-mission-with-routines';

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
  ] = await Promise.all([
    getSubject(subjectId),
    getMissionWithRoutines(missionId),
    listInputs(),
    listRoutineTemplatesWithData(),
  ]);

  if (!subject || !mission) notFound();

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
      />
    </>
  );
};

export const generateMetadata = async ({
  params: { missionId, subjectId },
}: PageProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMissionWithRoutines(missionId),
  ]);

  if (!subject || !mission) return;
  return { title: formatTitle([subject.name, 'Settings', mission.name]) };
};

export const revalidate = 0;
export default Page;
