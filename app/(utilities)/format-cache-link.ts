import { GlobalCacheKey } from './global-value-cache';

const formatCacheLink = ({
  backLink,
  path,
  updateCacheKey,
  updateCachePath,
  useCache = false,
}: {
  backLink: string;
  path: string;
  updateCacheKey?: GlobalCacheKey;
  updateCachePath?: string;
  useCache?: boolean;
}) => {
  return `${path}?back=${backLink}&useCache=${useCache}&updateCacheKey=${updateCacheKey}&updateCachePath=${updateCachePath}`;
};

export default formatCacheLink;
