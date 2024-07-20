'use client';

import AvatarDropzone from '@/_components/avatar-dropzone';
import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import RichTextarea from '@/_components/rich-textarea';
import Tip from '@/_components/tip';
import upsertSubject from '@/_mutations/upsert-subject';
import { GetSubjectData } from '@/_queries/get-subject';
import { SubjectDataJson } from '@/_types/subject-data-json';
import createBrowserSupabaseClient from '@/_utilities/create-browser-supabase-client';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

interface SubjectFormProps {
  subject?: NonNullable<GetSubjectData>;
}

type SubjectFormValues = {
  avatar: File | string | null;
  data: SubjectDataJson;
  name: string;
};

const SubjectForm = ({ subject }: SubjectFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const subjectData = subject?.data as SubjectDataJson;

  const form = useForm<SubjectFormValues>({
    defaultValues: {
      avatar: subject?.image_uri,
      data: subjectData,
      name: subject?.name,
    },
  });

  const linkArray = useFieldArray({
    control: form.control,
    name: 'data.links',
  });

  return (
    <form
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const res = await upsertSubject(
            { subjectId: subject?.id },
            { data: values.data, name: values.name },
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
          if (!subject?.id) router.replace(`/subjects/${subjectId}`);
          else router.back();
        }),
      )}
    >
      <Input
        label="Name"
        maxLength={49}
        required
        tooltip="Who or what are you tracking?"
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
        name="data.banner"
        render={({ field }) => (
          <RichTextarea
            label="Note"
            tooltip={
              <>
                An optional note displayed at the top of the subject&rsquo;s
                profile.
              </>
            }
            {...field}
          />
        )}
      />
      <fieldset className="group">
        <div className="flex justify-between">
          <span className="label">Links</span>
          <Tip className="relative -top-1 -mr-[0.2rem]" side="left">
            Optional links displayed at the top of the subject&rsquo;s profile.
          </Tip>
        </div>
        <div className="space-y-2">
          {!!linkArray.fields.length && (
            <ul className="flex flex-col gap-2">
              {linkArray.fields.map((link, linkIndex) => (
                <li key={link.id}>
                  <Controller
                    control={form.control}
                    name={`data.links.${linkIndex}.label`}
                    render={({ field }) => (
                      <Input
                        className="rounded-b-none border-b-0"
                        placeholder="Label…"
                        required
                        right={
                          <IconButton
                            className="m-0 h-full w-full justify-center p-0"
                            icon={<XMarkIcon className="w-5" />}
                            label="Delete link"
                            onClick={() => linkArray.remove(linkIndex)}
                            tabIndex={-1}
                          />
                        }
                        {...field}
                      />
                    )}
                  />
                  <Controller
                    control={form.control}
                    name={`data.links.${linkIndex}.url`}
                    render={({ field }) => (
                      <Input
                        className="rounded-t-none"
                        placeholder="https://…"
                        required
                        type="url"
                        {...field}
                      />
                    )}
                  />
                </li>
              ))}
            </ul>
          )}
          <Button
            className="w-full"
            colorScheme="transparent"
            onClick={() => linkArray.append({ label: '', url: '' })}
          >
            <PlusIcon className="w-5" />
            Add link
          </Button>
        </div>
      </fieldset>
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      <div className="flex gap-4 pt-8">
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
