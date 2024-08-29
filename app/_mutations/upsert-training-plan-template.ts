'use server';

import { TrainingPlanTemplateFormValues } from '@/_components/training-plan-template-form';
import TemplateType from '@/_constants/enum-template-type';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const upsertTrainingPlanTemplate = async (
  context: { templateId?: string },
  data: TrainingPlanTemplateFormValues,
) => {
  const supabase = createServerSupabaseClient();

  const { error } = await supabase
    .from('templates')
    .upsert({
      data: {
        sessions: data.sessions.map((session) => ({
          modules: session.modules.map((module) => ({
            content: module.content,
            inputIds: module.inputs.map((input) => input.id),
            name: module.name?.trim(),
          })),
          title: session.title?.trim(),
        })),
      },
      id: context.templateId,
      name: data.name.trim(),
      public: false,
      type: TemplateType.TrainingPlan,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
};

export default upsertTrainingPlanTemplate;
