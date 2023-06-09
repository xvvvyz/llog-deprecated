import CacheKeys from '@/(account)/_constants/enum-cache-keys';

const formatCacheLink = ({
  backLink,
  path,
  updateCacheKey = '',
  updateCachePath = '',
  useCache = false,
}: {
  backLink: string;
  path: string;
  updateCacheKey?: CacheKeys | '';
  updateCachePath?: string;
  useCache?: boolean;
}) => {
  const delimiter = path.includes('?') ? '&' : '?';
  return `${path}${delimiter}back=${backLink}&useCache=${useCache}&updateCacheKey=${updateCacheKey}&updateCachePath=${updateCachePath}`;
};

export default formatCacheLink;
