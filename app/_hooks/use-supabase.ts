import Context from '@/_context/supabase-context';
import { Database } from '@/_types/database';
import { SupabaseClient } from '@supabase/auth-helpers-nextjs';
import { useContext } from 'react';

const useSupabase = () => useContext(Context) as SupabaseClient<Database>;

export default useSupabase;
