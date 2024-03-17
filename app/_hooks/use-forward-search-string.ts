import { useSearchParams } from 'next/navigation';

const useForwardSearchString = (href?: string) => {
  const searchParams = useSearchParams();
  const searchString = searchParams.toString();

  return href
    ? `${href}${searchString ? `${href.includes('?') ? '&' : '?'}${searchString}` : ''}`
    : undefined;
};

export default useForwardSearchString;
