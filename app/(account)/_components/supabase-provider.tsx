'use client';

import SupabaseContext from '@/(account)/_context/supabase-context';
import { createPagesBrowserClient as c } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo } from 'react';

interface SupabaseProviderProps {
  children: ReactNode;
}

const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const router = useRouter();
  const supabase = useMemo(() => c(), []);

  useEffect(() => {
    const { data: authChannel } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.push('/sign-in');
      router.refresh();
    });

    const notificationsChannel = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'notifications' },
        router.refresh
      )
      .subscribe();

    return () => {
      void authChannel.subscription.unsubscribe();
      void supabase.removeChannel(notificationsChannel);
    };
  }, [router, supabase]);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
