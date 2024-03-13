'use client';

import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Input from '@/_components/input';
import createBrowserSupabaseClient from '@/_utilities/create-browser-supabase-client';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

interface AccountEmailFormProps {
  user: User;
}

interface AccountEmailFormValues {
  email: string;
}

const AccountEmailForm = ({ user }: AccountEmailFormProps) => {
  const [isTransitioning, startTransition] = useTransition();

  const form = useForm<AccountEmailFormValues>({
    defaultValues: { email: user.email },
  });

  const router = useRouter();

  return (
    <form
      className="divide-y divide-alpha-1"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const supabase = createBrowserSupabaseClient();
          const res = await supabase.auth.updateUser({ email: values.email });

          if (res?.error) {
            form.setError('root', {
              message: res.error.message,
              type: 'custom',
            });

            return;
          }

          if (form.formState.isDirty) router.push('/confirmation-sent');
          else router.back();
        }),
      )}
    >
      <div className="px-4 py-8 sm:px-8">
        <Input
          label="Email address"
          required
          type="email"
          {...form.register('email')}
        />
      </div>
      {form.formState.errors.root && (
        <div className="px-4 py-8 text-center sm:px-8">
          {form.formState.errors.root.message}
        </div>
      )}
      <div className="flex gap-4 px-4 py-8 sm:px-8">
        <BackButton className="w-full" colorScheme="transparent">
          Close
        </BackButton>
        <Button
          className="w-full"
          loading={isTransitioning}
          loadingText="Saving…"
          type="submit"
        >
          Save
        </Button>
      </div>
    </form>
  );
};

export default AccountEmailForm;
