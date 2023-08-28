import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import listTemplates from '@/(account)/_server/list-templates';
import TemplateLinkListItemMenu from '@/(account)/templates/_components/template-link-list-item-menu';
import Button from '@/_components/button';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const metadata = {
  title: 'Templates',
};

export const revalidate = 0;

const Page = async () => {
  const { data: templates } = await listTemplates();

  return (
    <>
      <Header>
        <h1 className="text-2xl">Templates</h1>
        <Button href="/templates/create" size="sm">
          Create template
        </Button>
      </Header>
      {templates?.length ? (
        <ul className="mx-4 rounded border border-alpha-1 bg-bg-2 py-1">
          {templates.map((template) => (
            <li
              className="flex items-stretch hover:bg-alpha-1"
              key={template.id}
            >
              <Button
                className="m-0 w-full gap-6 px-4 py-3 pr-0 leading-snug [overflow-wrap:anywhere]"
                href={`/templates/${template.id}`}
                variant="link"
              >
                {template.name}
              </Button>
              <TemplateLinkListItemMenu templateId={template.id} />
            </li>
          ))}
        </ul>
      ) : (
        <Empty className="mx-4">
          <InformationCircleIcon className="w-7" />
          Templates define reusable content for
          <br />
          event types and session modules.
        </Empty>
      )}
    </>
  );
};

export default Page;
