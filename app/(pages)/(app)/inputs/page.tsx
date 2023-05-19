import Button from '(components)/button';
import Empty from '(components)/empty';
import Header from '(components)/header';
import listInputs from '(utilities)/list-inputs';
import sortInputs from '(utilities)/sort-inputs';
import FilterableInputLinkList from './(components)/filterable-input-link-list';

const Page = async () => {
  const { data: inputs } = await listInputs();

  return (
    <>
      <Header>
        <h1 className="text-2xl">Inputs</h1>
        <Button href="/inputs/create" size="sm">
          Create input
        </Button>
      </Header>
      {inputs?.length ? (
        <FilterableInputLinkList inputs={inputs.sort(sortInputs)} />
      ) : (
        <Empty>No inputs</Empty>
      )}
    </>
  );
};

export const metadata = { title: 'Inputs' };
export const revalidate = 0;
export default Page;
