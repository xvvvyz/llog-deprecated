import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import listInputs from '@/(account)/_server/list-inputs';
import sortInputs from '@/(account)/_utilities/sort-inputs';
import FilterableInputLinkList from '@/(account)/inputs/_components/filterable-input-link-list';
import Button from '@/_components/button';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Inputs',
};

export const revalidate = 0;

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
        <Empty className="mx-4">
          <InformationCircleIcon className="w-7" />
          Inputs define the specific data points
          <br />
          you are interested in tracking.
        </Empty>
      )}
    </>
  );
};

export default Page;
