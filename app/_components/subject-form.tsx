'use client';

import upsertSubject from '@/_actions/upsert-subject';
import AvatarDropzone from '@/_components/avatar-dropzone';
import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Input from '@/_components/input';
import RichTextarea from '@/_components/rich-textarea';
import { GetSubjectData } from '@/_queries/get-subject';
import createBrowserSupabaseClient from '@/_utilities/create-browser-supabase-client';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface SubjectFormProps {
  subject?: NonNullable<GetSubjectData>;
}

type SubjectFormValues = {
  avatar: File | string | null;
  banner: string | null | undefined;
  name: string;
};

const SubjectForm = ({ subject }: SubjectFormProps) => {
  const [isTransitioning, startTransition] = useTransition();

  const form = useForm<SubjectFormValues>({
    defaultValues: {
      avatar: subject?.image_uri,
      banner: subject?.banner,
      name: subject?.name,
    },
  });

  const router = useRouter();

  return (
    <form
      className="divide-y divide-alpha-1"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const res = await upsertSubject(
            { subjectId: subject?.id },
            { banner: values.banner, name: values.name },
          );

          if (res.error) {
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          const supabase = createBrowserSupabaseClient();
          const subjectId = res.data!.id;

          if (!values.avatar) {
            await Promise.all([
              supabase.storage.from('subjects').remove([`${subjectId}/avatar`]),
              supabase
                .from('subjects')
                .update({ image_uri: null })
                .eq('id', subjectId),
            ]);
          }

          if (values.avatar instanceof File) {
            await supabase.storage
              .from('subjects')
              .upload(`${subjectId}/avatar`, values.avatar, { upsert: true });
          }

          localStorage.setItem('refresh', '1');
          if (!subject?.id) router.push(`/subjects/${subjectId}`);
          else router.back();
        }),
      )}
    >
      <div className="flex flex-col gap-6 px-4 py-8 sm:px-8">
        <Input
          label="Name"
          maxLength={49}
          required
          {...form.register('name')}
        />
        <div className="relative">
          <label className="group">
            <span className="label">Profile image</span>
            <AvatarDropzone
              file={form.watch('avatar')}
              id={subject?.id}
              onDrop={(files) => form.setValue('avatar', files[0])}
            />
          </label>
          {form.watch('avatar') && (
            <Button
              className="absolute right-2 top-0"
              onClick={() => form.setValue('avatar', null)}
              variant="link"
            >
              Remove image
            </Button>
          )}
        </div>
        <Controller
          control={form.control}
          name="banner"
          render={({ field }) => (
            <RichTextarea
              className="px-0 text-center text-fg-4 [&>*]:mx-auto [&>*]:max-w-sm [&>*]:px-4"
              label="Text banner"
              tooltip={
                <>
                  Add an optional note displayed at the top of your
                  subject&rsquo;s profile.
                </>
              }
              {...field}
            />
          )}
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

export type { SubjectFormValues };
export default SubjectForm;
