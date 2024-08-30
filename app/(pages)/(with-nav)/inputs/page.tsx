import Empty from '@/_components/empty';
import FilterableInputs from '@/_components/filterable-inputs';
import listInputsWithUses from '@/_queries/list-inputs-with-uses';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import { sortBy } from 'lodash';

const Page = async () => {
  const { data: inputs } = await listInputsWithUses();

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
