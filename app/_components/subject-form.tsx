'use client';

import AvatarDropzone from '@/_components/avatar-dropzone';
import Button from '@/_components/button';
import IconButton from '@/_components/icon-button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import * as Modal from '@/_components/modal';
import RichTextarea from '@/_components/rich-textarea';
import Select from '@/_components/select-v2';
import Tip from '@/_components/tip';
import createTag from '@/_mutations/create-tag';
import upsertAvatar from '@/_mutations/upsert-avatar';
import upsertSubject from '@/_mutations/upsert-subject';
import { GetSubjectData } from '@/_queries/get-subject';
import { ListTagsData } from '@/_queries/list-tags';
import { SubjectDataJson } from '@/_types/subject-data-json';
import PlusIcon from '@heroicons/react/24/outline/PlusIcon';
import XMarkIcon from '@heroicons/react/24/outline/XMarkIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';

interface SubjectFormProps {
  subject?: NonNullable<GetSubjectData>;
  tags: NonNullable<ListTagsData>;
}

export interface SubjectFormValues {
  avatar: File | string | null;
  data: SubjectDataJson;
  name: string;
  tags: string[];
}

const SubjectForm = ({ subject, tags }: SubjectFormProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();
  const subjectData = subject?.data as SubjectDataJson;

  const form = useForm<SubjectFormValues>({
    defaultValues: {
      avatar: subject?.image_uri,
      data: subjectData,
      name: subject?.name,
      tags: subject?.tags?.map((t) => t.tag_id) ?? [],
    },
  });

  const linkArray = useFieldArray({
    control: form.control,
    name: 'data.links',
  });

  const avatar = form.watch('avatar');

  return (
    <form
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          if (subject) {
            await upsertAvatar({
              avatar: values.avatar,
              bucket: 'subjects',
              id: subject.id,
            });
          }

          const res = await upsertSubject(
            { subjectId: subject?.id },
            { data: values.data, name: values.name, tags: values.tags },
          );

          if (res.error) {
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          if (subject) {
            router.back();
            return;
          }

          await upsertAvatar({
            avatar: values.avatar,
            bucket: 'subjects',
            id: res.data!.id,
          });

          router.replace(`/subjects/${res.data!.id}`);
        }),
      )}
    >
      <InputRoot>
        <Label.Root htmlFor="name">Name</Label.Root>
        <Label.Tip>Who or what are you tracking?</Label.Tip>
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
          avatarId={subject?.id}
          file={avatar}
          id="avatar"
          onDrop={(files) => form.setValue('avatar', files[0])}
        />
      </InputRoot>
      <InputRoot>
        <Label.Root htmlFor="data.banner">Banner</Label.Root>
        <Label.Tip>
          An optional note displayed at the top of the subject&rsquo;s profile.
        </Label.Tip>
        <Controller
          control={form.control}
          name="data.banner"
          render={({ field }) => <RichTextarea {...field} />}
        />
      </InputRoot>
      <fieldset className="group">
        <div className="flex justify-between">
          <span className="label">Links</span>
          <Tip className="relative -top-1 -mr-1" side="left">
            Optional links displayed at the top of the subject&rsquo;s profile.
          </Tip>
        </div>
        <div className="space-y-2">
          {!!linkArray.fields.length && (
            <ul className="flex flex-col gap-2">
              {linkArray.fields.map((link, linkIndex) => (
                <li className="relative" key={link.id}>
                  <Input
                    className="rounded-b-none border-b-0 pr-[2.4rem]"
                    placeholder="Label…"
                    required
                    {...form.register(`data.links.${linkIndex}.label`)}
                  />
                  <Input
                    className="rounded-t-none"
                    placeholder="https://…"
                    required
                    type="url"
                    {...form.register(`data.links.${linkIndex}.url`)}
                  />
                  <div className="absolute right-0 top-0 flex h-[2.625rem] w-[2.4rem] items-center justify-center">
                    <IconButton
                      className="m-0 h-full w-full justify-center p-0"
                      icon={<XMarkIcon className="w-5" />}
                      label="Delete link"
                      onClick={() => linkArray.remove(linkIndex)}
                      tabIndex={-1}
                    />
                  </div>
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
      <InputRoot>
        <Label.Root>Tags</Label.Root>
        <Controller
          control={form.control}
          name="tags"
          render={({ field }) => (
            <Select
              isCreatable
              isMulti
              onCreateOption={async (name: string) => {
                const { data, error } = await createTag({ name });

                if (error) {
                  alert(error);
                  return;
                }

                field.onChange([...field.value, data.id]);
                router.refresh();
              }}
              optionName="tag"
              options={tags.map((tag) => ({ id: tag.id, label: tag.name }))}
              {...field}
            />
          )}
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

export default SubjectForm;
