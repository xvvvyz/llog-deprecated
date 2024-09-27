'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import * as Modal from '@/_components/modal';
import updateUser from '@/_mutations/update-user';
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
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const res = await updateUser({ email: values.email });

          if (res?.error) {
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          if (values.email !== user.email) router.push('/confirmation-sent');
          else router.back();
        }),
      )}
    >
      <InputRoot>
        <Label.Root htmlFor="email">Email address</Label.Root>
        <Input required type="email" {...form.register('email')} />
      </InputRoot>
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      <div className="flex gap-4 pt-8">
        <Modal.Close asChild>
          <Button className="w-full" colorScheme="transparent">
            Close
          </Button>
        </Modal.Close>
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
