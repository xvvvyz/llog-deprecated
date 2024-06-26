'use server';

import InputType from '@/_constants/enum-input-type';
import createServerSupabaseClient from '@/_utilities/create-server-supabase-client';

const listInputsByIds = (ids: string[]) =>
  createServerSupabaseClient().rpc('list_inputs_by_id', {
    ids,
  }) as unknown as Promise<{
    data: Array<{
      id: string;
      label: string;
      type: InputType;
    }> | null;
  }>;

export type ListInputLabelsByIdData = Awaited<
  ReturnType<typeof listInputsByIds>
>['data'];

export default listInputsByIds;
