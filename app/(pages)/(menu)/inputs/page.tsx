import FilterableInputs from '@/_components/filterable-inputs';
import PageBreadcrumb from '@/_components/page-breadcrumb';
import listInputsWithUses from '@/_queries/list-inputs-with-uses';
import { sortBy } from 'lodash';

const Page = async () => {
  const [{ data: inputs }] = await Promise.all([listInputsWithUses()]);
  if (!inputs) return null;

  return (
    <>
      <PageBreadcrumb last="Inputs" />
      <FilterableInputs inputs={sortBy(inputs, ['subjects[0].name', 'type'])} />
    </>
  );
};

export default Page;
