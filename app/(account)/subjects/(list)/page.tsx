import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Avatar from 'components/avatar';
import Button from 'components/button';
import Empty from 'components/empty';
import { List, ListItem } from 'components/list';
import listSubjects from 'utilities/list-subjects';

const Page = async () => {
  const { data: subjects } = await listSubjects();
  if (!subjects?.length) return <Empty>No subjects</Empty>;

  return (
    <List>
      {subjects.map((subject) => (
        <ListItem key={subject.id}>
          <Button
            className="m-0 h-full w-full gap-6 p-0"
            href={`/subjects/${subject.id}`}
            variant="link"
          >
            <Avatar file={subject.image_uri} name={subject.name} />
            <span className="w-3/4 truncate">{subject.name}</span>
            <ArrowRightIcon className="relative -right-[0.1em] ml-auto w-6 shrink-0" />
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
