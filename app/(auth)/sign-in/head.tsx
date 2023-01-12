import MetaTags from 'components/meta-tags';
import formatTitle from 'utilities/format-title';

const Head = () => (
  <>
    <title>{formatTitle('Sign in')}</title>
    <MetaTags />
  </>
);

export default Head;
