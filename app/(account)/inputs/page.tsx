import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import listInputs from '@/(account)/_server/list-inputs';
import sortInputs from '@/(account)/_utilities/sort-inputs';
import FilterableInputLinkList from '@/(account)/inputs/_components/filterable-input-link-list';
import Button from '@/_components/button';

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
      {!!inputs?.length ? (
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
