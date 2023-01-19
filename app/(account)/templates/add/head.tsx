import MetaTags from 'components/meta-tags';
import formatTitle from 'utilities/format-title';

const Head = () => (
  <>
    <title>{formatTitle('Add template')}</title>
    <MetaTags />
  </>
);

export default Head;
