'use client';

import AvatarDropzone from '@/_components/avatar-dropzone';
import Button from '@/_components/button';
import Input from '@/_components/input';
import useSupabase from '@/_hooks/use-supabase';
import { Database } from '@/_types/database';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useDropzone } from 'react-dropzone';
import { useForm } from 'react-hook-form';

interface AccountFormProps {
  user: User;
}

type AccountFormValues = Database['public']['Tables']['profiles']['Row'] &
  User & {
    avatar?: File | string | null;
    password: string;
  };

const AccountForm = ({ user }: AccountFormProps) => {
  const router = useRouter();
  const supabase = useSupabase();

  const dropzone = useDropzone({
    accept: { 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] },
    maxSize: 10000000,
    multiple: false,
    noClick: true,
  });

  const form = useForm<AccountFormValues>({
    defaultValues: {
      avatar: user?.user_metadata?.image_uri,
      email: user?.email,
      first_name: user?.user_metadata?.first_name,
      id: user?.id,
      last_name: user?.user_metadata?.last_name,
      password: '',
    },
  });

  return (
    <form
      className="form block p-0"
      onSubmit={form.handleSubmit(async (values) => {
        const { error } = await supabase.auth.updateUser({
          data: {
            first_name: values.first_name,
            last_name: values.last_name,
          },
          email: values.email,
          password: values.password || undefined,
        });

        if (error) {
          alert(error?.message);
          return;
        }

        if (values.avatar instanceof File) {
          await supabase.storage
            .from('profiles')
            .upload(`${user.id}/avatar`, values.avatar, { upsert: true });
        }

        router.refresh();
      })}
    >
      <div className="form rounded-none border-0 bg-transparent">
        <div className="flex gap-6">
          <Input label="First name" required {...form.register('first_name')} />
          <Input label="Last name" required {...form.register('last_name')} />
        </div>
        <label className="group">
          <span className="label">Profile image</span>
          <AvatarDropzone dropzone={dropzone} form={form} />
        </label>
      </div>
      <div className="form rounded-none border-x-0 bg-transparent">
        <div>
          <Input
            label="Email address"
            required
            type="email"
            {...form.register('email')}
          />
          {user.new_email && (
            <p className="mt-2 px-4 text-sm text-fg-4">
              Email change confirmation sent to: {user.new_email}
            </p>
          )}
        </div>
        <Input
          label="Password"
          minLength={6}
          placeholder="••••••••••••"
          type="password"
          {...form.register('password')}
        />
      </div>
      <div className="form rounded-none border-0 bg-transparent">
        <Button
          className="w-full"
          loading={form.formState.isSubmitting}
          loadingText="Saving…"
          type="submit"
        >
          Save account settings
        </Button>
      </div>
    </form>
  );
};

export default AccountForm;
