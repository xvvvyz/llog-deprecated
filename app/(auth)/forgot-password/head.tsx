import MetaTags from 'components/meta-tags';
import formatTitle from 'utilities/format-title';

const Head = () => (
  <>
    <title>{formatTitle('Forgot password')}</title>
    <MetaTags />
  </>
);

export default Head;
