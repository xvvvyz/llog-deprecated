'use client';

import AvatarDropzone from '@/_components/avatar-dropzone';
import Button from '@/_components/button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import * as Modal from '@/_components/modal';
import updateUser from '@/_mutations/update-user';
import upsertAvatar from '@/_mutations/upsert-avatar';
import { User } from '@supabase/supabase-js';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

interface AccountProfileFormProps {
  user: User;
}

interface AccountProfileFormValues {
  avatar: File | string | null;
  firstName: string;
  lastName: string;
}

const AccountProfileForm = ({ user }: AccountProfileFormProps) => {
  const [isTransitioning, startTransition] = useTransition();

  const form = useForm<AccountProfileFormValues>({
    defaultValues: {
      avatar: user.user_metadata.image_uri,
      firstName: user.user_metadata.first_name,
      lastName: user.user_metadata.last_name,
    },
  });

  const router = useRouter();
  const avatar = form.watch('avatar');

  return (
    <form
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          await upsertAvatar({
            avatar: values.avatar,
            bucket: 'profiles',
            id: user.id,
          });

          const res = await updateUser({
            firstName: values.firstName,
            lastName: values.lastName,
          });

          if (res?.error) {
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          router.back();
        }),
      )}
    >
      <div className="flex gap-6">
        <InputRoot>
          <Label.Root htmlFor="firstName">First name</Label.Root>
          <Input required {...form.register('firstName')} />
        </InputRoot>
        <InputRoot>
          <Label.Root htmlFor="lastName">Last name</Label.Root>
          <Input required {...form.register('lastName')} />
        </InputRoot>
      </div>
      <InputRoot>
        <Label.Root htmlFor="avatar">Image</Label.Root>
        {avatar && (
          <Label.Button onClick={() => form.setValue('avatar', null)}>
            Remove image
          </Label.Button>
        )}
        <AvatarDropzone
          avatarId={user.id}
          file={avatar}
          id="avatar"
          onDrop={(files) => form.setValue('avatar', files[0])}
        />
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

export default AccountProfileForm;
