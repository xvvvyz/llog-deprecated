import ForwardSearchParamsLink from '@/_components/forward-search-params-link';
import SignUpForm from '@/_components/sign-up-form';
import createServerActionClient from '@/_server/create-server-action-client';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export const metadata = { title: 'Sign up' };

interface PageProps {
  searchParams: {
    redirect?: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  const actionRedirect = searchParams.redirect ?? '/subjects';
  const isClient = actionRedirect.includes('/join/');

  const action = async (values: FormData) => {
    'use server';

    const proto = headers().get('x-forwarded-proto');
    const host = headers().get('host');

    const { error } = await createServerActionClient().auth.signUp({
      email: values.get('email') as string,
      options: {
        data: {
          first_name: values.get('firstName') as string,
          is_client: isClient,
          last_name: values.get('lastName') as string,
        },
        emailRedirectTo: `${proto}://${host}/sign-up/exchange-code-for-session?redirect=${actionRedirect}`,
      },
      password: values.get('password') as string,
    });

    if (error) return { error: error?.message };
    redirect('/sign-up/email-sent');
  };

  return (
    <>
      <div className="sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8">
        <h1 className="mb-10 text-2xl">Create your account</h1>
        <SignUpForm action={action} />
      </div>
      <p className="flex gap-4">
        <span className="text-fg-4">Have an account?</span>
        <Suspense fallback={null}>
          <ForwardSearchParamsLink href="/sign-in">
            Sign in
          </ForwardSearchParamsLink>
        </Suspense>
      </p>
    </>
  );
};

export default Page;
