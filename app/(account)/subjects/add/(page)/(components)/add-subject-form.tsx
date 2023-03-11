'use client';

import Button from '(components)/button';
import { Database } from '(types)/database';
import supabase from '(utilities)/browser-supabase-client';
import uploadSubjectAvatar from '(utilities)/upload-subject-avatar';
import useAvatarDropzone from '(utilities)/use-avatar-dropzone';
import useSubmitRedirect from '(utilities)/use-submit-redirect';
import { useForm } from 'react-hook-form';
import SubjectDetailsFormSection from '../../../(components)/subject-details-form-section';

type AddSubjectFormValues =
  Database['public']['Tables']['subjects']['Insert'] & {
    avatar?: File;
  };

const AddSubjectForm = () => {
  const [redirect, isRedirecting] = useSubmitRedirect();
  const dropzone = useAvatarDropzone();
  const form = useForm<AddSubjectFormValues>({ defaultValues: { name: '' } });

  return (
    <form
      className="flex flex-col gap-6 sm:rounded sm:border sm:border-alpha-1 sm:bg-bg-2 sm:p-8"
      onSubmit={form.handleSubmit(async ({ avatar, name }) => {
        const { error: updateUserError } = await supabase.auth.updateUser({
          data: { is_client: false },
        });

        if (updateUserError) {
          alert(updateUserError.message);
          return;
        }

        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .insert({ name: name.trim() })
          .select('id')
          .single();

        if (subjectError) {
          alert(subjectError.message);
          return;
        }

        await uploadSubjectAvatar({ avatar, subjectId: subjectData.id });
        await redirect(`/subjects/${subjectData.id}/settings`);
      })}
    >
      <SubjectDetailsFormSection<AddSubjectFormValues>
        dropzone={dropzone}
        form={form}
      />
      <Button
        className="mt-4 w-full"
        loading={form.formState.isSubmitting || isRedirecting}
        loadingText="Saving…"
        type="submit"
      >
        Add Subject
      </Button>
    </form>
  );
};

export default AddSubjectForm;
