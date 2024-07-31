import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const getCustomer = () =>
  createServerSupabaseClient()
    .from('customers')
    .select('customer_id, subscription_status')
    .single();

export type GetCustomerData = Awaited<ReturnType<typeof getCustomer>>['data'];

export default getCustomer;
