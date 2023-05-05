'use client';

import SupabaseContext from '(utilities)/supabase-context';
import { createBrowserSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import { ReactNode, useEffect, useMemo } from 'react';

interface SupabaseProviderProps {
  children: ReactNode;
}

const SupabaseProvider = ({ children }: SupabaseProviderProps) => {
  const router = useRouter();
  const supabase = useMemo(() => createBrowserSupabaseClient(), []);

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') router.push('/sign-in');
      router.refresh();
    });

    return () => data.subscription.unsubscribe();
  }, [router, supabase]);

  return (
    <SupabaseContext.Provider value={supabase}>
      {children}
    </SupabaseContext.Provider>
  );
};

export default SupabaseProvider;
