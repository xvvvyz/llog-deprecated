import { useRouter, useSearchParams } from 'next/navigation';
import sleep from './sleep';

const useSubmitRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return async (
    path: string,
    { redirect }: { redirect?: boolean } = { redirect: true }
  ) => {
    await router.refresh();
    if (!redirect) return;
    await router.push(searchParams.get('back') ?? path);
    await sleep();
  };
};

export default useSubmitRedirect;
