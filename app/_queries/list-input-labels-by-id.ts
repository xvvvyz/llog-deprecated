'use server';

import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listInputLabelsById = (ids: string[]) =>
  createServerSupabaseClient().rpc('list_input_labels_by_id', {
    ids,
  }) as unknown as Promise<{
    data: Array<{
      id: string;
      label: string;
    }> | null;
  }>;

export type ListInputLabelsByIdData = Awaited<
  ReturnType<typeof listInputLabelsById>
>['data'];

export default listInputLabelsById;
