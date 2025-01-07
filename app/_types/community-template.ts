import TemplateType from '@/_constants/enum-template-type';

type CommunityTemplate = {
  author: {
    first_name: string;
    id: string;
    image_uri: string;
    last_name: string;
  };
  data?: string;
  description?: string;
  id: string;
  name: string;
  type: TemplateType;
  updated_at: string;
};

export default CommunityTemplate;
