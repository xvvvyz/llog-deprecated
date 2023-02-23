import Button from '(components)/button';
import SignUpForm from './(components)/sign-up-form';

const Page = () => (
  <>
    <div className="sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8">
      <h1 className="mb-8 text-2xl">Create an account</h1>
      <SignUpForm />
    </div>
    <p className="flex gap-4">
      <span className="text-fg-3">Have an account?</span>
      <Button forwardSearchParams href="/sign-in" variant="link">
        Sign in
      </Button>
    </p>
  </>
);

export const metadata = { title: 'Sign up' };
export default Page;
