import 'server-only';

import { Database } from '(types)/database';
import { createServerComponentSupabaseClient } from '@supabase/auth-helpers-nextjs';
import { cookies, headers } from 'next/headers';

const createServerSupabaseClient = () =>
  createServerComponentSupabaseClient<Database>({ cookies, headers });

export default createServerSupabaseClient;
