import { Database } from '@/_types/database';
import { createRouteHandlerClient as c } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const createServerRouteClient = () => c<Database>({ cookies });

export default createServerRouteClient;
