'use client';

import Button from '@/_components/button';
import * as Modal from '@/_components/modal';
import Select from '@/_components/select';
import createTrainingPlanFromTemplate from '@/_mutations/create-training-plan-from-template';
import { ListTemplatesData } from '@/_queries/list-templates';
import DocumentTextIcon from '@heroicons/react/24/outline/DocumentTextIcon';
import { useRouter } from 'next/navigation';
import { useTransition } from 'react';

interface TrainingPlanUseTemplateModalProps {
  availableTrainingPlanTemplates: NonNullable<ListTemplatesData>;
  subjectId: string;
}

const TrainingPlanUseTemplateModal = ({
  availableTrainingPlanTemplates,
  subjectId,
}: TrainingPlanUseTemplateModalProps) => {
  const [isTransitioning, startTransition] = useTransition();
  const router = useRouter();

  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <Button className="pr-2 sm:pr-6" variant="link">
          <DocumentTextIcon className="w-5 text-fg-4" />
          Use template
        </Button>
      </Modal.Trigger>
      <Modal.Portal>
        <Modal.Overlay>
          <Modal.Content className="max-w-sm p-8 text-center">
            <Modal.Title className="text-2xl">Use template</Modal.Title>
            <Modal.Description className="mt-4 px-4 text-fg-4">
              Who said creating an entire training plan had to be hard?
            </Modal.Description>
            <div className="pt-16 text-left">
              <Select
                isLoading={isTransitioning}
                noOptionsMessage={() => 'No templates.'}
                onChange={(t) =>
                  startTransition(async () => {
                    const template = t as NonNullable<ListTemplatesData>[0];

                    const res = await createTrainingPlanFromTemplate({
                      subjectId,
                      templateId: template.id,
                    });

                    if (res.error) {
                      alert(res.error);
                      return;
                    }

                    router.replace(
                      `/subjects/${subjectId}/training-plans/${res.data?.id}/sessions`,
                    );
                  })
                }
                options={availableTrainingPlanTemplates}
                placeholder="Select a template…"
                value={null}
              />
            </div>
            <Modal.Close asChild>
              <Button
                className="-mb-3 mt-14 w-full justify-center p-0 py-3"
                variant="link"
              >
                Close
              </Button>
            </Modal.Close>
          </Modal.Content>
        </Modal.Overlay>
      </Modal.Portal>
    </Modal.Root>
  );
};

export default TrainingPlanUseTemplateModal;
