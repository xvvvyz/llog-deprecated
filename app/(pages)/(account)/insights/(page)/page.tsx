import listSubjects from '(utilities)/list-subjects';
import InsightsForm from './(components)/insights-form';

const Page = async () => {
  const { data: subjects } = await listSubjects();
  return <InsightsForm subjects={subjects} />;
};

export const metadata = { title: 'Insights' };
export default Page;
