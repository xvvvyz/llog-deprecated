'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import { useBoolean } from 'usehooks-ts';

interface SignUpFormProps {
  action: (values: FormData) => Promise<{ error?: string }>;
}

const SignUpForm = ({ action }: SignUpFormProps) => {
  const emailSent = useBoolean();

  return (
    <form
      action={async (values: FormData) => {
        const { error } = await action(values);
        if (error) alert(error);
        else emailSent.setTrue();
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex gap-6">
        <Input disabled={emailSent.value} label="First name" name="firstName" />
        <Input disabled={emailSent.value} label="Last name" name="lastName" />
      </div>
      <Input
        disabled={emailSent.value}
        label="Email address"
        name="email"
        type="email"
      />
      <Input
        disabled={emailSent.value}
        label="Password"
        name="password"
        type="password"
      />
      <Button
        className="mt-8 w-full"
        disabled={emailSent.value}
        loadingText="Creating account…"
        type="submit"
      >
        {emailSent.value ? 'We sent you an email' : 'Create account'}
      </Button>
    </form>
  );
};

export default SignUpForm;
