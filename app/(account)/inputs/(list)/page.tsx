import { ArrowRightIcon } from '@heroicons/react/24/outline';
import Button from 'components/button';
import Empty from 'components/empty';
import { List, ListItem } from 'components/list';
import listInputs from 'utilities/list-inputs';

const Page = async () => {
  const { data: inputs } = await listInputs();
  if (!inputs?.length) return <Empty>No inputs</Empty>;

  return (
    <List>
      {inputs.map((input) => (
        <ListItem key={input.id}>
          <Button
            className="m-0 h-full w-full p-0"
            href={`/inputs/${input.id}/edit`}
            variant="link"
          >
            <span className="w-3/4 truncate">{input.label}</span>
            <ArrowRightIcon className="relative -right-[0.1em] ml-auto w-6 shrink-0" />
          </Button>
        </ListItem>
      ))}
    </List>
  );
};

export const dynamic = 'force-dynamic';
export default Page;
