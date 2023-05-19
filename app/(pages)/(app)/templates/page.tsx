import Button from '(components)/button';
import Empty from '(components)/empty';
import Header from '(components)/header';
import LinkList from '(components)/link-list';
import CODES from '(utilities)/constant-codes';
import listTemplates from '(utilities)/list-templates';

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
      ) : (
        <Empty>No templates</Empty>
      )}
    </>
  );
};

export const metadata = { title: 'Templates' };
export const revalidate = 0;
export default Page;
