import createServerComponentClient from './create-server-component-client';

const countNotifications = async () =>
  createServerComponentClient()
    .from('notifications')
    .select('*', { count: 'exact', head: true })
    .eq('read', false);

export default countNotifications;
