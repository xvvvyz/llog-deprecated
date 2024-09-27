import Empty from '@/_components/empty';
import FilterableTemplates from '@/_components/filterable-templates';
import listTemplates from '@/_queries/list-templates';
import InformationCircleIcon from '@heroicons/react/24/outline/InformationCircleIcon';
import { sortBy } from 'lodash';

const Page = async () => {
  const { data: templates } = await listTemplates();

  if (!templates?.length) {
    return (
      <Empty className="mx-4">
        <InformationCircleIcon className="w-7" />
        Templates define reusable content
        <br />
        for event types and protocols.
      </Empty>
    );
  }

  return (
    <FilterableTemplates
      templates={sortBy(templates, ['subjects[0].name', 'type'])}
    />
  );
};

export default Page;
