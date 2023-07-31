import SignInForm from '@/(authentication)/sign-in/_components/sign-in-form';
import Button from '@/_components/button';
import createServerActionClient from '@/_server/create-server-action-client';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Sign in',
};

interface PageProps {
  searchParams: {
    redirect?: string;
  };
}

const Page = ({ searchParams }: PageProps) => {
  const actionRedirect = searchParams.redirect ?? '/subjects';

  const action = async (values: FormData) => {
    'use server';

    const { error } = await createServerActionClient().auth.signInWithPassword({
      email: values.get('email') as string,
      password: values.get('password') as string,
    });

    if (error) return { error: error?.message };
    redirect(actionRedirect);
  };

  return (
    <>
      <div className="w-full sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8">
        <h1 className="mb-10 text-2xl">Welcome back</h1>
        <SignInForm action={action} />
      </div>
      <p className="flex gap-6">
        <span className="text-fg-4">Don&rsquo;t have an account?</span>
        <Button forwardSearchParams href="/sign-up" variant="link">
          Sign up
        </Button>
      </p>
    </>
  );
};

export default Page;
