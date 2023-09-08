'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';

interface SignUpFormProps {
  action: (values: FormData) => Promise<{ error?: string }>;
}

const SignUpForm = ({ action }: SignUpFormProps) => (
  <form
    action={async (values: FormData) => {
      const { error } = await action(values);
      if (error) alert(error);
    }}
    className="flex flex-col gap-6"
  >
    <div className="flex gap-6">
      <Input label="First name" name="firstName" required />
      <Input label="Last name" name="lastName" required />
    </div>
    <Input label="Email address" name="email" required type="email" />
    <Input
      label="Password"
      minLength={6}
      name="password"
      required
      type="password"
    />
    <Button
      className="mt-8 w-full"
      loadingText="Creating account…"
      type="submit"
    >
      Create account
    </Button>
  </form>
);

export default SignUpForm;
