import { Database } from '@/_types/database';
import { createRouteHandlerClient as c } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const createServerRouteClient = () => {
  const cookieStore = cookies();
  return c<Database>({ cookies: () => cookieStore });
};

export default createServerRouteClient;
