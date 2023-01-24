import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from 'components/button';
import Empty from 'components/empty';
import { List, ListItem } from 'components/list';
import listTemplates from 'utilities/list-templates';

const Page = async () => {
  const { data: templates } = await listTemplates();
  if (!templates?.length) return <Empty>No templates</Empty>;

  return (
    <List>
      {templates.map((template) => (
        <ListItem key={template.id}>
          <Button
            className="m-0 h-full w-full p-0"
            href={`/templates/${template.id}/edit`}
            variant="link"
          >
            <span className="w-3/4 truncate">{template.name}</span>
            <ArrowRightIcon className="relative -right-[0.1em] ml-auto w-6 shrink-0" />
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
