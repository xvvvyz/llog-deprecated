import Button from '(components)/button';
import Empty from '(components)/empty';
import { List, ListItem } from '(components)/list';
import Pill from '(components)/pill';
import listTemplates from '(utilities)/list-templates';
import { ArrowRightIcon } from '@heroicons/react/24/outline';

const Page = async () => {
  const { data: templates } = await listTemplates();
  if (!templates?.length) return <Empty>No templates</Empty>;

  return (
    <List>
      {templates.map((template) => (
        <ListItem key={template.id}>
          <Button
            className="m-0 h-full w-full justify-between gap-6 p-0"
            href={`/templates/${template.id}`}
            variant="link"
          >
            <span className="truncate">{template.name}</span>
            <div className="flex shrink-0 gap-6">
              <Pill>{template.type}</Pill>
              <ArrowRightIcon className="relative -right-[0.1em] ml-auto w-6" />
            </div>
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
