import CacheKeys from '@/_constants/enum-cache-keys';
import globalValueCache from '@/_utilities/global-value-cache';
import get from 'lodash/get';
import set from 'lodash/set';
import { useSearchParams } from 'next/navigation';

const useUpdateGlobalValueCache = () => {
  const searchParams = useSearchParams();

  return (value: unknown) => {
    const updateCacheKey = searchParams.get('updateCacheKey') as CacheKeys;

    if (
      !globalValueCache.has(updateCacheKey) ||
      !searchParams.has('updateCachePath')
    ) {
      return;
    }

    const cache = globalValueCache.get(updateCacheKey);
    const updateCachePath = searchParams.get('updateCachePath') as string;
    const existing = get(cache, updateCachePath);

    if (Array.isArray(existing)) {
      existing.push(value);
      set(cache, updateCachePath, existing);
    } else {
      set(cache, updateCachePath, value);
    }

    globalValueCache.set(updateCacheKey, cache);
  };
};

export default useUpdateGlobalValueCache;
