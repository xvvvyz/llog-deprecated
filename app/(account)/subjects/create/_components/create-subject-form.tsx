'use client';

import useAvatarDropzone from '@/(account)/_hooks/use-avatar-dropzone';
import useSubmitRedirect from '@/(account)/_hooks/use-submit-redirect';
import useSupabase from '@/(account)/_hooks/use-supabase';
import uploadSubjectAvatar from '@/(account)/_utilities/upload-subject-avatar';
import SubjectDetailsFormSection from '@/(account)/subjects/_components/subject-details-form-section';
import Button from '@/_components/button';
import { Database } from '@/_types/database';
import { useForm } from 'react-hook-form';

type CreateSubjectFormValues =
  Database['public']['Tables']['subjects']['Insert'] & {
    avatar?: File;
  };

const CreateSubjectForm = () => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const dropzone = useAvatarDropzone();
  const supabase = useSupabase();

  const form = useForm<CreateSubjectFormValues>({
    defaultValues: { name: '' },
  });

  return (
    <form
      className="flex flex-col gap-6 rounded border border-alpha-1 bg-bg-2 px-4 py-8 sm:px-8"
      onSubmit={form.handleSubmit(async (values) => {
        const { error: updateUserError } = await supabase.auth.updateUser({
          data: { is_client: false },
        });

        if (updateUserError) {
          alert(updateUserError.message);
          return;
        }

        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .insert({
            birthdate: values.birthdate,
            name: values.name.trim(),
            species: values.species?.trim(),
          })
          .select('id')
          .single();

        if (subjectError) {
          alert(subjectError.message);
          return;
        }

        await uploadSubjectAvatar({
          avatar: values.avatar,
          subjectId: subjectData.id,
          supabase,
        });

        await redirect(`/subjects/${subjectData.id}/settings`);
      })}
    >
      <SubjectDetailsFormSection<CreateSubjectFormValues>
        dropzone={dropzone}
        form={form}
      />
      <Button
        className="mt-8 w-full"
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        Create subject
      </Button>
    </form>
  );
};

export default CreateSubjectForm;
