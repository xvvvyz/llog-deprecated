import InputType from '@/_constants/enum-input-type';

type CommunityTemplateInput = {
  id: string;
  label: string;
  options: Array<{ label: string; order: number }>;
  type: InputType;
};

export default CommunityTemplateInput;
