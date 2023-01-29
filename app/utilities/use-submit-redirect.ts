import { useRouter, useSearchParams } from 'next/navigation';
import sleep from './sleep';

const useSubmitRedirect = () => {
  const router = useRouter();
  const searchParams = useSearchParams();

  return async (path: string) => {
    await router.push(searchParams.get('back') ?? path);
    await router.refresh();
    await sleep();
  };
};

export default useSubmitRedirect;
