import Empty from '@/_components/empty';
import FilterableTemplates from '@/_components/filterable-templates';
import listTemplates from '@/_queries/list-templates';
import InformationCircleIcon from '@heroicons/react/24/outline/ExclamationCircleIcon';

export const metadata = { title: 'Templates' };

const Page = async () => {
  const { data: templates } = await listTemplates();

  if (!templates?.length) {
    return (
      <Empty className="mx-4">
        <InformationCircleIcon className="w-7" />
        Templates define reusable content for
        <br />
        event types and session modules.
      </Empty>
    );
  }

  return <FilterableTemplates templates={templates} />;
};

export default Page;
