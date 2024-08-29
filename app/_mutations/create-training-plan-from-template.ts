'use server';

import TemplateType from '@/_constants/enum-template-type';
import upsertSession from '@/_mutations/upsert-session';
import upsertTrainingPlan from '@/_mutations/upsert-training-plan';
import getTemplate from '@/_queries/get-template';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import { TrainingPlanTemplateDataJson } from '@/_types/training-plan-template-data-json';

const createTrainingPlanFromTemplate = async ({
  subjectId,
  templateId,
}: {
  subjectId: string;
  templateId: string;
}) => {
  const getTemplateRes = await getTemplate(templateId);
  if (getTemplateRes.error) return { error: getTemplateRes.error.message };

  if (getTemplateRes.data.type !== TemplateType.TrainingPlan) {
    return { error: 'Invalid template' };
  }

  const availableInputsRes = await listInputsBySubjectId(subjectId);

  if (availableInputsRes.error) {
    return { error: availableInputsRes.error };
  }

  const upsertTrainingPlanRes = await upsertTrainingPlan(
    { subjectId },
    { name: getTemplateRes.data.name },
  );

  if (upsertTrainingPlanRes.error || !upsertTrainingPlanRes.data?.id) {
    return { error: upsertTrainingPlanRes.error };
  }

  const data = getTemplateRes.data.data as TrainingPlanTemplateDataJson;

  await Promise.all(
    data?.sessions.map((session, i) =>
      upsertSession(
        {
          currentOrder: i,
          missionId: upsertTrainingPlanRes.data.id,
          publishedOrder: i,
          subjectId,
        },
        {
          draft: false,
          modules: session.modules.map((module) => ({
            content: module.content ?? '',
            inputs: availableInputsRes.data.filter((input) =>
              module.inputIds?.includes(input.id),
            ),
            name: module.name ?? '',
          })),
          scheduledFor: null,
          title: session.title,
        },
      ),
    ) ?? [],
  );

  return { data: upsertTrainingPlanRes.data };
};

export default createTrainingPlanFromTemplate;
