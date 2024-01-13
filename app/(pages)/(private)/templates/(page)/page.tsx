import Button from '@/_components/button';
import Empty from '@/_components/empty';
import TemplateLinkListItemMenu from '@/_components/template-link-list-item-menu';
import listTemplates from '@/_server/list-templates';
import { InformationCircleIcon } from '@heroicons/react/24/outline';

export const metadata = { title: 'Templates' };
export const revalidate = 0;

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

  return (
    <ul className="mx-4 rounded border border-alpha-1 bg-bg-2 py-1">
      {templates.map((template) => (
        <li className="flex items-stretch hover:bg-alpha-1" key={template.id}>
          <Button
            className="m-0 w-full px-4 py-3 pr-0 leading-snug"
            href={`/templates/${template.id}`}
            variant="link"
          >
            {template.name}
          </Button>
          <TemplateLinkListItemMenu templateId={template.id} />
        </li>
      ))}
    </ul>
  );
};

export default Page;
