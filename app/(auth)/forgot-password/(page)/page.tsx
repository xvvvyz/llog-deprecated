import Button from '(components)/button';
import ForgotPasswordForm from './(components)/forgot-password-form';

const Page = () => (
  <>
    <div className="sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8">
      <h1 className="text-2xl">Forgot your password?</h1>
      <p className="mt-3 mb-8 text-fg-3">
        Enter the email address associated with your account and we will send
        you a link to change&nbsp;your&nbsp;password.
      </p>
      <ForgotPasswordForm />
    </div>
    <Button forwardSearchParams href="/sign-in" variant="link">
      Return to sign in
    </Button>
  </>
);

export const metadata = { title: 'Forgot password' };
export default Page;
