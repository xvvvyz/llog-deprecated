import Button from '@/_components/button';
import Empty from '@/_components/empty';
import Header from '@/_components/header';
import LinkList from '@/_components/link-list';
import listTemplates from '@/_server/list-templates';

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
      {!!templates?.length ? (
        <LinkList>
          {templates.map((template) => (
            <LinkList.Item
              href={`/templates/${template.id}`}
              icon="edit"
              key={template.id}
              pill={template.type.charAt(0).toUpperCase()}
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
