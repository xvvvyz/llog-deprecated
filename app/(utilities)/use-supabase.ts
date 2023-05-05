import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useContext } from 'react';
import { Database } from '../(types)/database';
import Context from './supabase-context';

const useSupabase = () => useContext(Context) as SupabaseClient<Database>;

export default useSupabase;
