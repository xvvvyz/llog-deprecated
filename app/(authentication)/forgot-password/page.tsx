import Button from '@/_components/button';
import createServerActionClient from '@/_server/create-server-action-client';
import { headers } from 'next/headers';
import ForgotPasswordForm from './_components/forgot-password-form';

const Page = () => {
  const action = async (values: FormData) => {
    'use server';

    const proto = headers().get('x-forwarded-proto');
    const host = headers().get('host');

    return createServerActionClient().auth.resetPasswordForEmail(
      values.get('email') as string,
      { redirectTo: `${proto}://${host}/change-password` }
    );
  };

  return (
    <>
      <div className="sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8">
        <h1 className="text-2xl">Forgot your password?</h1>
        <p className="mb-10 mt-3 text-fg-3">
          Enter the email address associated with your account and we will send
          you a link to change&nbsp;your&nbsp;password.
        </p>
        <ForgotPasswordForm action={action} />
      </div>
      <Button forwardSearchParams href="/sign-in" variant="link">
        Return to sign in
      </Button>
    </>
  );
};

export const metadata = { title: 'Forgot password' };
export default Page;
