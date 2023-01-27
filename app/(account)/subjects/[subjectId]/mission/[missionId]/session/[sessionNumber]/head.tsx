import MetaTags from 'components/meta-tags';
import formatTitle from 'utilities/format-title';
import getMission from 'utilities/get-mission';
import getSubject from 'utilities/get-subject';

interface HeadProps {
  params: {
    missionId: string;
    subjectId: string;
  };
}

const Head = async ({ params: { missionId, subjectId } }: HeadProps) => {
  const [{ data: subject }, { data: mission }] = await Promise.all([
    getSubject(subjectId),
    getMission(missionId),
  ]);

  if (!subject || !mission) return null;

  return (
    <>
      <title>{formatTitle([subject.name, mission.name])}</title>
      <MetaTags />
    </>
  );
};

export default Head;
