import { Database } from '@/_types/database';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

const createServerSupabaseClient = async ({
  apiKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
} = {}) => {
  const cookieStore = await cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    apiKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // noop
          }
        },
      },
    },
  );
};

export default createServerSupabaseClient;
