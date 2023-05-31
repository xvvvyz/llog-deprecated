'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import { AuthResponse } from '@supabase/gotrue-js';
import { useRouter } from 'next/navigation';

interface SignInFormProps {
  action: (values: FormData) => Promise<AuthResponse>;
  actionRedirect: string;
}

const SignInForm = ({ action, actionRedirect }: SignInFormProps) => {
  const router = useRouter();

  return (
    <form
      action={async (values: FormData) => {
        const { error } = await action(values);
        if (error) alert(error.message);
        else router.push(actionRedirect);
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
};

export default SignInForm;
