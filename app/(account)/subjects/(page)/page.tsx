import Empty from '(components)/empty';
import LinkList from '(components)/link-list';
import listSubjects from '(utilities)/list-subjects';

const Page = async () => {
  const { data: subjects } = await listSubjects();
  if (!subjects?.length) return <Empty>No subjects</Empty>;

  return (
    <LinkList>
      {subjects.map((subject) => (
        <LinkList.Item
          avatar={subject.image_uri}
          href={`/subjects/${subject.id}`}
          key={subject.id}
          text={subject.name}
        />
      ))}
    </LinkList>
  );
};

export const metadata = { title: 'Subjects' };
export default Page;
