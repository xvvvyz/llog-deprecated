import TemplateType from '@/_constants/enum-template-type';

const TEMPLATE_TYPE_SLUGS = {
  [TemplateType.EventType]: 'event-types',
  [TemplateType.Module]: 'modules',
  [TemplateType.Session]: 'sessions',
  [TemplateType.TrainingPlan]: 'training-plans',
};

export default TEMPLATE_TYPE_SLUGS;
