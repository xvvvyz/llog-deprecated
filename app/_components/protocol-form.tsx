'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import * as Modal from '@/_components/modal';
import upsertProtocol from '@/_mutations/upsert-protocol';
import { GetProtocolData } from '@/_queries/get-protocol';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

interface ProtocolFormProps {
  protocol?: NonNullable<GetProtocolData>;
  subjectId: string;
}

export interface ProtocolFormValues {
  name: string;
}

const ProtocolForm = ({ protocol, subjectId }: ProtocolFormProps) => {
  const [isTransitioning, startTransition] = useTransition();

  const form = useForm<ProtocolFormValues>({
    defaultValues: { name: protocol?.name },
  });

  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const res = await upsertProtocol(
            { protocolId: protocol?.id, subjectId },
            values,
          );

          if (res?.error) {
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          if (protocol) {
            router.back();
          } else if (res.data) {
            router.replace(
              `/subjects/${subjectId}/protocols/${res.data.id}/sessions`,
            );
          }
        }),
      )}
    >
      <InputRoot>
        <Label.Root htmlFor="name">Name</Label.Root>
        <Label.Tip>
          Succinctly describe the goal or purpose of the protocol.
        </Label.Tip>
        <Input maxLength={49} required {...form.register('name')} />
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
          {protocol ? 'Save' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};

export default ProtocolForm;
