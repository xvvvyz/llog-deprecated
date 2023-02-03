import { useSearchParams } from 'next/navigation';
import CacheKeys from './enum-cache-keys';
import globalValueCache from './global-value-cache';

const useDefaultValues = ({
  cacheKey,
  defaultValues,
}: {
  cacheKey: CacheKeys;
  defaultValues: object;
}) => {
  const searchParams = useSearchParams();

  return searchParams.has('useCache') && globalValueCache.has(cacheKey)
    ? { ...defaultValues, ...globalValueCache.get(cacheKey) }
    : defaultValues;
};

export default useDefaultValues;
