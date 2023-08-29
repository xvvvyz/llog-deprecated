import { usePathname, useSearchParams } from 'next/navigation';

const useBackLink = (params: Record<string, boolean | string> = {}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const newSearchParams = new URLSearchParams(
    searchParams as unknown as URLSearchParams,
  );

  Object.entries(params).forEach(([k, v]) => newSearchParams.set(k, String(v)));
  const backRaw = `${pathname}?${newSearchParams.toString()}`;
  return encodeURIComponent(backRaw);
};

export default useBackLink;
