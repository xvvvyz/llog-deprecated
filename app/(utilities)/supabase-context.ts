import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { createContext } from 'react';
import { Database } from '../(types)/database';

const Context = createContext<SupabaseClient<Database> | undefined>(undefined);

export default Context;
