import Empty from '(components)/empty';
import LinkList from '(components)/link-list';
import CODES from '(utilities)/constant-codes';
import listTemplates from '(utilities)/list-templates';

const Page = async () => {
  const { data: templates } = await listTemplates();
  if (!templates?.length) return <Empty>No templates</Empty>;

  return (
    <LinkList>
      {templates.map((template) => (
        <LinkList.Item
          href={`/templates/${template.id}`}
          icon="edit"
          key={template.id}
          pill={CODES[template.type]}
          text={template.name}
        />
      ))}
    </LinkList>
  );
};

export const metadata = { title: 'Templates' };
export default Page;
