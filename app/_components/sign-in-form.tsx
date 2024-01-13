'use client';

import Button from '@/_components/button';
import ForwardSearchParamsLink from '@/_components/forward-search-params-link';
import Input from '@/_components/input';
import { Suspense } from 'react';

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
    <Input label="Email address" name="email" required type="email" />
    <div className="relative">
      <Input
        label="Password"
        minLength={6}
        name="password"
        required
        type="password"
      />
      <Suspense fallback={null}>
        <ForwardSearchParamsLink
          className="absolute right-2 top-0"
          href="/forgot-password"
        >
          Forgot password?
        </ForwardSearchParamsLink>
      </Suspense>
    </div>
    <Button className="mt-8 w-full" loadingText="Signing in…" type="submit">
      Sign in
    </Button>
  </form>
);

export default SignInForm;
