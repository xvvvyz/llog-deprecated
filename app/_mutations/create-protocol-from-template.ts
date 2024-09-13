'use server';

import TemplateType from '@/_constants/enum-template-type';
import upsertProtocol from '@/_mutations/upsert-protocol';
import upsertSession from '@/_mutations/upsert-session';
import getTemplate from '@/_queries/get-template';
import listInputsBySubjectId from '@/_queries/list-inputs-by-subject-id';
import { ProtocolTemplateDataJson } from '@/_types/protocol-template-data-json';

const createProtocolFromTemplate = async ({
  subjectId,
  templateId,
}: {
  subjectId: string;
  templateId: string;
}) => {
  const getTemplateRes = await getTemplate(templateId);
  if (getTemplateRes.error) return { error: getTemplateRes.error.message };

  if (getTemplateRes.data.type !== TemplateType.Protocol) {
    return { error: 'Invalid template' };
  }

  const availableInputsRes = await listInputsBySubjectId(subjectId);

  if (availableInputsRes.error) {
    return { error: availableInputsRes.error };
  }

  const upsertProtocolRes = await upsertProtocol(
    { subjectId },
    { name: getTemplateRes.data.name },
  );

  if (upsertProtocolRes.error || !upsertProtocolRes.data?.id) {
    return { error: upsertProtocolRes.error };
  }

  const data = getTemplateRes.data.data as ProtocolTemplateDataJson;

  await Promise.all(
    data?.sessions.map((session, i) =>
      upsertSession(
        {
          currentOrder: i,
          protocolId: upsertProtocolRes.data.id,
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

  return { data: upsertProtocolRes.data };
};

export default createProtocolFromTemplate;
