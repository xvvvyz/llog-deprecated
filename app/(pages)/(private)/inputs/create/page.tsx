import BackButton from '@/_components/back-button';
import Breadcrumbs from '@/_components/breadcrumbs';
import InputForm from '@/_components/input-form';
import listSubjectsByTeamId from '@/_server/list-subjects-by-team-id';
import formatTitle from '@/_utilities/format-title';

export const metadata = { title: formatTitle(['Inputs', 'Create']) };
export const revalidate = 0;

const Page = async () => {
  const { data: subjects } = await listSubjectsByTeamId();

  return (
    <>
      <div className="my-16 flex h-8 items-center justify-between gap-8 px-4">
        <BackButton href="/inputs" />
        <Breadcrumbs items={[['Inputs', '/inputs'], ['Create']]} />
      </div>
      <InputForm subjects={subjects} />
    </>
  );
};

export default Page;
