'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import { useRouter } from 'next/navigation';

interface SignUpFormProps {
  action: (values: FormData) => Promise<{ error?: string }>;
  actionRedirect: string;
}

const SignUpForm = ({ action, actionRedirect }: SignUpFormProps) => {
  const router = useRouter();

  return (
    <form
      action={async (values: FormData) => {
        const { error } = await action(values);
        if (error) alert(error);
        else router.push(actionRedirect);
      }}
      className="flex flex-col gap-6"
    >
      <div className="flex gap-6">
        <Input label="First name" name="firstName" />
        <Input label="Last name" name="lastName" />
      </div>
      <Input label="Email address" name="email" type="email" />
      <Input label="Password" name="password" type="password" />
      <Button
        className="mt-8 w-full"
        loadingText="Creating account…"
        type="submit"
      >
        Create account
      </Button>
    </form>
  );
};

export default SignUpForm;
