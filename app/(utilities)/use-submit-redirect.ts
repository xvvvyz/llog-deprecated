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
    ) => {
      await router.refresh();
      if (!redirect) return;
      startTransition(() => router.push(searchParams.get('back') ?? path));
    },
    isTransitioning,
  ] as const;
};

export default useSubmitRedirect;
