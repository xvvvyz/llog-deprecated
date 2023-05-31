import { Database } from '@/_types/database';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createContext } from 'react';

const Context = createContext<SupabaseClient<Database> | undefined>(undefined);

export default Context;
