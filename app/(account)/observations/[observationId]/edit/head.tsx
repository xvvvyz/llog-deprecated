import MetaTags from 'components/meta-tags';
import formatTitle from 'utilities/format-title';
import getObservation from 'utilities/get-observation';

interface HeadProps {
  params: {
    observationId: string;
  };
}

const Head = async ({ params: { observationId } }: HeadProps) => {
  const { data: observation } = await getObservation(observationId);
  if (!observation) return null;

  return (
    <>
      <title>{formatTitle([observation.name, 'Edit'])}</title>
      <MetaTags />
    </>
  );
};

export default Head;
