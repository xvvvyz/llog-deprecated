import Empty from '(components)/empty';
import { LinkList, ListItem } from '(components)/link-list';
import CODES from '(utilities)/constant-codes';
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
          pill={CODES[template.type]}
          text={template.name}
        />
      ))}
    </LinkList>
  );
};

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Templates' };
export default Page;
