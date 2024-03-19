'use client';

import BackButton from '@/_components/back-button';
import Button from '@/_components/button';
import Input from '@/_components/input';
import upsertMission from '@/_mutations/upsert-mission';
import { GetMissionData } from '@/_queries/get-mission';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

interface MissionFormProps {
  mission?: NonNullable<GetMissionData>;
  subjectId: string;
}

interface MissionFormValues {
  name: string;
}

const MissionForm = ({ mission, subjectId }: MissionFormProps) => {
  const [isTransitioning, startTransition] = useTransition();

  const form = useForm<MissionFormValues>({
    defaultValues: { name: mission?.name },
  });

  const router = useRouter();

  return (
    <form
      className="divide-y divide-alpha-1"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const res = await upsertMission(
            { missionId: mission?.id, subjectId },
            values,
          );

          if (res?.error) {
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          localStorage.setItem('refresh', '1');

          if (mission) {
            router.back();
          } else if (res.data) {
            router.replace(
              `/subjects/${subjectId}/training-plans/${res.data.id}/sessions`,
            );
          }
        }),
      )}
    >
      <div className="px-4 py-8 sm:px-8">
        <Input
          label="Name"
          maxLength={49}
          required
          {...form.register('name')}
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
          {mission ? 'Save' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};

export type { MissionFormValues };
export default MissionForm;
