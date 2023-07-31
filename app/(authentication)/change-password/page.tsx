import ChangePasswordForm from '@/(authentication)/change-password/_components/change-password-form';
import createServerActionClient from '@/_server/create-server-action-client';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Change password',
};

const Page = () => {
  const action = async (values: FormData) => {
    'use server';

    const { error } = await createServerActionClient().auth.updateUser({
      password: values.get('password') as string,
    });

    if (error) return { error: error?.message };
    redirect('/subjects');
  };

  return (
    <div className="w-full sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8">
      <h1 className="mb-10 text-3xl font-bold text-fg-1">
        Change your password
      </h1>
      <ChangePasswordForm action={action} />
    </div>
  );
};

export default Page;
