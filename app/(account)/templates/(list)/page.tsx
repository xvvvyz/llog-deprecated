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
            className="flex h-full w-3/4 items-center gap-6"
            disabled
            variant="link"
          >
            <span className="truncate">{template.name}</span>
          </Button>
          <Button
            colorScheme="transparent"
            href={`/templates/${template.id}/edit`}
            size="sm"
          >
            Edit
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
