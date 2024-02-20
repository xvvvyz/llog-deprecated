'use client';

import updateAccount from '@/_actions/update-account';
import AvatarDropzone from '@/_components/avatar-dropzone';
import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Input from '@/_components/input';
import { User } from '@supabase/supabase-js';
import { useSearchParams } from 'next/navigation';
import { useState } from 'react';
import { useFormState } from 'react-dom';

interface AccountProfileFormProps {
  user: User;
}

const AccountProfileForm = ({ user }: AccountProfileFormProps) => {
  const [avatar, setAvatar] = useState<File | string | null | undefined>(
    user.user_metadata.image_uri,
  );

  const [state, action] = useFormState(
    updateAccount.bind(null, { next: useSearchParams().get('back') as string }),
    null,
  );

  return (
    <form
      action={(formData: FormData) => {
        if (avatar) formData.append('avatar', avatar);
        action(formData);
      }}
      className="divide-y divide-alpha-1"
    >
      <div className="flex flex-col gap-6 px-4 py-8 sm:px-8">
        <div className="flex gap-6">
          <Input
            defaultValue={user.user_metadata.first_name}
            label="First name"
            name="first-name"
            required
          />
          <Input
            defaultValue={user.user_metadata.last_name}
            label="Last name"
            name="last-name"
            required
          />
        </div>
        <div className="relative">
          <label className="group">
            <span className="label">Profile image</span>
            <AvatarDropzone
              file={avatar}
              id={user.id}
              onDrop={(files) => setAvatar(files[0])}
            />
          </label>
          {avatar && (
            <Button
              className="absolute right-2 top-0"
              onClick={() => setAvatar(null)}
              variant="link"
            >
              Remove image
            </Button>
          )}
        </div>
      </div>
      {state?.error && (
        <div className="px-4 py-8 text-center sm:px-8">{state.error}</div>
      )}
      <div className="flex gap-4 px-4 py-8 sm:px-8">
        <BackButton className="w-full" colorScheme="transparent">
          Close
        </BackButton>
        <Button className="w-full" loadingText="Saving…" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};

export default AccountProfileForm;
