import Empty from '@/(account)/_components/empty';
import Header from '@/(account)/_components/header';
import LinkList from '@/(account)/_components/link-list';
import listTemplates from '@/(account)/_server/list-templates';
import Button from '@/_components/button';

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
export default Page;
