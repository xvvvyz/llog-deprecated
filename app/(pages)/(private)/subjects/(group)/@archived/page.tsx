import SubjectList from '@/_components/subject-list';
import CollapsibleArchive from '@/_queries/collapsible-archive';
import countArchivedSubjects from '@/_queries/count-archived-subjects';

const Page = async () => {
  const { count } = await countArchivedSubjects();
  if (!count) return null;

  return (
    <CollapsibleArchive>
      <SubjectList archived />
    </CollapsibleArchive>
  );
};

export default Page;
