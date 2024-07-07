import CollapsibleArchive from '@/_components/collapsible-archive';
import SubjectList from '@/_components/subject-list';
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
