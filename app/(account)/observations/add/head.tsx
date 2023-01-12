import MetaTags from 'components/meta-tags';
import formatTitle from 'utilities/format-title';

const Head = () => (
  <>
    <title>{formatTitle('Add observation type')}</title>
    <MetaTags />
  </>
);

export default Head;
