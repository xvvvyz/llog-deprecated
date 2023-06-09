import createServerComponentClient from '@/_server/create-server-component-client';

const getCurrentUser = async () =>
  (await createServerComponentClient().auth.getUser())?.data?.user;

export default getCurrentUser;
