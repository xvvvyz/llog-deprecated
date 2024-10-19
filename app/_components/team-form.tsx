'use client';

import AvatarDropzone from '@/_components/avatar-dropzone';
import Button from '@/_components/button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import * as Modal from '@/_components/modal';
import setActiveTeam from '@/_mutations/set-active-team';
import upsertAvatar from '@/_mutations/upsert-avatar';
import upsertTeam from '@/_mutations/upsert-team';
import { GetTeamData } from '@/_queries/get-team';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

interface TeamFormProps {
  team?: NonNullable<GetTeamData>;
}

export interface TeamFormValues {
  avatar: File | string | null;
  name: string;
}

const AccountProfileForm = ({ team }: TeamFormProps) => {
  const [isTransitioning, startTransition] = useTransition();

  const form = useForm<TeamFormValues>({
    defaultValues: { avatar: team?.image_uri, name: team?.name },
  });

  const router = useRouter();
  const avatar = form.watch('avatar');

  return (
    <form
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          if (team) {
            await upsertAvatar({
              avatar: values.avatar,
              bucket: 'teams',
              id: team.id,
            });
          }

          const res = await upsertTeam(
            { teamId: team?.id },
            { name: values.name },
          );

          if (res?.error) {
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          const teamId = res.data!.id;

          if (team) {
            router.back();
            return;
          }

          await upsertAvatar({
            avatar: values.avatar,
            bucket: 'teams',
            id: teamId,
          });

          await setActiveTeam(teamId);
          router.push('/subjects');
        }),
      )}
    >
      <InputRoot>
        <Label.Root htmlFor="name">Name</Label.Root>
        <Input maxLength={49} required {...form.register('name')} />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="avatar">Image</Label.Root>
        {avatar && (
          <Label.Button onClick={() => form.setValue('avatar', null)}>
            Remove image
          </Label.Button>
        )}
        <AvatarDropzone
          avatarId={team?.id}
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
