import Empty from '@/_components/empty';
import FilterableInputs from '@/_components/filterable-inputs';
import listInputs from '@/_queries/list-inputs';
import InformationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';
import { sortBy } from 'lodash';

export const metadata = { title: 'Inputs' };

const Page = async () => {
  const { data: inputs } = await listInputs();

  if (!inputs?.length) {
    return (
      <Empty className="mx-4">
        <InformationCircleIcon className="w-7" />
        Inputs define the specific data points
        <br />
        you are interested in tracking.
      </Empty>
    );
  }

  return (
    <FilterableInputs inputs={sortBy(inputs, ['subjects[0].name', 'type'])} />
  );
};

export default Page;
