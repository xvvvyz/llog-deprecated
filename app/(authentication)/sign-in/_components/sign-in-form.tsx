'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';

interface SignInFormProps {
  action: (values: FormData) => Promise<{ error?: string }>;
}

const SignInForm = ({ action }: SignInFormProps) => (
  <form
    action={async (values: FormData) => {
      const { error } = await action(values);
      if (error) alert(error);
    }}
    className="flex flex-col gap-6"
  >
    <Input label="Email address" name="email" type="email" />
    <div className="relative">
      <Input label="Password" name="password" type="password" />
      <Button
        className="absolute right-2 top-0"
        forwardSearchParams
        href="/forgot-password"
        variant="link"
      >
        Forgot your password?
      </Button>
    </div>
    <Button className="mt-8 w-full" loadingText="Signing in…" type="submit">
      Sign in
    </Button>
  </form>
);

export default SignInForm;
