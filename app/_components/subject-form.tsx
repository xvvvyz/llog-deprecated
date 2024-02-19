'use client';

import upsertSubject from '@/_actions/upsert-subject';
import AvatarDropzone from '@/_components/avatar-dropzone';
import Button from '@/_components/button';
import Input from '@/_components/input';
import RichTextarea from '@/_components/rich-textarea';
import { GetSubjectData } from '@/_queries/get-subject';
import { useState } from 'react';
import { useFormState } from 'react-dom';

interface SubjectFormProps {
  back: string;
  subject?: NonNullable<GetSubjectData>;
}

const SubjectForm = ({ back, subject }: SubjectFormProps) => {
  const [avatar, setAvatar] = useState<File | string | null | undefined>(
    subject?.image_uri,
  );

  const [banner, setBanner] = useState<string | null | undefined>(
    subject?.banner,
  );

  const [state, action] = useFormState(
    upsertSubject.bind(null, {
      banner,
      deleteAvatar: avatar === null,
      next: back,
      subjectId: subject?.id,
    }),
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
        <Input
          defaultValue={subject?.name}
          label="Name"
          maxLength={49}
          name="name"
          required
        />
        <div className="relative">
          <label className="group">
            <span className="label">Profile image</span>
            <AvatarDropzone
              file={avatar}
              id={subject?.id}
              onDrop={(files) => setAvatar(files[0])}
            />
          </label>
          {avatar && (
            <Button
              className="absolute right-2 top-0"
              onClick={setAvatar.bind(null, null)}
              variant="link"
            >
              Remove image
            </Button>
          )}
        </div>
        <RichTextarea
          className="px-0 text-center text-fg-4 [&>*]:mx-auto [&>*]:max-w-sm [&>*]:px-4"
          label="Text banner"
          name="banner"
          onChange={(e) => setBanner(e.target.value)}
          tooltip={
            <>
              Add an optional note displayed at the top of your subject&rsquo;s
              profile.
            </>
          }
          value={banner}
        />
      </div>
      {state?.error && (
        <div className="px-4 py-8 text-center sm:px-8">{state.error}</div>
      )}
      <div className="flex gap-4 px-4 py-8 sm:px-8">
        <Button className="w-full" colorScheme="transparent" href={back}>
          Close
        </Button>
        <Button className="w-full" loadingText="Saving…" type="submit">
          Save
        </Button>
      </div>
    </form>
  );
};

export default SubjectForm;
