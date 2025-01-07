import FilterableCommunityTemplates from '@/_components/filterable-community-templates';
import PageBreadcrumb from '@/_components/page-breadcrumb';
import listCommunityTemplates from '@/_queries/list-community-templates';

const Page = async () => {
  const [{ data: templates }] = await Promise.all([listCommunityTemplates()]);
  if (!templates) return null;

  return (
    <>
      <PageBreadcrumb last="Community templates" />
      <FilterableCommunityTemplates templates={templates} />
    </>
  );
};

export default Page;
