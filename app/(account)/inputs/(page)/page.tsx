import Empty from '(components)/empty';
import LinkList from '(components)/link-list';
import INPUT_LABELS from '(utilities)/constant-input-labels';
import forceArray from '(utilities)/force-array';
import listInputs from '(utilities)/list-inputs';
import InputListItemMenu from '../(components)/input-list-item-menu';

const Page = async () => {
  const { data: inputs } = await listInputs();
  if (!inputs?.length) return <Empty>No inputs</Empty>;

  return (
    <LinkList>
      {inputs.map((input) => (
        <LinkList.Item
          avatars={forceArray(input.subjects)}
          href={`/inputs/${input.id}`}
          icon="edit"
          key={input.id}
          menu={<InputListItemMenu inputId={input.id} />}
          pill={INPUT_LABELS[input.type]}
          text={input.label}
        />
      ))}
    </LinkList>
  );
};

export const metadata = { title: 'Inputs' };
export const revalidate = 0;
export default Page;
