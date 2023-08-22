import { Database } from '@/_types/database';
import { createServerComponentClient as c } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const createServerComponentClient = () => {
  const cookieStore = cookies();
  return c<Database>({ cookies: () => cookieStore });
};

export default createServerComponentClient;
