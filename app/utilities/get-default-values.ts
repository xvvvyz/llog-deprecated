import { useSearchParams } from 'next/navigation';
import globalValueCache, { GlobalCacheKey } from './global-value-cache';

const useDefaultValues = ({
  cacheKey,
  defaultValues,
}: {
  cacheKey: GlobalCacheKey;
  defaultValues: unknown;
}) => {
  const searchParams = useSearchParams();

  return searchParams.has('useCache') && globalValueCache.has(cacheKey)
    ? globalValueCache.get(cacheKey)
    : defaultValues;
};

export default useDefaultValues;
