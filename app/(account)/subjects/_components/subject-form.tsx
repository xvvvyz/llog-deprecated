'use client';

import AvatarDropzone from '@/(account)/_components/avatar-dropzone';
import RichTextarea from '@/(account)/_components/rich-textarea';
import CacheKeys from '@/(account)/_constants/enum-cache-keys';
import useDefaultValues from '@/(account)/_hooks/use-default-values';
import useSubmitRedirect from '@/(account)/_hooks/use-submit-redirect';
import { GetSubjectData } from '@/(account)/_server/get-subject';
import sanitizeHtml from '@/(account)/_utilities/sanitize-html';
import uploadSubjectAvatar from '@/(account)/_utilities/upload-subject-avatar';
import Button from '@/_components/button';
import Input from '@/_components/input';
import useSupabase from '@/_hooks/use-supabase';
import { Database } from '@/_types/database';
import { useDropzone } from 'react-dropzone';
import { Controller, useForm } from 'react-hook-form';

interface SubjectFormProps {
  subject?: GetSubjectData;
}

type SubjectFormValues = Database['public']['Tables']['subjects']['Row'] & {
  avatar?: File | string;
};

const SubjectForm = ({ subject }: SubjectFormProps) => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const supabase = useSupabase();

  const dropzone = useDropzone({
    accept: { 'image/*': ['.png', '.gif', '.jpeg', '.jpg'] },
    maxSize: 10000000,
    multiple: false,
    noClick: true,
  });

  const form = useForm<SubjectFormValues>({
    defaultValues: useDefaultValues({
      cacheKey: CacheKeys.SubjectSettingsForm,
      defaultValues: {
        avatar: subject?.image_uri,
        banner: subject?.banner,
        id: subject?.id,
        name: subject?.name ?? '',
      },
    }),
  });

  return (
    <form
      className="form"
      onSubmit={form.handleSubmit(async (values) => {
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .upsert({
            banner: sanitizeHtml(values.banner),
            id: values.id,
            name: values.name.trim(),
          })
          .select('id')
          .single();

        if (subjectError) {
          alert(subjectError.message);
          return;
        }

        await uploadSubjectAvatar({
          avatar: values.avatar,
          subjectId: values.id,
          supabase,
        });

        await redirect(`/subjects/${subjectData.id}/timeline`);
      })}
    >
      <Input label="Name" {...form.register('name')} />
      <label className="group">
        <span className="label">Profile image</span>
        <AvatarDropzone dropzone={dropzone} form={form} />
      </label>
      <Controller
        control={form.control}
        name="banner"
        render={({ field }) => (
          <RichTextarea
            className="px-0 text-center text-fg-3 [&>*]:mx-auto [&>*]:max-w-sm [&>*]:px-4"
            label="Banner"
            {...field}
          />
        )}
      />
      <Button
        className="mb-4 mt-8 w-full"
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        Save subject
      </Button>
    </form>
  );
};

export default SubjectForm;
