import Empty from '(components)/empty';
import { LinkList, ListItem } from '(components)/link-list';
import listTemplates from '(utilities)/list-templates';

const Page = async () => {
  const { data: templates } = await listTemplates();
  if (!templates?.length) return <Empty>No templates</Empty>;

  return (
    <LinkList>
      {templates.map((template) => (
        <ListItem
          href={`/templates/${template.id}`}
          key={template.id}
          pill={template.type}
          text={template.name}
        />
      ))}
    </LinkList>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
