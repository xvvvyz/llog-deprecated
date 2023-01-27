'use client';

import Button from 'components/button';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { Database } from 'types/database';
import supabase from 'utilities/browser-supabase-client';
import sleep from 'utilities/sleep';
import uploadSubjectAvatar from 'utilities/upload-subject-avatar';
import useAvatarDropzone from 'utilities/use-avatar-dropzone';
import SubjectDetailsFormSection from '../../components/subject-details-form-section';

type AddSubjectFormValues = Database['public']['Tables']['subjects']['Insert'];

const AddSubjectForm = () => {
  const dropzone = useAvatarDropzone();
  const form = useForm<AddSubjectFormValues>({ defaultValues: { name: '' } });
  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-6"
      onSubmit={form.handleSubmit(async ({ name }) => {
        const { data: subjectData, error: subjectError } = await supabase
          .from('subjects')
          .insert({ name })
          .select('id')
          .single();

        if (subjectError) {
          alert(subjectError.message);
          return;
        }

        await uploadSubjectAvatar({ dropzone, subjectId: subjectData.id });
        await router.push(`/subjects/${subjectData.id}/settings`);
        await router.refresh();
        await sleep();
      })}
    >
      <SubjectDetailsFormSection<AddSubjectFormValues>
        dropzone={dropzone}
        file={dropzone.acceptedFiles[0]}
        form={form}
      />
      <Button
        className="mt-6 w-full"
        loading={form.formState.isSubmitting}
        loadingText="Saving…"
        type="submit"
      >
        Save
      </Button>
    </form>
  );
};

export default AddSubjectForm;
