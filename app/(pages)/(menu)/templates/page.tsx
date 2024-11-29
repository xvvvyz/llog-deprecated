import FilterableTemplates from '@/_components/filterable-templates';
import PageBreadcrumb from '@/_components/page-breadcrumb';
import listTemplates from '@/_queries/list-templates';
import { sortBy } from 'lodash';

const Page = async () => {
  const [{ data: templates }] = await Promise.all([listTemplates()]);
  if (!templates) return null;

  return (
    <>
      <PageBreadcrumb last="Templates" />
      <FilterableTemplates
        templates={sortBy(templates, ['subjects[0].name', 'type'])}
      />
    </>
  );
};

export default Page;
