import MetaTags from 'components/meta-tags';
import formatTitle from 'utilities/format-title';
import getObservation from 'utilities/get-observation';
import getSubject from 'utilities/get-subject';

interface HeadProps {
  params: {
    observationId: string;
    subjectId: string;
  };
}

const Head = async ({ params: { observationId, subjectId } }: HeadProps) => {
  const [{ data: subject }, { data: observation }] = await Promise.all([
    getSubject(subjectId),
    getObservation(observationId),
  ]);

  if (!subject || !observation) return null;

  return (
    <>
      <title>
        {formatTitle([subject.name, 'Observation', observation.name])}
      </title>
      <MetaTags />
    </>
  );
};

export default Head;
