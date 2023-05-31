import CacheKeys from '@/_constants/enum-cache-keys';
import globalValueCache from '@/_utilities/global-value-cache';
import { useSearchParams } from 'next/navigation';

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
