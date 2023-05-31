import { useRouter, useSearchParams } from 'next/navigation';
import { useTransition } from 'react';

const useSubmitRedirect = () => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const searchParams = useSearchParams();

  return [
    async (
      path: string,
      { redirect }: { redirect?: boolean } = { redirect: true }
    ) =>
      startTransition(() => {
        router.refresh();
        if (!redirect) return;
        router.push(searchParams.get('back') ?? path);
      }),
    isTransitioning,
  ] as const;
};

export default useSubmitRedirect;
