'use client';

import Button from '@/_components/button';
import Input from '@/_components/input';
import InputRoot from '@/_components/input-root';
import * as Label from '@/_components/label';
import PageModalBackButton from '@/_components/page-modal-back-button';
import upsertTrainingPlan from '@/_mutations/upsert-training-plan';
import { GetTrainingPlanData } from '@/_queries/get-training-plan';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';
import { useForm } from 'react-hook-form';

interface TrainingPlanFormProps {
  subjectId: string;
  trainingPlan?: NonNullable<GetTrainingPlanData>;
}

export interface TrainingPlanFormValues {
  name: string;
}

const TrainingPlanForm = ({
  subjectId,
  trainingPlan,
}: TrainingPlanFormProps) => {
  const [isTransitioning, startTransition] = useTransition();

  const form = useForm<TrainingPlanFormValues>({
    defaultValues: { name: trainingPlan?.name },
  });

  const router = useRouter();

  return (
    <form
      className="flex flex-col gap-8 px-4 pb-8 pt-6 sm:px-8"
      onSubmit={form.handleSubmit((values) =>
        startTransition(async () => {
          const res = await upsertTrainingPlan(
            { subjectId, trainingPlanId: trainingPlan?.id },
            values,
          );

          if (res?.error) {
            form.setError('root', { message: res.error, type: 'custom' });
            return;
          }

          if (trainingPlan) {
            router.back();
          } else if (res.data) {
            router.replace(
              `/subjects/${subjectId}/training-plans/${res.data.id}/sessions`,
            );
          }
        }),
      )}
    >
      <InputRoot>
        <Label.Root htmlFor="name">Name</Label.Root>
        <Label.Tip>
          Succinctly describe the goal or purpose of the training plan.
        </Label.Tip>
        <Input maxLength={49} required {...form.register('name')} />
      </InputRoot>
      {form.formState.errors.root && (
        <div className="text-center">{form.formState.errors.root.message}</div>
      )}
      <div className="flex gap-4 pt-8">
        <PageModalBackButton className="w-full" colorScheme="transparent">
          Close
        </PageModalBackButton>
        <Button
          className="w-full"
          loading={isTransitioning}
          loadingText="Saving…"
          type="submit"
        >
          {trainingPlan ? 'Save' : 'Continue'}
        </Button>
      </div>
    </form>
  );
};

export default TrainingPlanForm;
