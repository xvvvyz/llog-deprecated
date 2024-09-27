'use client';

import createBrowserSupabaseClient from '@/_utilities/create-browser-supabase-client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

const NotificationsSubscription = () => {
  const router = useRouter();

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

  return null;
};

export default NotificationsSubscription;
