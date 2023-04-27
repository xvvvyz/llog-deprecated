import Empty from '(components)/empty';
import listInputs from '(utilities)/list-inputs';
import sortInputs from '(utilities)/sort-inputs';
import FilterableInputLinkList from '../(components)/filterable-input-link-list';

const Page = async () => {
  const { data: inputs } = await listInputs();
  if (!inputs?.length) return <Empty>No inputs</Empty>;
  return <FilterableInputLinkList inputs={inputs.sort(sortInputs)} />;
};

export const metadata = { title: 'Inputs' };
export const revalidate = 0;
export default Page;
