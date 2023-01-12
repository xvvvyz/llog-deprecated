import MetaTags from 'components/meta-tags';
import formatTitle from 'utilities/format-title';

const Head = () => (
  <>
    <title>{formatTitle('Observations')}</title>
    <MetaTags />
  </>
);

export default Head;
