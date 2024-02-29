'use client';

import createBrowserSupabaseClient from '@/_utilities/create-browser-supabase-client';
import { usePrevious } from '@uidotdev/usehooks';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';

const Subscriptions = () => {
  const router = useRouter();
  const pathname = usePathname();
  const prevPathname = usePrevious(pathname);

  useEffect(() => {
    const supabase = createBrowserSupabaseClient();

    const notificationsChannel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'notifications' },
        router.refresh,
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(notificationsChannel);
    };
  }, [router]);

  useEffect(() => {
    if (prevPathname !== pathname && localStorage.getItem('refresh')) {
      router.refresh();
      localStorage.removeItem('refresh');
    }
  }, [pathname, prevPathname, router]);

  return null;
};

export default Subscriptions;
