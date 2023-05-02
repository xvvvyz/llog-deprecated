'use client';

import Button from '(components)/button';
import { Database } from '(types)/database';
import supabase from '(utilities)/global-supabase-client';
import uploadSubjectAvatar from '(utilities)/upload-subject-avatar';
import useAvatarDropzone from '(utilities)/use-avatar-dropzone';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import { useForm } from 'react-hook-form';
import SubjectDetailsFormSection from '../../../(components)/subject-details-form-section';

type CreateSubjectFormValues =
  Database['public']['Tables']['subjects']['Insert'] & {
    avatar?: File;
  };

const CreateSubjectForm = () => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const dropzone = useAvatarDropzone();

  const form = useForm<CreateSubjectFormValues>({
    defaultValues: { name: '' },
  });

  return (
    <form
      className="flex flex-col gap-6 sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8"
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
