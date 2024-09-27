'use server';

import { ProtocolFormValues } from '@/_components/protocol-form';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';
import { revalidatePath } from 'next/cache';

const upsertProtocol = async (
  context: { subjectId: string; protocolId?: string },
  data: ProtocolFormValues,
) => {
  const supabase = await createServerSupabaseClient();

  const { data: protocol, error } = await supabase
    .from('protocols')
    .upsert({
      id: context.protocolId,
      name: data.name,
      subject_id: context.subjectId,
    })
    .select('id')
    .single();

  if (error) return { error: error.message };
  revalidatePath('/', 'layout');
  return { data: protocol };
};

export default upsertProtocol;
