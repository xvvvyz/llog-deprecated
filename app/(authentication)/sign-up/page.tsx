import Button from '@/_components/button';
import createServerActionClient from '@/_server/create-server-action-client';
import SignUpForm from './_components/sign-up-form';

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

    return createServerActionClient().auth.signUp({
      email: values.get('email') as string,
      options: {
        data: {
          first_name: values.get('firstName') as string,
          is_client: isClient,
          last_name: values.get('lastName') as string,
        },
      },
      password: values.get('password') as string,
    });
  };

  return (
    <>
      <div className="sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8">
        <h1 className="mb-10 text-2xl">Create an account</h1>
        <SignUpForm action={action} actionRedirect={actionRedirect} />
      </div>
      <p className="flex gap-4">
        <span className="text-fg-3">Have an account?</span>
        <Button forwardSearchParams href="/sign-in" variant="link">
          Sign in
        </Button>
      </p>
    </>
  );
};

export const metadata = { title: 'Sign up' };
export default Page;
