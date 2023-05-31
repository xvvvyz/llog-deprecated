import { Database } from '@/_types/database';
import { createServerActionClient as c } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';

const createServerActionClient = () => c<Database>({ cookies });

export default createServerActionClient;
